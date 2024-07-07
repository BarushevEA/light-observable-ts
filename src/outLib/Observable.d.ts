import { IAddFilter, IErrorCallback, IFilterSetup, IObserver, ISetup, IStream, ISubscribeGroup, ISubscribeObject, ISubscriptionLike } from "./Types";
import { SubscribeObject } from "./SubscribeObject";
export declare class Observable<T> implements IObserver<T>, IStream<T>, IAddFilter<T> {
    private value;
    protected listeners: ISubscribeObject<T>[];
    private _isEnable;
    protected _isDestroyed: boolean;
    protected isNextProcess: boolean;
    protected listenersForUnsubscribe: ISubscriptionLike[];
    private filterCase;
    constructor(value: T);
    addFilter(errorHandler?: IErrorCallback): IFilterSetup<T>;
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
    subscribe(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    protected addObserver(subscribeObject: SubscribeObject<T>, observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): void;
    protected isSubsValid(listener: ISubscribeGroup<T>): boolean;
    pipe(): ISetup<T> | undefined;
    get isDestroyed(): boolean;
}
