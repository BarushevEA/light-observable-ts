/**
 * QuickObservable — высокопроизводительный Observable для большого числа подписчиков (5+)
 *
 * Реализует интерфейсы:
 * - IObserver<T>: подписка, отписка, emit, getValue
 * - IStream<T>: batch emit (stream)
 * - IAddFilter<T>: входящие фильтры
 *
 * Все подписчики хранятся как SubscribeObject в батчах:
 * - Батчи по 50 подписчиков
 * - Полный батч → инлайн 50 вызовов send()
 * - Неполный батч → итерация по activeSlots
 * - Пропуск пустых батчей
 */

import {SubscribeObject} from "./SubscribeObject";
import {FilterCollection} from "./FilterCollection";
import {
    IAddFilter,
    IErrorCallback,
    IFilterSetup,
    IObserver,
    ISetup,
    IStream,
    ISubscribeGroup,
    ISubscriptionLike
} from "./Types";

// =============================================================================
// INTERNAL TYPES
// =============================================================================

const BATCH_SIZE = 50;

interface IBatchMeta {
    count: number;           // Количество активных [0-BATCH_SIZE]
    isEmpty: boolean;        // count === 0
    isFull: boolean;         // count === BATCH_SIZE
    activeSlots: number[];   // Индексы активных слотов [1, 3, 7, ...]
    nextSlot: number;        // Следующий слот для добавления (1-50), 0 = использовать freeSlots
    freeSlots: number[];     // Стек свободных слотов (после удалений)
}

type QuickBatch<T> = [
    IBatchMeta,
    // 50 slots (1-50)
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null,
    SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null, SubscribeObject<T> | null
];

// =============================================================================
// QUICK OBSERVABLE
// =============================================================================

export class QuickObservable<T> implements IObserver<T>, IStream<T>, IAddFilter<T> {
    private batches: QuickBatch<T>[] = [];
    private batchSubscribers: number = 0;
    private batchProcessing: boolean = false;
    private pendingBatchUnsubscribes: Array<{ batch: QuickBatch<T>; slot: number; activeIndex: number }> = [];

    private enabled: boolean = true;
    private killed = false;
    private filters = new FilterCollection<T>();
    private _value: T;

    constructor(value: T) {
        this._value = value;
    }

    // =========================================================================
    // IAddFilter: Входящие фильтры
    // =========================================================================

    addFilter(errorHandler?: IErrorCallback): IFilterSetup<T> {
        if (errorHandler) this.filters.addErrorHandler(errorHandler);
        return this.filters;
    }

    // =========================================================================
    // IObserver: Enable/Disable
    // =========================================================================

    disable(): void {
        this.enabled = false;
    }

    enable(): void {
        this.enabled = true;
    }

    get isEnable(): boolean {
        return this.enabled;
    }

    // =========================================================================
    // IObserver: Subscribe
    // =========================================================================

    public subscribe(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike | undefined {
        if (this.killed) return undefined;
        if (!observer) return undefined;

        if (Array.isArray(observer)) {
            const subs: ISubscriptionLike[] = [];
            for (const item of observer) {
                if (!item) continue;
                const sub = this.subscribeOne(item, errorHandler);
                if (sub) subs.push(sub);
            }

            let isUnsubscribed = false;
            return {
                unsubscribe: () => {
                    if (isUnsubscribed) return;
                    isUnsubscribed = true;
                    for (const sub of subs) sub.unsubscribe();
                }
            };
        }

        return this.subscribeOne(observer, errorHandler);
    }

    private subscribeOne(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike | undefined {
        const subscribeObject = new SubscribeObject<T>(this as any, false);
        subscribeObject.subscribe(observer, errorHandler);
        this.addToBatch(subscribeObject);
        return subscribeObject;
    }

    public pipe(): ISetup<T> | undefined {
        if (this.killed) return undefined;

        const subscribeObject = new SubscribeObject<T>(this as any, true);
        const self = this;
        const originalSubscribe = subscribeObject.subscribe.bind(subscribeObject);

        (subscribeObject as any).subscribe = function (
            listener: ISubscribeGroup<T>,
            errorHandler?: IErrorCallback
        ): ISubscriptionLike | undefined {
            originalSubscribe(listener, errorHandler);
            self.addToBatch(subscribeObject);
            return subscribeObject;
        };

        return subscribeObject;
    }

    private addToBatch(subscribeObject: SubscribeObject<T>): void {
        let batch: QuickBatch<T> | null = null;

        for (const b of this.batches) {
            if (!b[0].isFull) {
                batch = b;
                break;
            }
        }

        if (!batch) {
            batch = this.createEmptyBatch();
            this.batches.push(batch);
        }

        const meta = batch[0];
        const slotIndex = meta.nextSlot > 0 ? meta.nextSlot++ : meta.freeSlots.pop()!;
        if (meta.nextSlot > BATCH_SIZE) meta.nextSlot = 0;
        const activeIndex = meta.activeSlots.length;

        (batch as any)[slotIndex] = subscribeObject;
        meta.count++;
        meta.isEmpty = false;
        meta.isFull = meta.count === BATCH_SIZE;
        meta.activeSlots.push(slotIndex);
        this.batchSubscribers++;

        (subscribeObject as any)._qBatchRef = {batch, slot: slotIndex, activeIndex};
    }

    // =========================================================================
    // IObserver: Unsubscribe
    // =========================================================================

    public unSubscribe(subscriber: ISubscriptionLike): void {
        if (this.killed) return;
        if (!subscriber) return;

        const ref = (subscriber as any)._qBatchRef;
        if (!ref) return;

        (subscriber as any)._qBatchRef = null;

        if (this.batchProcessing) {
            this.pendingBatchUnsubscribes.push({batch: ref.batch, slot: ref.slot, activeIndex: ref.activeIndex});
        } else {
            this.removeBatchSubscriber(ref.batch, ref.slot, ref.activeIndex);
        }
    }

    public unsubscribeAll(): void {
        if (this.killed) return;

        if (this.batchProcessing) {
            for (const batch of this.batches) {
                for (let i = 1; i <= BATCH_SIZE; i++) {
                    const sub = (batch as any)[i];
                    if (sub) {
                        const ref = sub._qBatchRef;
                        const activeIndex = ref ? ref.activeIndex : 0;
                        this.pendingBatchUnsubscribes.push({batch, slot: i, activeIndex});
                    }
                }
            }
        } else {
            for (const batch of this.batches) {
                const meta = batch[0];
                for (let i = 1; i <= BATCH_SIZE; i++) {
                    (batch as any)[i] = null;
                }
                meta.count = 0;
                meta.isEmpty = true;
                meta.isFull = false;
                meta.activeSlots.length = 0;
                meta.nextSlot = 1;
                meta.freeSlots.length = 0;
            }
            this.batchSubscribers = 0;
        }
    }

    // =========================================================================
    // IObserver: Destroy
    // =========================================================================

    public destroy(): void {
        if (this.killed) return;
        this.killed = true;

        if (!this.batchProcessing) {
            this._value = <any>null;
            this.batches.length = 0;
            this.batchSubscribers = 0;
        } else {
            Promise.resolve().then(() => {
                this._value = <any>null;
                this.batches.length = 0;
                this.batchSubscribers = 0;
            });
        }
    }

    get isDestroyed(): boolean {
        return this.killed;
    }

    // =========================================================================
    // IObserver: Value & Size
    // =========================================================================

    public getValue(): T | undefined {
        if (this.killed) return undefined;
        return this._value;
    }

    public size(): number {
        if (this.killed) return 0;
        return this.batchSubscribers;
    }

    // =========================================================================
    // IObserver + IStream: Emit
    // =========================================================================

    public next(value: T): void {
        if (this.killed) return;
        if (!this.enabled) return;
        if (!this.batchSubscribers) return;

        if (!this.filters.isEmpty && !this.filters.processChain(value).isOK) return;

        this._value = value;

        this.batchProcessing = true;

        const batches = this.batches;
        for (let i = 0, len = batches.length; i < len; i++) {
            const batch = batches[i];
            const meta = batch[0];

            if (meta.isEmpty) continue;

            if (meta.isFull) {
                this.emit50(batch, value);
            } else {
                this.emitPartial(batch, value);
            }
        }

        this.batchProcessing = false;

        if (this.pendingBatchUnsubscribes.length) {
            for (const {batch, slot, activeIndex} of this.pendingBatchUnsubscribes) {
                this.removeBatchSubscriber(batch, slot, activeIndex);
            }
            this.pendingBatchUnsubscribes.length = 0;
        }
    }

    stream(values: T[]): void {
        if (this.killed) return;
        if (!this.enabled) return;

        for (let i = 0; i < values.length; i++) this.next(values[i]);
    }

    // =========================================================================
    // PRIVATE: Batch Management
    // =========================================================================

    private removeBatchSubscriber(batch: QuickBatch<T>, slot: number, activeIndex: number): void {
        if (this.killed) return;
        if ((batch as any)[slot] === null) return;

        (batch as any)[slot] = null;
        const meta = batch[0];
        meta.count--;
        meta.isEmpty = meta.count === 0;
        meta.isFull = false;
        meta.freeSlots.push(slot);

        const activeSlots = meta.activeSlots;
        const lastIndex = activeSlots.length - 1;

        if (activeIndex !== lastIndex) {
            const movedSlot = activeSlots[lastIndex];
            activeSlots[activeIndex] = movedSlot;

            const movedSub = (batch as any)[movedSlot];
            if (movedSub && movedSub._qBatchRef) {
                movedSub._qBatchRef.activeIndex = activeIndex;
            }
        }
        activeSlots.pop();

        this.batchSubscribers--;
    }

    private createEmptyBatch(): QuickBatch<T> {
        return [
            {count: 0, isEmpty: true, isFull: false, activeSlots: [], nextSlot: 1, freeSlots: []},
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null
        ];
    }

    private emitPartial(b: QuickBatch<T>, v: T): void {
        const slots = b[0].activeSlots;
        for (let i = 0, len = slots.length; i < len; i++) {
            (b[slots[i]] as SubscribeObject<T>).send(v);
        }
    }

    private emit50(b: QuickBatch<T>, v: T): void {
        (b[1] as SubscribeObject<T>).send(v);
        (b[2] as SubscribeObject<T>).send(v);
        (b[3] as SubscribeObject<T>).send(v);
        (b[4] as SubscribeObject<T>).send(v);
        (b[5] as SubscribeObject<T>).send(v);
        (b[6] as SubscribeObject<T>).send(v);
        (b[7] as SubscribeObject<T>).send(v);
        (b[8] as SubscribeObject<T>).send(v);
        (b[9] as SubscribeObject<T>).send(v);
        (b[10] as SubscribeObject<T>).send(v);
        (b[11] as SubscribeObject<T>).send(v);
        (b[12] as SubscribeObject<T>).send(v);
        (b[13] as SubscribeObject<T>).send(v);
        (b[14] as SubscribeObject<T>).send(v);
        (b[15] as SubscribeObject<T>).send(v);
        (b[16] as SubscribeObject<T>).send(v);
        (b[17] as SubscribeObject<T>).send(v);
        (b[18] as SubscribeObject<T>).send(v);
        (b[19] as SubscribeObject<T>).send(v);
        (b[20] as SubscribeObject<T>).send(v);
        (b[21] as SubscribeObject<T>).send(v);
        (b[22] as SubscribeObject<T>).send(v);
        (b[23] as SubscribeObject<T>).send(v);
        (b[24] as SubscribeObject<T>).send(v);
        (b[25] as SubscribeObject<T>).send(v);
        (b[26] as SubscribeObject<T>).send(v);
        (b[27] as SubscribeObject<T>).send(v);
        (b[28] as SubscribeObject<T>).send(v);
        (b[29] as SubscribeObject<T>).send(v);
        (b[30] as SubscribeObject<T>).send(v);
        (b[31] as SubscribeObject<T>).send(v);
        (b[32] as SubscribeObject<T>).send(v);
        (b[33] as SubscribeObject<T>).send(v);
        (b[34] as SubscribeObject<T>).send(v);
        (b[35] as SubscribeObject<T>).send(v);
        (b[36] as SubscribeObject<T>).send(v);
        (b[37] as SubscribeObject<T>).send(v);
        (b[38] as SubscribeObject<T>).send(v);
        (b[39] as SubscribeObject<T>).send(v);
        (b[40] as SubscribeObject<T>).send(v);
        (b[41] as SubscribeObject<T>).send(v);
        (b[42] as SubscribeObject<T>).send(v);
        (b[43] as SubscribeObject<T>).send(v);
        (b[44] as SubscribeObject<T>).send(v);
        (b[45] as SubscribeObject<T>).send(v);
        (b[46] as SubscribeObject<T>).send(v);
        (b[47] as SubscribeObject<T>).send(v);
        (b[48] as SubscribeObject<T>).send(v);
        (b[49] as SubscribeObject<T>).send(v);
        (b[50] as SubscribeObject<T>).send(v);
    }
}
