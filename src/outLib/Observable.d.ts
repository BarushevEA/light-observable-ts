import { IErrorCallback, IListener, IObserver, ISetObservableValue, ISetup, IStream, ISubscribeObject, ISubscriptionLike } from "./Types";
import { SubscribeObject } from "./SubscribeObject";
export declare class Observable<T> implements IObserver<T>, IStream<T> {
    private value;
    protected listeners: ISubscribeObject<T>[];
    private _isEnable;
    protected _isDestroyed: boolean;
    protected isNextProcess: boolean;
    protected listenersForUnsubscribe: ISubscriptionLike[];
    constructor(value: T);
    disable(): void;
    enable(): void;
    get isEnable(): boolean;
    next(value: T): void;
    stream(values: T[]): void;
    private handleListenersForUnsubscribe;
    unSubscribe(listener: ISubscriptionLike): void;
    destroy(): void;
    unsubscribeAll(): void;
    getValue(): T | undefined;
    size(): number;
    subscribe(observer: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    protected addObserver(subscribeObject: SubscribeObject<T>, observer: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): void;
    protected isSubsValid(listener: IListener<T> | ISetObservableValue): boolean;
    pipe(): ISetup<T> | undefined;
    get isDestroyed(): boolean;
}
