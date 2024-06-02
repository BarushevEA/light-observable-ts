import { IErrorCallback, IListener, IMarkedForUnsubscribe, IObserver, ISubscribeGroup, ISubscribeObject, ISubscriptionLike } from "./Types";
import { Pipe } from "./Pipe";
export declare class SubscribeObject<T> extends Pipe<T> implements ISubscribeObject<T>, IMarkedForUnsubscribe {
    isMarkedForUnsubscribe: boolean;
    observable: IObserver<T> | undefined;
    listener: IListener<T> | undefined;
    errorHandler: IErrorCallback;
    _order: number;
    isPaused: boolean;
    isPipe: boolean;
    constructor(observable?: IObserver<T>, isPipe?: boolean);
    subscribe(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike;
    unsubscribe(): void;
    send(value: T): void;
    resume(): void;
    pause(): void;
    get order(): number;
    set order(value: number);
}
