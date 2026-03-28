import {
    ICallback,
    IDestroy,
    IErrorCallback,
    IListener,
    IOrder,
    ISetObservableValue,
    ISubscribeCounter,
    ISubscribeGroup,
} from "./CoreTypes";
import type {IFilterSetup} from "./FilterTypes";
import type {ISetup, IOrderedSetup} from "./PipeTypes";

/**
 * Represents a subscription-like object which provides a mechanism to release resources or
 * cancelable operations when they are no longer needed.
 */
export type ISubscriptionLike = {
    unsubscribe(): void;
};

/**
 * Represents a group subscription that allows adding multiple listeners to a pipe.
 * Used as the return type for the `.group()` type finalizer.
 *
 * @template T The type of the data emitted to listeners.
 * @extends ISubscriptionLike Inherits unsubscribe() method.
 */
export type IGroupSubscription<T> = ISubscriptionLike & {
    add(listener: IListener<T> | IListener<T>[], errorHandler?: IErrorCallback | IErrorCallback[]): IGroupSubscription<T>;
};

/**
 * Represents a contract for subscribing to a data stream or event source.
 *
 * @template T The type of data or events being subscribed to.
 */
export type ISubscribe<T> = {
    subscribe(listener: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike;
};

/**
 * Represents an interface for an ordered subscription mechanism.
 *
 * @template T The type of data that the subscription will handle.
 */
export type IOrderedSubscribe<T> = {
    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike;
};

/**
 * Interface representing a subscriber that can hold a value and has a subscription mechanism.
 *
 * @template T - The type of the value that the subscriber holds.
 */
export type ISubscriber<T> =
    {
        getValue(): T | undefined,
        isEnable: boolean
    } &
    ISubscribe<T>;

/**
 * A type that combines the features of `ISubscriptionLike` and `IOrder`.
 */
export type IOrderedSubscriptionLike = (ISubscriptionLike & IOrder);

/**
 * Represents an observable pipe, which provides a mechanism to transform or manipulate a stream of data.
 *
 * @template T - The type of data the observable pipe operates on.
 */
export type IObservablePipe<T> = {
    pipe(): ISetup<T> | undefined
};

/**
 * Represents an interface for an ordered observable pipe.
 *
 * @template T - The type of the value being processed through the pipe.
 */
export type IOrderedObservablePipe<T> = {
    pipe(): ISetup<T> | undefined
};

/**
 * An interface representing an Observer with extended functionalities for managing subscriptions,
 * controlling observability, and interacting with subscriber-related behavior.
 *
 * @template T - The type of the observed value.
 */
export type IObserver<T> =
    ISetObservableValue &
    ISubscriber<T> &
    IDestroy &
    ISubscribeCounter &
    IObservablePipe<T> &
    {
        unSubscribe(subscriber: ISubscriptionLike): void,
        unsubscribeAll(): void,
        disable(): void,
        enable(): void,
    };

/**
 * IOrderedObservable is a type definition that represents an object with the ability
 * to determine whether elements are sorted in a specific order.
 */
export type IOrderedObservable = {
    sortByOrder(): boolean;
};

/**
 * Represents a type that combines the behavior of an observer, an ordered observable, and an ordered observable pipe.
 *
 * @template T specifies the data type it operates on.
 */
export type IOrdered<T> = IObserver<T> & IOrderedObservable & IOrderedObservablePipe<T>;

/**
 * ICollector is an interface that combines IDestroy and ISubscribeCounter interfaces,
 * providing additional functionality for managing subscriptions.
 */
export type ICollector =
    IDestroy &
    ISubscribeCounter &
    {
        collect(...subscriptionLikeList: ISubscriptionLike[]): void;
        unsubscribe(subscriptionLike: ISubscriptionLike): void;
        unsubscribeAll(): void;
    };
