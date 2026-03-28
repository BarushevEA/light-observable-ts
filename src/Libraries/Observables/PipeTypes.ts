import {PipeSwitchCase} from "./Pipe";
import {ICallback, IPause, IOrder, ISend} from "./CoreTypes";
import {
    ISubscribe,
    IOrderedSubscribe,
    ISubscriptionLike,
    IGroupSubscription,
} from "./SubscriptionTypes";

/**
 * Represents a choice interface for OR-logic branching.
 *
 * @template T The type of the value to be used in the choice operation.
 */
export type ISwitch<T> = {
    choice(): PipeSwitchCase<T>;
};

/**
 * Represents an interface for an ordered choice mechanism.
 *
 * @template T The type of data expected by the implementation.
 */
export type IOrderedSwitch<T> = {
    choice(): PipeSwitchCase<T>;
};

/**
 * Defines an interface for converting a pipe to a group subscription.
 *
 * @template T The type of the data in the pipe.
 */
export type IGroup<T> = {
    group(): IGroupSubscription<T>;
};

/**
 * Defines an interface for converting an ordered pipe to a group subscription.
 *
 * @template T The type of the data in the ordered pipe.
 */
export type IOrderedGroup<T> = {
    group(): IGroupSubscription<T>;
};

/**
 * Represents an interface defining a contract for a one-time subscription mechanism.
 *
 * @template T - The type of the data or value associated with the subscription.
 */
export type IOnce<T> = {
    once(): ISubscribe<T>;
};

/**
 * Represents an interface that ensures an ordered item can be triggered only once.
 *
 * @template T - The type of item to be handled by the implementation.
 */
export type IOrderedOnce<T> = {
    once(): IOrderedSubscribe<T>;
};

/**
 * Passes the first N values through the pipe, then automatically unsubscribes.
 *
 * @template T - The type of the data handled by the subscription.
 */
export type ITake<T> = {
    take(n: number): ISubscribe<T>;
};

/**
 * Ordered variant of ITake — passes the first N values, then unsubscribes.
 *
 * @template T - The type of the data handled by the subscription.
 */
export type IOrderedTake<T> = {
    take(n: number): IOrderedSubscribe<T>;
};

/**
 * Ignores the first N values in the pipe, then passes all subsequent values through.
 *
 * @template T - The type of the data handled by the pipe.
 */
export type ISkip<T> = {
    skip(n: number): ISetup<T>;
};

/**
 * Ordered variant of ISkip — ignores the first N values, then passes all through.
 *
 * @template T - The type of the data handled by the pipe.
 */
export type IOrderedSkip<T> = {
    skip(n: number): IOrderedSetup<T>;
};

/**
 * Accumulator operator — each value passes through a reducer function,
 * the accumulated result is emitted. Like `Array.reduce()` for streams.
 *
 * @template T - The type of the incoming data.
 */
export type IScan<T> = {
    scan<K>(fn: (accumulator: K, value: T) => K, seed: K): ISetup<K>;
};

/**
 * Ordered variant of IScan — accumulator with correct ordered return type.
 *
 * @template T - The type of the incoming data.
 */
export type IOrderedScan<T> = {
    scan<K>(fn: (accumulator: K, value: T) => K, seed: K): IOrderedSetup<K>;
};

/**
 * Represents a generic type that allows for unsubscribing based on a given condition.
 *
 * @template T - The type of the value being processed or observed.
 */
export type IUnsubscribeByPositive<T> = {
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
};

/**
 * Represents an interface for managing ordered unsubscription using a provided condition.
 *
 * @template T - The type parameter representing the data model or entity being handled.
 */
export type IOrderedUnsubscribeByPositive<T> = {
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
};

/**
 * Represents a type that facilitates AND-logic filtering of conditions.
 *
 * @template T - The type of data or element that the methods operate on.
 */
export type IEmitByPositive<T> = {
    and(condition: ICallback<T>): ISetup<T>;
    allOf(conditions: ICallback<T>[]): ISetup<T>;
};

/**
 * Ordered variant of IEmitByPositive — AND-logic filtering with ordered return types.
 *
 * @template T - The type of the element being processed.
 */
export type IOrderedEmitByPositive<T> = {
    and(condition: ICallback<any>): ISetup<T>;
    allOf(conditions: ICallback<any>[]): ISetup<T>;
};

/**
 * Represents a transformation interface for data type conversion in pipe chains.
 *
 * @template T - The type of the input value that the transformation operates on.
 */
export type ITransform<T> = {
    map<K>(condition: ICallback<T>): ISetup<K>;
};

/**
 * Represents an interface for an ordered transformation sequence.
 *
 * @template T - The type of the data to be transformed.
 */
export type IOrderedTransform<T> = {
    map<K>(condition: ICallback<T>): ISetup<K>;
};

/**
 * Represents a throttle operation using leading-edge strategy.
 *
 * @template T - The type of the data being throttled.
 */
export type IThrottle<T> = {
    throttle(ms: number): ISetup<T>;
};

/**
 * Represents an ordered throttle operation using leading-edge strategy.
 *
 * @template T - The type of the data being throttled.
 */
export type IOrderedThrottle<T> = {
    throttle(ms: number): ISetup<T>;
};

/**
 * Provides trailing-edge debounce to delay emission until a pause in the stream.
 *
 * @template T - The type of the data being debounced.
 */
export type IDebounce<T> = {
    debounce(ms: number): ISetup<T>;
};

/**
 * Provides trailing-edge debounce for ordered observables.
 *
 * @template T - The type of the data being debounced.
 */
export type IOrderedDebounce<T> = {
    debounce(ms: number): ISetup<T>;
};

/**
 * Suppresses consecutive duplicate values in the pipe chain.
 *
 * @template T - The type of the data being compared.
 */
export type IDistinctUntilChanged<T> = {
    distinctUntilChanged(comparator?: (previous: T, current: T) => boolean): ISetup<T>;
};

/**
 * Suppresses consecutive duplicate values for ordered observables.
 *
 * @template T - The type of the data being compared.
 */
export type IOrderedDistinctUntilChanged<T> = {
    distinctUntilChanged(comparator?: (previous: T, current: T) => boolean): ISetup<T>;
};

/**
 * Executes a side-effect function on the current payload without modifying it.
 *
 * @template T - The type of the data being observed.
 */
export type ITap<T> = {
    tap(fn: ICallback<T>): ISetup<T>;
};

/**
 * Side-effect operator for ordered observables.
 *
 * @template T - The type of the data being observed.
 */
export type IOrderedTap<T> = {
    tap(fn: ICallback<T>): ISetup<T>;
};

/**
 * ISerialisation interface defines the structure for JSON serialization and deserialization.
 */
export type ISerialisation = {
    toJson(): ISetup<string>;
    fromJson<K>(): ISetup<K>;
};

/**
 * Represents an interface for ordered serialization and deserialization operations.
 */
export type IOrderedSerialisation = {
    toJson(): ISetup<string>;
    fromJson<K>(): ISetup<K>;
};

/**
 * Represents a composite interface that combines multiple functionalities for handling
 * events, transformations, and subscriptions in a generic way.
 *
 * @template T The type of the data or events processed by the setup.
 */
export type ISetup<T> =
    IUnsubscribeByPositive<T> &
    IEmitByPositive<T> &
    IOnce<T> &
    ITake<T> &
    ISkip<T> &
    IScan<T> &
    ISwitch<T> &
    ITransform<T> &
    IThrottle<T> &
    IDebounce<T> &
    IDistinctUntilChanged<T> &
    ITap<T> &
    ISerialisation &
    IGroup<T> &
    ISubscribe<T>;

/**
 * Represents an ordered setup configuration that combines multiple ordered operations.
 *
 * @template T The type of the data to be handled by the ordered setup.
 */
export type IOrderedSetup<T> =
    IOrderedUnsubscribeByPositive<T> &
    IOrderedEmitByPositive<T> &
    IOrderedOnce<T> &
    IOrderedTake<T> &
    IOrderedSkip<T> &
    IOrderedScan<T> &
    IOrderedSwitch<T> &
    IOrderedTransform<T> &
    IOrderedThrottle<T> &
    IOrderedDebounce<T> &
    IOrderedDistinctUntilChanged<T> &
    IOrderedTap<T> &
    IOrderedSerialisation &
    IOrderedGroup<T> &
    IOrderedSubscribe<T>;

/**
 * Represents a composite type for subscription objects with extended features.
 *
 * @template T The type of data being interacted with in the subscription object.
 */
export type ISubscribeObject<T> =
    ISubscriptionLike &
    IPause &
    IOrder &
    ISend<T> &
    ISetup<T>;

/**
 * Represents a pipeline case that extends the functionality of subscribing
 * to a stream of data with additional case-checking operations.
 *
 * @template T - The type of data being processed in the pipeline.
 */
export type IPipeCase<T> = ISubscribe<T> & {
    or(condition: ICallback<any>): IPipeCase<T> & ISubscribe<T>;
    anyOf(conditions: ICallback<any>[]): IPipeCase<T> & ISubscribe<T>;
    group(): IGroupSubscription<T>;
};
