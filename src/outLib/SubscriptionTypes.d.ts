import { IDestroy, IErrorCallback, IListener, IOrder, ISetObservableValue, ISubscribeCounter, ISubscribeGroup } from "./CoreTypes";
import type { ISetup } from "./PipeTypes";
export type ISubscriptionLike = {
    unsubscribe(): void;
};
export type IGroupSubscription<T> = ISubscriptionLike & {
    add(listener: IListener<T> | IListener<T>[], errorHandler?: IErrorCallback | IErrorCallback[]): IGroupSubscription<T>;
};
export type ISubscribe<T> = {
    subscribe(listener: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike;
};
export type IOrderedSubscribe<T> = {
    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike;
};
export type ISubscriber<T> = {
    getValue(): T | undefined;
    isEnable: boolean;
} & ISubscribe<T>;
export type IOrderedSubscriptionLike = (ISubscriptionLike & IOrder);
export type IObservablePipe<T> = {
    pipe(): ISetup<T> | undefined;
};
export type IOrderedObservablePipe<T> = {
    pipe(): ISetup<T> | undefined;
};
export type IObserver<T> = ISetObservableValue & ISubscriber<T> & IDestroy & ISubscribeCounter & IObservablePipe<T> & {
    unSubscribe(subscriber: ISubscriptionLike): void;
    unsubscribeAll(): void;
    disable(): void;
    enable(): void;
};
export type IOrderedObservable = {
    sortByOrder(): boolean;
};
export type IOrdered<T> = IObserver<T> & IOrderedObservable & IOrderedObservablePipe<T>;
export type ICollector = IDestroy & ISubscribeCounter & {
    collect(...subscriptionLikeList: ISubscriptionLike[]): void;
    unsubscribe(subscriptionLike: ISubscriptionLike): void;
    unsubscribeAll(): void;
};
