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
    private positiveCondition: ICallback<any> = null;
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
            case !!this.positiveCondition:
                if (!this.positiveCondition()) {
                    this.positiveCondition = null;
                    this.unsubscribe();
                } else {
                    this.listener(value);
                }
                break;
            default:
                this.listener(value);
        }
    }

    setOnce(): ISubscribe<T> {
        this.once.isOnce = true;
        return this;
    }

    setPositiveCondition(condition: ICallback<any>): ISubscribe<T> {
        this.positiveCondition = condition;
        return this
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
            this.unSubscribe(this.listeners.pop());
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
