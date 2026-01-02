/**
 * QuickObservable — высокопроизводительный Observable для большого числа подписчиков (5+)
 *
 * Наследует полный функционал Observable:
 * - pipe() с refine(), then(), serialize(), deserialize(), switch/case
 * - addFilter() с filter(), switch/case
 * - subscribe() с поддержкой массивов и Observable-to-Observable
 *
 * Оптимизации для простых подписчиков:
 * - Батчи по 50 подписчиков
 * - Полный батч → emit50() (развёрнутые вызовы)
 * - Неполный батч → компактизация + простой for-цикл
 * - Пропуск пустых батчей
 *
 * Pipe-подписчики используют стандартный механизм Observable.
 */

import {Observable} from "./Observable";
import {ICallback, IErrorCallback, ISubscribeGroup, ISubscriptionLike} from "./Types";

// =============================================================================
// INTERNAL TYPES
// =============================================================================

const BATCH_SIZE = 50;

interface IQuickSubscriber<T> {
    callback: ICallback<T>;
    errorHandler?: IErrorCallback;
}

interface IBatchMeta {
    count: number;           // Количество активных [0-BATCH_SIZE]
    isEmpty: boolean;
    activeSlots: number[];   // Индексы активных слотов [1, 3, 7, ...]
}

type QuickBatch<T> = [
    IBatchMeta,
    // 50 slots (1-50)
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null,
    IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null, IQuickSubscriber<T> | null
];

// =============================================================================
// QUICK OBSERVABLE
// =============================================================================

export class QuickObservable<T> extends Observable<T> {
    private batches: QuickBatch<T>[] = [];
    private batchSubscribers: number = 0;
    private batchProcessing: boolean = false;
    private pendingBatchUnsubscribes: Array<{ batch: QuickBatch<T>; slot: number }> = [];

    constructor(initialValue: T) {
        super(initialValue);
    }

    // =========================================================================
    // PUBLIC API: Subscribe (переопределено для батчей)
    // =========================================================================

    /**
     * Подписывает listener на Observable.
     * Простые listeners (функция или объект с next()) добавляются в батчи.
     * Массивы разворачиваются — каждый элемент в батч.
     * Pipe-подписчики используют стандартный механизм Observable.
     */
    public subscribe(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike | undefined {
        if (this.killed) return undefined;
        if (!observer) return undefined;

        // Массив — разворачиваем, каждый элемент в батч
        if (Array.isArray(observer)) {
            const subs: ISubscriptionLike[] = [];
            for (const item of observer) {
                if (!item) continue;

                let sub: ISubscriptionLike | undefined;
                if (typeof item === 'function') {
                    // Функция → батч
                    sub = this.subscribeToBatch(item, errorHandler);
                } else if (typeof (item as any).next === 'function') {
                    // Объект с next() (включая Observable) → батч
                    sub = this.subscribeToBatch((item as any).next.bind(item), errorHandler);
                }
                if (sub) subs.push(sub);
            }

            // Композитная подписка
            let isUnsubscribed = false;
            return {
                unsubscribe: () => {
                    if (isUnsubscribed) return;
                    isUnsubscribed = true;
                    for (const sub of subs) sub.unsubscribe();
                }
            };
        }

        // Простой listener — добавляем в батчи
        const callback: ICallback<T> = typeof observer === 'function'
            ? observer
            : observer.next.bind(observer);

        return this.subscribeToBatch(callback, errorHandler);
    }

    private subscribeToBatch(
        callback: ICallback<T>,
        errorHandler?: IErrorCallback
    ): ISubscriptionLike | undefined {
        // Ищем батч со свободным слотом
        let batch: QuickBatch<T> | null = null;
        let slotIndex: number = -1;

        for (const b of this.batches) {
            const meta = b[0];
            if (meta.count < BATCH_SIZE) {
                batch = b;
                // Ищем первый свободный слот
                for (let i = 1; i <= BATCH_SIZE; i++) {
                    if ((b as any)[i] === null) {
                        slotIndex = i;
                        break;
                    }
                }
                break;
            }
        }

        if (!batch) {
            batch = this.createEmptyBatch();
            this.batches.push(batch);
            slotIndex = 1;
        }

        // Создаём subscriber
        const subscriber: IQuickSubscriber<T> = {callback, errorHandler};
        (batch as any)[slotIndex] = subscriber;
        batch[0].count++;
        batch[0].isEmpty = false;
        batch[0].activeSlots.push(slotIndex);
        this.batchSubscribers++;

        // Замыкание для unsubscribe
        const capturedBatch = batch;
        const capturedSlot = slotIndex;
        let isUnsubscribed = false;

        const subscription: ISubscriptionLike = {
            unsubscribe: () => {
                if (isUnsubscribed) return;
                isUnsubscribed = true;

                if (this.batchProcessing) {
                    this.pendingBatchUnsubscribes.push({batch: capturedBatch, slot: capturedSlot});
                } else {
                    this.removeBatchSubscriber(capturedBatch, capturedSlot);
                }
            }
        };

        return subscription;
    }

    private removeBatchSubscriber(batch: QuickBatch<T>, slot: number): void {
        if (this.killed) return;
        // Проверяем, что слот ещё занят (не был уже очищен через unsubscribeAll)
        if ((batch as any)[slot] === null) return;
        (batch as any)[slot] = null;
        batch[0].count--;
        batch[0].isEmpty = batch[0].count === 0;
        // Удаляем слот из activeSlots
        const activeSlots = batch[0].activeSlots;
        const idx = activeSlots.indexOf(slot);
        if (idx !== -1) {
            activeSlots[idx] = activeSlots[activeSlots.length - 1];
            activeSlots.pop();
        }
        this.batchSubscribers--;
    }

    // =========================================================================
    // PUBLIC API: Emit (переопределено для батчей)
    // =========================================================================

    /**
     * Отправляет значение всем подписчикам.
     * Сначала эмитит в батчи (быстро), потом в subs (для pipe).
     */
    public next(value: T): void {
        if (this.killed) return;
        if (!this.enabled) return;

        const batchCount = this.batchSubscribers;
        const subsCount = this.subs.length;

        if (!batchCount && !subsCount) return;

        // Проверяем входящие фильтры (addFilter)
        if (!this.filters.isEmpty && !this.filters.processChain(value).isOK) return;

        this._value = value;

        // Эмиссия в батчи (быстрые подписчики)
        if (batchCount) {
            this.batchProcessing = true;

            const batches = this.batches;
            for (let i = 0, len = batches.length; i < len; i++) {
                const batch = batches[i];
                const meta = batch[0];

                if (meta.isEmpty) continue;

                if (meta.count === BATCH_SIZE) {
                    // Полный батч — без if-проверок
                    this.emit50(batch, value);
                } else {
                    // Неполный батч — с if-проверками
                    this.emitPartial(batch, value);
                }
            }

            this.batchProcessing = false;

            // Обрабатываем отложенные отписки
            if (this.pendingBatchUnsubscribes.length) {
                for (const {batch, slot} of this.pendingBatchUnsubscribes) {
                    this.removeBatchSubscriber(batch, slot);
                }
                this.pendingBatchUnsubscribes.length = 0;
            }
        }

        // Эмиссия в subs (pipe-подписчики)
        if (subsCount) {
            this.process = true;

            const subsLength = this.subs.length;
            for (let i = 0; i < subsLength; i++) {
                this.subs[i].send(value);
            }

            this.process = false;

            // Очистка trash (inline вместо вызова private parent method)
            if (this.trash.length) {
                const trashLength = this.trash.length;
                for (let i = 0; i < trashLength; i++) {
                    this.unSubscribe(this.trash[i]);
                }
                this.trash.length = 0;
            }
        }
    }

    // =========================================================================
    // PUBLIC API: State (переопределено для учёта батчей)
    // =========================================================================

    /**
     * Возвращает общее количество подписчиков (батчи + subs).
     */
    public size(): number {
        if (this.killed) return 0;
        return this.batchSubscribers + this.subs.length;
    }

    // =========================================================================
    // PUBLIC API: Cleanup (переопределено для батчей)
    // =========================================================================

    /**
     * Отписывает всех подписчиков (батчи + subs).
     */
    public unsubscribeAll(): void {
        if (this.killed) return;

        // Очистка батчей
        if (this.batchProcessing) {
            for (const batch of this.batches) {
                for (let i = 1; i <= BATCH_SIZE; i++) {
                    if (batch[i]) {
                        this.pendingBatchUnsubscribes.push({batch, slot: i});
                    }
                }
            }
        } else {
            for (const batch of this.batches) {
                for (let i = 1; i <= BATCH_SIZE; i++) {
                    (batch as any)[i] = null;
                }
                batch[0].count = 0;
                batch[0].isEmpty = true;
                batch[0].activeSlots.length = 0;
            }
            this.batchSubscribers = 0;
        }

        // Очистка subs (через parent)
        super.unsubscribeAll();
    }

    /**
     * Уничтожает Observable и освобождает ресурсы.
     */
    public destroy(): void {
        if (this.killed) return;

        if (!this.process && !this.batchProcessing) {
            this.batches.length = 0;
            this.batchSubscribers = 0;
        } else {
            Promise.resolve().then(() => {
                this.batches.length = 0;
                this.batchSubscribers = 0;
            });
        }

        super.destroy();
    }

    // =========================================================================
    // PRIVATE: Batch Management
    // =========================================================================

    private createEmptyBatch(): QuickBatch<T> {
        return [
            {count: 0, isEmpty: true, activeSlots: []},
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null
        ];
    }

    /**
     * Эмиссия для НЕПОЛНОГО батча — итерация по activeSlots.
     */
    private emitPartial(b: QuickBatch<T>, v: T): void {
        const slots = b[0].activeSlots;
        for (let i = 0, len = slots.length; i < len; i++) {
            const sub = b[slots[i]] as IQuickSubscriber<T>;
            try {
                sub.callback(v);
            } catch (e) {
                if (sub.errorHandler) {
                    sub.errorHandler(e, `QuickObservable.emitPartial error`);
                }
            }
        }
    }

    /**
     * Эмиссия для ПОЛНОГО батча (50 подписчиков).
     * Без if-проверок — все слоты гарантированно заняты.
     */
    private emit50(b: QuickBatch<T>, v: T): void {
        (b[1] as IQuickSubscriber<T>).callback(v);
        (b[2] as IQuickSubscriber<T>).callback(v);
        (b[3] as IQuickSubscriber<T>).callback(v);
        (b[4] as IQuickSubscriber<T>).callback(v);
        (b[5] as IQuickSubscriber<T>).callback(v);
        (b[6] as IQuickSubscriber<T>).callback(v);
        (b[7] as IQuickSubscriber<T>).callback(v);
        (b[8] as IQuickSubscriber<T>).callback(v);
        (b[9] as IQuickSubscriber<T>).callback(v);
        (b[10] as IQuickSubscriber<T>).callback(v);
        (b[11] as IQuickSubscriber<T>).callback(v);
        (b[12] as IQuickSubscriber<T>).callback(v);
        (b[13] as IQuickSubscriber<T>).callback(v);
        (b[14] as IQuickSubscriber<T>).callback(v);
        (b[15] as IQuickSubscriber<T>).callback(v);
        (b[16] as IQuickSubscriber<T>).callback(v);
        (b[17] as IQuickSubscriber<T>).callback(v);
        (b[18] as IQuickSubscriber<T>).callback(v);
        (b[19] as IQuickSubscriber<T>).callback(v);
        (b[20] as IQuickSubscriber<T>).callback(v);
        (b[21] as IQuickSubscriber<T>).callback(v);
        (b[22] as IQuickSubscriber<T>).callback(v);
        (b[23] as IQuickSubscriber<T>).callback(v);
        (b[24] as IQuickSubscriber<T>).callback(v);
        (b[25] as IQuickSubscriber<T>).callback(v);
        (b[26] as IQuickSubscriber<T>).callback(v);
        (b[27] as IQuickSubscriber<T>).callback(v);
        (b[28] as IQuickSubscriber<T>).callback(v);
        (b[29] as IQuickSubscriber<T>).callback(v);
        (b[30] as IQuickSubscriber<T>).callback(v);
        (b[31] as IQuickSubscriber<T>).callback(v);
        (b[32] as IQuickSubscriber<T>).callback(v);
        (b[33] as IQuickSubscriber<T>).callback(v);
        (b[34] as IQuickSubscriber<T>).callback(v);
        (b[35] as IQuickSubscriber<T>).callback(v);
        (b[36] as IQuickSubscriber<T>).callback(v);
        (b[37] as IQuickSubscriber<T>).callback(v);
        (b[38] as IQuickSubscriber<T>).callback(v);
        (b[39] as IQuickSubscriber<T>).callback(v);
        (b[40] as IQuickSubscriber<T>).callback(v);
        (b[41] as IQuickSubscriber<T>).callback(v);
        (b[42] as IQuickSubscriber<T>).callback(v);
        (b[43] as IQuickSubscriber<T>).callback(v);
        (b[44] as IQuickSubscriber<T>).callback(v);
        (b[45] as IQuickSubscriber<T>).callback(v);
        (b[46] as IQuickSubscriber<T>).callback(v);
        (b[47] as IQuickSubscriber<T>).callback(v);
        (b[48] as IQuickSubscriber<T>).callback(v);
        (b[49] as IQuickSubscriber<T>).callback(v);
        (b[50] as IQuickSubscriber<T>).callback(v);
    }
}
