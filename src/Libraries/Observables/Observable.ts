import {
    ICallback,
    IErrorCallback,
    IListener,
    IMarkedForUnsubscribe,
    IObserver,
    IOnceMarker,
    ISetup,
    IStream,
    ISubscribe,
    ISubscribeObject,
    ISubscriptionLike
} from "./Types";
import {deleteFromArray} from "./FunctionLibs";

export class SubscribeObject<T> implements ISubscribeObject<T>, IMarkedForUnsubscribe {
    isMarkedForUnsubscribe: boolean = false;
    protected observable: IObserver<T> | undefined;
    protected listener: IListener<T> | undefined;
    protected errorHandler: IErrorCallback = (errorData: any, errorMessage: any) => {
        console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
    };
    protected _order = 0;
    private isListenPaused = false;
    private once: IOnceMarker = {isOnce: false, isFinished: false};
    private unsubscribeByNegativeCondition: ICallback<T> = <any>null;
    private unsubscribeByPositiveCondition: ICallback<T> = <any>null;
    private emitByNegativeCondition: ICallback<T> = <any>null;
    private emitByPositiveCondition: ICallback<T> = <any>null;
    private emitMatchCondition: ICallback<T> = <any>null;
    protected isPipe = false;

    constructor(observable?: IObserver<T>, isPipe?: boolean) {
        this.observable = observable;
        this.isPipe = !!isPipe;
    }

    private static callbackSend<T>(value: T, subsObj: SubscribeObject<T>): void {
        const listener = subsObj.listener;
        if (!listener) {
            subsObj.unsubscribe();
            return;
        }

        switch (true) {
            case !subsObj.observable:
                subsObj.unsubscribe();
                return;
            case subsObj.isListenPaused:
                return;
            case !subsObj.isPipe:
                listener(value);
                return;
            case subsObj.once.isOnce:
                subsObj.once.isFinished = true;
                listener(value);
                subsObj.unsubscribe();
                break;
            case !!subsObj.unsubscribeByNegativeCondition:
                if (!subsObj.unsubscribeByNegativeCondition()) {
                    subsObj.unsubscribeByNegativeCondition = <any>null;
                    subsObj.unsubscribe();
                    return;
                }
                listener(value);
                break;
            case !!subsObj.unsubscribeByPositiveCondition:
                if (subsObj.unsubscribeByPositiveCondition()) {
                    subsObj.unsubscribeByPositiveCondition = <any>null;
                    subsObj.unsubscribe();
                    return;
                }
                listener(value);
                break;
            case !!subsObj.emitByNegativeCondition:
                !subsObj.emitByNegativeCondition() && listener(value);
                break;
            case !!subsObj.emitByPositiveCondition:
                subsObj.emitByPositiveCondition() && listener(value);
                break;
            case !!subsObj.emitMatchCondition:
                (subsObj.emitMatchCondition() === value) && listener(value);
                break;
        }
    }

    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): ISubscriptionLike<T> {
        this.listener = listener;
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }

    public unsubscribe(): void {
        if (this.observable) {
            this.observable.unSubscribe(this);
            this.observable = <any>0;
            this.listener = <any>0;
        }
    }

    send(value: T): void {
        try {
            SubscribeObject.callbackSend(value, this);
        } catch (err) {
            this.errorHandler(value, err);
        }
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
        if (typeof condition !== "function") {
            condition = () => `ERROR CONDITION TYPE ${typeof condition},  CONTROL STATE ${this.observable && !this.observable.getValue()}`;
        }
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

export class Observable<T> implements IObserver<T>, IStream<T> {
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
        this.isNextProcess = true;
        this.value = value;
        const length = this.listeners.length;
        for (let i = 0; i < length; i++) {
            this.listeners[i].send(value);
        }
        this.isNextProcess = false;
        this.listenersForUnsubscribe.length && this.handleListenersForUnsubscribe();
    }

    stream(values: T[]): void {
        if (this._isDestroyed) return;
        if (!this._isEnable) return;

        for (let i = 0; i < values.length; i++) {
            this.next(values[i]);
        }
    }

    private handleListenersForUnsubscribe(): void {
        const length = this.listenersForUnsubscribe.length;
        for (let i = 0; i < length; i++) {
            const listener = this.listenersForUnsubscribe[i];
            this.unSubscribe(listener);
        }
        this.listenersForUnsubscribe.length = 0;
    }

    public unSubscribe(listener: ISubscriptionLike<T>): void {
        if (this._isDestroyed) return;
        if (this.isNextProcess && listener) {
            const marker: IMarkedForUnsubscribe = <any>listener;
            !marker.isMarkedForUnsubscribe && this.listenersForUnsubscribe.push(listener);
            marker.isMarkedForUnsubscribe = true;
            return;
        }
        this.listeners && !deleteFromArray(this.listeners, listener);
    }

    public destroy(): void {
        this.value = <any>0;
        this.unsubscribeAll();
        this.listeners = <any>0;
        this._isDestroyed = true;
    }

    public unsubscribeAll(): void {
        if (this._isDestroyed) return;
        this.listeners.length = 0;
    }

    public getValue(): T | undefined {
        if (this._isDestroyed) return undefined;
        return this.value;
    }

    public size(): number {
        if (this._isDestroyed) return 0;
        return this.listeners.length;
    }

    public subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): ISubscriptionLike<T> | undefined {
        if (this._isDestroyed) return undefined;
        if (!listener) return undefined;
        const subscribeObject = new SubscribeObject(this, false);
        subscribeObject.subscribe(listener, errorHandler);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    pipe(): ISetup<T> | undefined {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new SubscribeObject(this, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }
}
