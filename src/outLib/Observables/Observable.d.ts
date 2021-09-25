import { ICallback, IListener, IObserver, ISetup, ISubscribe, ISubscribeObject, ISubscriptionLike } from "./Types";
export declare class SubscribeObject<T> implements ISubscribeObject<T> {
    protected observable: IObserver<T>;
    protected listener: IListener<T>;
    private isListenPaused;
    private once;
    private unsubscribeByNegativeCondition;
    private unsubscribeByPositiveCondition;
    private emitByNegativeCondition;
    private emitByPositiveCondition;
    private emitMatchCondition;
    protected _order: number;
    constructor(observable?: IObserver<T>, listener?: IListener<T>);
    subscribe(listener: IListener<T>): ISubscriptionLike<T>;
    unsubscribe(): void;
    send(value: T): void;
    setOnce(): ISubscribe<T>;
    unsubscribeByNegative(condition: ICallback<any>): ISubscribe<T>;
    unsubscribeByPositive(condition: ICallback<any>): ISubscribe<T>;
    emitByNegative(condition: ICallback<any>): ISubscribe<T>;
    emitByPositive(condition: ICallback<any>): ISubscribe<T>;
    emitMatch(condition: ICallback<any>): ISubscribe<T>;
    resume(): void;
    pause(): void;
    get order(): number;
    set order(value: number);
}
export declare class Observable<T> implements IObserver<T> {
    private value;
    protected listeners: ISubscribeObject<T>[];
    private _isEnable;
    protected _isDestroyed: boolean;
    constructor(value: T);
    disable(): void;
    enable(): void;
    get isEnable(): boolean;
    next(value: T): void;
    unSubscribe(listener: ISubscriptionLike<T>): void;
    destroy(): void;
    unsubscribeAll(): void;
    getValue(): T;
    size(): number;
    subscribe(listener: IListener<T>): ISubscriptionLike<T>;
    pipe(): ISetup<T>;
    get isDestroyed(): boolean;
}
