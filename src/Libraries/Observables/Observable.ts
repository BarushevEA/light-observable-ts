import {
    ICallback,
    IListener,
    IMarkedForUnsubscribe,
    IObserver,
    IOnceMarker,
    ISetup,
    ISubscribe,
    ISubscribeObject,
    ISubscriptionLike
} from "./Types";
import {deleteFromArray} from "./FunctionLibs";

export class SubscribeObject<T> implements ISubscribeObject<T>, IMarkedForUnsubscribe {
    isMarkedForUnsubscribe: boolean = false;
    protected observable: IObserver<T> | undefined;
    protected listener: IListener<T> | undefined;
    private isListenPaused = false;
    private once: IOnceMarker = {isOnce: false, isFinished: false};
    private unsubscribeByNegativeCondition: ICallback<T> = <any>null;
    private unsubscribeByPositiveCondition: ICallback<T> = <any>null;
    private emitByNegativeCondition: ICallback<T> = <any>null;
    private emitByPositiveCondition: ICallback<T> = <any>null;
    private emitMatchCondition: ICallback<T> = <any>null;
    protected _order = 0;

    constructor(observable?: IObserver<T>, listener?: IListener<T>) {
        this.observable = observable;
        this.listener = listener;
    }

    private static asyncSend<T>(value: T, subsObj: SubscribeObject<T>): Promise<boolean> {
        const listener = subsObj.listener;
        return new Promise<boolean>((resolve => {
            switch (true) {
                case !subsObj.observable:
                case !listener:
                    subsObj.unsubscribe();
                    resolve(false);
                    return;
                case subsObj.isListenPaused:
                    resolve(false);
                    return;
                case subsObj.once.isOnce:
                    subsObj.once.isFinished = true;
                    listener && listener((value));
                    subsObj.unsubscribe();
                    break;
                case !!subsObj.unsubscribeByNegativeCondition:
                    if (!subsObj.unsubscribeByNegativeCondition()) {
                        subsObj.unsubscribeByNegativeCondition = <any>null;
                        subsObj.unsubscribe();
                        return;
                    }
                    listener && listener((value));
                    break;
                case !!subsObj.unsubscribeByPositiveCondition:
                    if (subsObj.unsubscribeByPositiveCondition()) {
                        subsObj.unsubscribeByPositiveCondition = <any>null;
                        subsObj.unsubscribe();
                        return;
                    }
                    listener && listener((value));
                    break;
                case !!subsObj.emitByNegativeCondition:
                    !subsObj.emitByNegativeCondition() && listener && listener(value);
                    break;
                case !!subsObj.emitByPositiveCondition:
                    subsObj.emitByPositiveCondition() && listener && listener(value);
                    break;
                case !!subsObj.emitMatchCondition:
                    (subsObj.emitMatchCondition() === value) && listener && listener(value);
                    break;
                default:
                    listener && listener((value));
            }
            resolve(true);
        }))
    }

    subscribe(listener: IListener<T>): ISubscriptionLike<T> {
        this.listener = listener;
        return this;
    }

    public unsubscribe(): void {
        if (!!this.observable) {
            this.observable.unSubscribe(this);
            this.observable = <any>0;
            this.listener = <any>0;
        }
    }

    send(value: T): void {
        SubscribeObject.asyncSend(value, this)
            .catch(err => {
                console.log('(Unit of SubscribeObject).send(value: T) call .sendValueToListener(value: T) ERROR:', err);
            });
    }

    setOnce(): ISubscribe<T> {
        this.once.isOnce = true;
        return this;
    }

    unsubscribeByNegative(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => false;
        this.unsubscribeByNegativeCondition = condition;
        return this
    }

    unsubscribeByPositive(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => true;
        this.unsubscribeByPositiveCondition = condition;
        return this;
    }

    emitByNegative(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => true;
        this.emitByNegativeCondition = condition;
        return this;
    }

    emitByPositive(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => false;
        this.emitByPositiveCondition = condition;
        return this;
    }

    emitMatch(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition =
            () => `ERROR CONDITION TYPE ${typeof condition},  CONTROL STATE ${this.observable && !this.observable.getValue()}`;
        this.emitMatchCondition = condition;
        return this;
    }

    resume(): void {
        this.isListenPaused = false;
    }

    pause(): void {
        this.isListenPaused = true;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }
}

export class Observable<T> implements IObserver<T> {
    protected listeners: ISubscribeObject<T>[] = [];
    private _isEnable: boolean = true;
    protected _isDestroyed = false;
    private isNextProcess = false;
    private listenersForUnsubscribe: ISubscriptionLike<T>[] = [];

    constructor(private value: T) {
    }

    disable(): void {
        this._isEnable = false;
    }

    enable(): void {
        this._isEnable = true;
    }

    get isEnable(): boolean {
        return this._isEnable;
    }

    public next(value: T): void {
        if (this._isDestroyed) return;
        if (!this._isEnable) return;
        this.value = value;
        this.isNextProcess = true;
        for (let i = 0; i < this.listeners.length; i++) this.listeners[i].send(value);
        this.isNextProcess = false;
        this.handleListenersForUnsubscribe();
    }

    private handleListenersForUnsubscribe(): void {
        for (const listener of this.listenersForUnsubscribe) {
            this.unSubscribe(listener);
        }
        this.listenersForUnsubscribe.length = 0;
    }

    public unSubscribe(listener: ISubscriptionLike<T>): void {
        if (this._isDestroyed) return;
        if (this.isNextProcess) {
            const marker: IMarkedForUnsubscribe = <any>listener;
            !marker.isMarkedForUnsubscribe && this.listenersForUnsubscribe.push(listener);
            marker.isMarkedForUnsubscribe = true;
            return;
        }
        this.listeners &&
        !deleteFromArray(this.listeners, listener);
    }

    public destroy(): void {
        this.value = <any>0;
        this.unsubscribeAll();
        this.listeners = <any>0;
        this._isDestroyed = true;
    }

    public unsubscribeAll(): void {
        if (this._isDestroyed) return;
        const listeners = this.listeners;
        const length = listeners.length;
        for (let i = 0; i < length; i++) {
            const subscriber = listeners.pop();
            subscriber && subscriber.unsubscribe();
        }
    }

    public getValue(): T | undefined {
        if (this._isDestroyed) return undefined;
        return this.value;
    }

    public size(): number {
        if (this._isDestroyed) return 0;
        return this.listeners.length;
    }

    public subscribe(listener: IListener<T>): ISubscriptionLike<T> | undefined {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new SubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    pipe(): ISetup<T> | undefined {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new SubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }
}
