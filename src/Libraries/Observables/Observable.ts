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
import {deleteFromArray} from "./FunctionLibs";

export class SubscribeObject<T> implements ISubscribeObject<T> {
    protected observable: IObserver<T>;
    protected listener: IListener<T>;
    private isListenPaused = false;
    private once: IOnceMarker = {isOnce: false, isFinished: false};
    private unsubscribeByNegativeCondition: ICallback<any> = null;
    private unsubscribeByPositiveCondition: ICallback<any> = null;
    private emitByNegativeCondition: ICallback<any> = null;
    private emitByPositiveCondition: ICallback<any> = null;
    private emitMatchCondition: ICallback<any> = null;
    private isPipePromise = false;
    protected _order = 0;

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

    private send(value: T): void {
        if (this.isPipePromise){
            this.handlePromiseExecution(value)
                .catch(err=> console.log(`ERROR: isPipePromise = "true" SubscribeObject.send(${value})` , err));
        }
        this.handleNoPromiseExecution(value);
    }

    private async handlePromiseExecution(value: T): Promise<void> {
        try {
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
                    if (!await this.unsubscribeByNegativeCondition()) {
                        this.unsubscribeByNegativeCondition = null;
                        this.unsubscribe();
                        return;
                    }
                    this.listener(value);
                    break;
                case !!this.unsubscribeByPositiveCondition:
                    if (await (this.unsubscribeByPositiveCondition())) {
                        this.unsubscribeByPositiveCondition = null;
                        this.unsubscribe();
                        return;
                    }
                    this.listener(value);
                    break;
                case !!this.emitByNegativeCondition:
                    !await this.emitByNegativeCondition() && this.listener(value);
                    break;
                case !!this.emitByPositiveCondition:
                    await this.emitByPositiveCondition() && this.listener(value);
                    break;
                case !!this.emitMatchCondition:
                    (await this.emitMatchCondition() === value) && this.listener(value);
                    break;
                default:
                    this.listener(value);
            }
        } catch (err) {
            console.log(`ERROR: handlePromiseExecution, SubscribeObject.send(${value})`, err);
        }
    }

    private handleNoPromiseExecution(value: T): void {
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
            case !!this.emitMatchCondition:
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
        if (typeof condition !== "function") condition = () => true;
        this.unsubscribeByNegativeCondition = condition;
        return this
    }

    unsubscribeByPositive(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => false;
        this.unsubscribeByPositiveCondition = condition;
        return this;
    }

    emitByNegative(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => false;
        this.emitByNegativeCondition = condition;
        return this;
    }

    emitByPositive(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => true;
        this.emitByPositiveCondition = condition;
        return this;
    }

    emitMatch(condition: ICallback<any>): ISubscribe<T> {
        if (typeof condition !== "function") condition = () => true;
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

    likePromise(): ISetup<T> {
        this.isPipePromise = true;
        return this;
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
            this.listenersForUnsubscribe.push(listener);
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
        const length = this.listeners.length;
        for (let i = 0; i < length; i++) (this.listeners.pop()).unsubscribe();
    }

    public getValue(): T {
        if (this._isDestroyed) return undefined;
        return this.value;
    }

    public size(): number {
        if (this._isDestroyed) return 0;
        return this.listeners.length;
    }

    public subscribe(listener: IListener<T>): ISubscriptionLike<T> {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new SubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    pipe(): ISetup<T> {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new SubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }
}
