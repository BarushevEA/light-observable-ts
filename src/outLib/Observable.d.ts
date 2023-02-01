import { ICallback, IListener, IMarkedForUnsubscribe, IObserver, ISetup, ISubscribe, ISubscribeObject, ISubscriptionLike } from "./Types";
export declare class SubscribeObject<T> implements ISubscribeObject<T>, IMarkedForUnsubscribe {
    isMarkedForUnsubscribe: boolean;
    protected observable: IObserver<T> | undefined;
    protected listener: IListener<T> | undefined;
    protected _order: number;
    private isListenPaused;
    private once;
    private unsubscribeByNegativeCondition;
    private unsubscribeByPositiveCondition;
    private emitByNegativeCondition;
    private emitByPositiveCondition;
    private emitMatchCondition;
    constructor(observable?: IObserver<T>, listener?: IListener<T>);
    private static callbackSend;
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
    private isNextProcess;
    private listenersForUnsubscribe;
    constructor(value: T);
    disable(): void;
    enable(): void;
    get isEnable(): boolean;
    next(value: T): void;
    private handleListenersForUnsubscribe;
    unSubscribe(listener: ISubscriptionLike<T>): void;
    destroy(): void;
    unsubscribeAll(): void;
    getValue(): T | undefined;
    size(): number;
    subscribe(listener: IListener<T>): ISubscriptionLike<T> | undefined;
    pipe(): ISetup<T> | undefined;
    get isDestroyed(): boolean;
}