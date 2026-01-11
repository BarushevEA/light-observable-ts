import { IErrorCallback, IGroupSubscription, IListener, IObserver, ISubscribeGroup, ISubscribeObject, ISubscriptionLike } from "./Types";
import { Pipe } from "./Pipe";
export declare class SubscribeObject<T> extends Pipe<T> implements ISubscribeObject<T> {
    observer: IObserver<T> | undefined;
    listener: IListener<T> | undefined;
    errorHandler: IErrorCallback;
    _order: number;
    paused: boolean;
    piped: boolean;
    listeners?: IListener<T>[];
    errorHandlers?: IErrorCallback[];
    constructor(observable?: IObserver<T>, isPipe?: boolean);
    subscribe(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike;
    add(listener: IListener<T> | IListener<T>[], errorHandler?: IErrorCallback | IErrorCallback[]): IGroupSubscription<T>;
    unsubscribe(): void;
    send(value: T): void;
    resume(): void;
    pause(): void;
    get order(): number;
    set order(value: number);
}
