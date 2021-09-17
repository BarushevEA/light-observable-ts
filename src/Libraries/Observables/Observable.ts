import {
    ICallback,
    IListener,
    IObserver,
    IOnceMarker,
    ISetup,
    ISubscribe,
    ISubscribeObject,
    ISubscriptionLike
} from "./Types";
import {deleteFromArray} from "../FunctionLibs";

export class SubscribeObject<T> implements ISubscribeObject<T> {
    private observable: IObserver<T>;
    private listener: IListener<T>;
    private isListenPaused = false;
    private once: IOnceMarker = {isOnce: false, isFinished: false};
    private unsubscribeByNegativeCondition: ICallback<any> = null;
    private unsubscribeByPositiveCondition: ICallback<any> = null;
    private emitByNegativeCondition: ICallback<any> = null;
    private emitByPositiveCondition: ICallback<any> = null;
    private emitMatchCondition: ICallback<any> = null;
    private _order = 0;

    constructor(observable?: IObserver<T>, listener?: IListener<T>) {
        this.observable = observable;
        this.listener = listener;
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
        switch (true) {
            case !this.observable:
            case !this.listener:
                this.unsubscribe();
                return;
            case this.isListenPaused:
                return;
            case this.once.isOnce:
                this.once.isFinished = true;
                this.listener(value);
                this.unsubscribe();
                break;
            case !!this.unsubscribeByNegativeCondition:
                if (!this.unsubscribeByNegativeCondition()) {
                    this.unsubscribeByNegativeCondition = null;
                    this.unsubscribe();
                    return;
                }
                this.listener(value);
                break;
            case !!this.unsubscribeByPositiveCondition:
                if (this.unsubscribeByPositiveCondition()) {
                    this.unsubscribeByPositiveCondition = null;
                    this.unsubscribe();
                    return;
                }
                this.listener(value);
                break;
            case !!this.emitByNegativeCondition:
                !this.emitByNegativeCondition() && this.listener(value);
                break;
            case !!this.emitByPositiveCondition:
                this.emitByPositiveCondition() && this.listener(value);
                break;
            case !! this.emitMatchCondition:
                (this.emitMatchCondition() === value) && this.listener(value);
                break;
            default:
                this.listener(value);
        }
    }

    setOnce(): ISubscribe<T> {
        this.once.isOnce = true;
        return this;
    }

    unsubscribeByNegative(condition: ICallback<any>): ISubscribe<T> {
        this.unsubscribeByNegativeCondition = condition;
        return this
    }

    unsubscribeByPositive(condition: ICallback<any>): ISubscribe<T> {
        this.unsubscribeByPositiveCondition = condition;
        return this;
    }

    emitByNegative(condition: ICallback<any>): ISubscribe<T> {
        this.emitByNegativeCondition = condition;
        return this;
    }

    emitByPositive(condition: ICallback<any>): ISubscribe<T> {
        this.emitByPositiveCondition = condition;
        return this;
    }

    emitMatch(condition: ICallback<any>): ISubscribe<T> {
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
    private listeners: ISubscribeObject<T>[] = [];
    private _isEnable: boolean = true;

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
        if (!this._isEnable) return;

        this.value = value;
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i] && this.listeners[i].send(value);
        }
    }

    public unSubscribe(listener: ISubscriptionLike<T>): void {
        this.listeners &&
        !deleteFromArray(this.listeners, listener);
    }

    public destroy(): void {
        this.value = <any>0;
        this.unsubscribeAll();
        this.listeners = <any>0;
    }

    public unsubscribeAll(): void {
        const length = this.listeners.length;
        for (let i = 0; i < length; i++) {
            const listener = this.listeners.pop();
            listener && listener.unsubscribe();
        }
    }

    public getValue(): T {
        return this.value;
    }

    public getNumberOfSubscribers(): number {
        return this.listeners.length;
    }

    public subscribe(listener: IListener<T>): ISubscriptionLike<T> {
        const subscribeObject = new SubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    pipe(): ISetup<T> {
        const subscribeObject = new SubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
}
