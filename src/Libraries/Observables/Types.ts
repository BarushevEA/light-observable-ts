import {PipeSwitchCase} from "./Pipe";
import {FilterSwitchCase} from "./FilterCollection";

/**
 * Defines a callback function type that can be invoked with an optional value of type `T`.
 * The function can perform any operation and optionally return a value of any type.
 *
 * @template T - The type of the parameter that the callback function may receive.
 * @param {T} [value] - An optional parameter of type `T` passed to the callback function.
 * @returns {any} - The return type of the callback function is not specified and can be of any type.
 */
export type ICallback<T> = (value?: T) => any;

/**
 * Represents a callback function to handle error scenarios.
 *
 * This type defines a function signature that accepts error-related data
 * and a descriptive error message as parameters and performs an operation.
 *
 * @callback IErrorCallback
 * @param {any} errorData - The data or object representing the error.
 * @param {any} errorMessage - A descriptive message providing details about the error.
 */
export type IErrorCallback = (errorData: any, errorMessage: any) => void;

/**
 * Represents a contract for subscribing to a data stream or event source.
 *
 * @template T The type of data or events being subscribed to.
 *
 * @property subscribe Provides the mechanism to register a listener for handling incoming data or events,
 *   and optionally handles errors.
 *   - `listener` is the callback that processes the data or events.
 *   - `errorHandler` is an optional callback for handling errors during the subscription.
 *   - Returns an object implementing `ISubscriptionLike` to manage the subscription, or `undefined` if no subscription is created.
 */
export type ISubscribe<T> = {
    subscribe(listener: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
};

/**
 * Represents a listener interface that extends the functionality of `ICallback`.
 * This type is designed to handle events, callbacks, or notifications with a specific type `T`.
 *
 * Generic:
 * @template T - The type of data that the listener will handle.
 */
export type IListener<T> = ICallback<T>;

/**
 * IDestroy represents an interface for objects that can be destroyed to release resources.
 * It provides a method to perform the destroy operation and a property to indicate if the object is already destroyed.
 *
 * Members:
 * - destroy(): A method to perform cleanup and release resources associated with the object.
 * - isDestroyed: A boolean property that reflects whether the object has been destroyed.
 */
export type IDestroy = {
    destroy(): void;
    isDestroyed: boolean;
};

/**
 * Represents an order with a specific numerical value.
 * Defines a structure to hold the order information as a numeric value.
 */
export type IOrder = {
    order: number;
};

/**
 * Represents a choice interface for OR-logic branching.
 *
 * @template T The type of the value to be used in the choice operation.
 *
 * @property {Function} choice - Defines the method for initiating a choice operation.
 * Returns a `PipeSwitchCase<T>` representing the next step in the branching process.
 */
export type ISwitch<T> = {
    choice(): PipeSwitchCase<T>;
};

/**
 * Represents an interface for an ordered choice mechanism that evaluates
 * conditions in a specific sequence and invokes the corresponding logic.
 *
 * This interface is generic and designed to operate with a specific type `T`.
 *
 * @template T The type of data expected by the implementation.
 * @property choice A method intended to handle the ordered evaluation of cases
 *                  and return an instance of `PipeSwitchCase<T>`.
 */
export type IOrderedSwitch<T> = {
    choice(): PipeSwitchCase<T>;
};

/**
 * Defines an interface for converting a pipe to a group subscription.
 * The `.group()` method acts as a type finalizer, preventing further operators from being chained.
 *
 * @template T The type of the data in the pipe.
 * @property {function} group - Converts the pipe to IGroupSubscription<T> for multi-listener optimization.
 */
export type IGroup<T> = {
    group(): IGroupSubscription<T>;
};

/**
 * Defines an interface for converting an ordered pipe to a group subscription.
 * The `.group()` method acts as a type finalizer, preventing further operators from being chained.
 *
 * @template T The type of the data in the ordered pipe.
 * @property {function} group - Converts the ordered pipe to IGroupSubscription<T> for multi-listener optimization.
 */
export type IOrderedGroup<T> = {
    group(): IGroupSubscription<T>;
};

/**
 * Represents an interface defining a contract for a one-time subscription mechanism.
 *
 * @template T - The type of the data or value associated with the subscription.
 *
 * @property once - A method that ensures the associated subscription can only be triggered once.
 * @returns {ISubscribe<T>} - An instance of ISubscribe with the generic type T.
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
 * Interface representing an observable value that can be updated by emitting a new value.
 *
 * ISetObservableValue provides a `next` method that allows sending new values to be observed by subscribers.
 */
export type ISetObservableValue = {
    next(value: any): void;
};

/**
 * Represents a subscription-like object which provides a mechanism to release resources or
 * cancelable operations when they are no longer needed.
 *
 * This type defines a structure that requires an `unsubscribe` method, allowing consumers
 * to implement custom behavior or cleanup logic when the subscription is no longer active.
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
 * @property {function} add - Adds one or more listeners to the group with optional error handlers.
 */
export type IGroupSubscription<T> = ISubscriptionLike & {
    add(listener: IListener<T> | IListener<T>[], errorHandler?: IErrorCallback | IErrorCallback[]): IGroupSubscription<T>;
};

/**
 * Represents a composite interface that combines multiple functionalities for handling events, transformations, and subscriptions in a generic way.
 *
 * @template T The type of the data or events processed by the setup.
 * @typedef {object} ISetup<T>
 * @property {IUnsubscribeByPositive<T>} Implements unsubscribe functionality based on positive filters or criteria.
 * @property {IEmitByPositive<T>} Implements emission functionality for events based on positive conditions.
 * @property {IOnce<T>} Provides mechanisms for handling one-time subscriptions.
 * @property {ISwitch<T>} Interface for enabling switch-like behavior for managing state or event streams.
 * @property {ITransform<T>} Allows for the transformation of data or events before they are processed or re-emitted.
 * @property {ISerialisation} Includes methods for serializing and deserializing data structures.
 * @property {ISubscribe<T>} Implements standard subscription management functionalities.
 */
export type ISetup<T> =
    IUnsubscribeByPositive<T> &
    IEmitByPositive<T> &
    IOnce<T> &
    ISwitch<T> &
    ITransform<T> &
    ISerialisation &
    IGroup<T> &
    ISubscribe<T>;

/**
 * Represents an ordered setup configuration that combines multiple ordered operations
 * related to subscribing, emitting, transforming, serializing, and other functionalities.
 * This type extends various ordered operation interfaces to provide a comprehensive
 * structure for managing ordered processing of type T data.
 *
 * It includes the following features:
 * - Unsubscription handling in an ordered manner.
 * - Event emission management with positive ordering.
 * - One-time execution of operations.
 * - Switching between different ordered setups.
 * - Transformation of data in an ordered way.
 * - Serialization and deserialization capabilities.
 * - Subscription management adhering to order.
 *
 * @template T The type of the data to be handled by the ordered setup.
 */
export type IOrderedSetup<T> =
    IOrderedUnsubscribeByPositive<T> &
    IOrderedEmitByPositive<T> &
    IOrderedOnce<T> &
    IOrderedSwitch<T> &
    IOrderedTransform<T> &
    IOrderedSerialisation &
    IOrderedGroup<T> &
    IOrderedSubscribe<T>;

/**
 * Represents a composite type that combines several interfaces to define
 * the behavior and properties of a subscription object with extended
 * features.
 *
 * @template T The type of data being interacted with in the subscription object.
 *
 * @extends ISubscriptionLike Represents the basic structure for subscription-like objects.
 * @extends IPause Provides the ability to pause and resume functionality.
 * @extends IOrder Adds capabilities for managing ordered processing or priority.
 * @extends ISend<T> Includes sending data functionality with type T.
 * @extends ISetup<T> Incorporates setup or initialization procedures with type T.
 */
export type ISubscribeObject<T> =
    ISubscriptionLike &
    IPause &
    IOrder &
    ISend<T> &
    ISetup<T>;

/**
 * Represents a counter interface for subscriptions.
 * An ISubscribeCounter instance provides methods to query the size
 * of the collection or group being managed.
 */
export type ISubscribeCounter = {
    size(): number;
};

/**
 * Interface representing a subscriber that can hold a value and has a subscription mechanism.
 * Combines the functionalities of value retrieval and subscription handling.
 *
 * @template T - The type of the value that the subscriber holds.
 *
 * @property {boolean} isEnable - Indicates whether the subscriber is currently enabled.
 *
 * @method getValue
 * Retrieves the current value held by the subscriber.
 * @returns {T | undefined} The current value of type T if available, or undefined if not set.
 *
 * @extends ISubscribe
 */
export type ISubscriber<T> =
    {
        getValue(): T | undefined,
        isEnable: boolean
    } &
    ISubscribe<T>;

/**
 * An interface representing an Observer with extended functionalities for managing subscriptions,
 * controlling observability, and interacting with subscriber-related behavior.
 *
 * @template T - The type of the observed value.
 *
 * @extends ISetObservableValue
 * @extends ISubscriber<T>
 * @extends IDestroy
 * @extends ISubscribeCounter
 * @extends IObservablePipe<T>
 *
 * @property {function(ISubscriptionLike): void} unSubscribe - Removes a specific subscriber from the observer.
 * @property {function(): void} unsubscribeAll - Removes all subscribers from the observer.
 * @property {function(): void} disable - Temporarily disables the observer, preventing it from notifying subscribers.
 * @property {function(): void} enable - Re-enables the observer, allowing it to notify subscribers.
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
 * Represents a generic stream interface for processing arrays of type T.
 *
 * This interface defines a method to input and handle data streams.
 * Mirrors for...of semantics (pairs with IObjectStream for objects).
 *
 * @template T The type of the data elements to be streamed.
 * @typedef {Object} IStream
 * @property {(value: T[]) => void} of A method to emit array elements one by one.
 */
export type IStream<T> = {
    of(value: T[]): void;
}

/**
 * Defines an interface for streaming object entries one by one.
 * Mirrors for...in semantics (pairs with IStream for arrays).
 *
 * @template K The type of the object keys.
 * @template V The type of the object values.
 * @typedef {Object} IObjectStream
 * @property {(value: Record<K, V>) => void} in A method to emit object key-value pairs one by one.
 */
export type IObjectStream<K extends string | number | symbol, V> = {
    in(value: Record<K, V>): void;
}

/**
 * Represents an interface for pausing and resuming operations.
 *
 * The IPause interface provides methods to pause and resume a process or operation.
 * It can be used as a structure for implementing functionality where halting and continuing an activity is required.
 *
 * Method Summary:
 * - `pause`: Invokes a pause in the operation.
 * - `resume`: Resumes the operation from a paused state.
 */
export type IPause = {
    pause(): void;
    resume(): void;
};

/**
 * Represents an observable pipe, which provides a mechanism to transform or manipulate a stream of data.
 *
 * This type defines the structure for an object with a `pipe` method. The `pipe` method is intended
 * to configure or sequence certain operations on data of type `T` and return an optional setup structure.
 *
 * @template T - The type of data the observable pipe operates on.
 * @property {Function} pipe - A method that executes the defined setup or transformation process.
 *                              Returns an `ISetup<T>` instance or `undefined` if no setup is performed.
 */
export type IObservablePipe<T> = {
    pipe(): ISetup<T> | undefined
};

/**
 * Represents an interface for an ordered observable pipe.
 *
 * @template T - The type of the value being processed through the pipe.
 *
 * @property {Function} pipe - A method that processes the observable stream and returns a setup.
 *                             The setup may be undefined if no valid output is generated.
 * @returns {ISetup<T> | undefined} - Returns an instance of ISetup of type T if the processing succeeds,
 *                                     otherwise undefined.
 */
export type IOrderedObservablePipe<T> = {
    pipe(): ISetup<T> | undefined
};

/**
 * Interface ISend represents a contract for sending a value of a generic type.
 *
 * This interface declares a single method, `send`, which is responsible
 * for handling the transmission or processing of the provided value.
 *
 * @template T - The type of the value that can be sent using this interface.
 */
export type ISend<T> = {
    send(value: T): void;
};

/**
 * Represents an interface that provides a method for unsubscribing actions based on a
 * specified negative condition defined by a callback function.
 *
 * @template T - The type parameter that the interface will operate with.
 *
 * @property unsubscribeByNegative - A method to unsubscribe based on the evaluation
 *                                    of a condition provided through a callback.
 *
 * @param condition - A callback function that determines the criteria for unsubscribing.
 *                    The callback may evaluate a condition on the type `T`.
 * @returns An object of type `ISetup<T>` which represents the setup or state after
 *          the unsubscribe operation.
 */
export type IUnsubscribeByNegative<T> = {
    unsubscribeByNegative(condition: ICallback<T>): ISetup<T>;
};

/**
 * Represents an interface that provides a mechanism to unsubscribe using a negative condition.
 *
 * @template T The type of data handled by the callback function.
 *
 * @typedef {Object} IOrderedUnsubscribeByNegative
 * @property {function(condition: ICallback<T>): IOrderedSetup<T>} unsubscribeByNegative
 *           A method that allows unsubscribing based on a provided negative condition.
 *           The condition is determined through the given callback function.
 */
export type IOrderedUnsubscribeByNegative<T> = {
    unsubscribeByNegative(condition: ICallback<T>): IOrderedSetup<T>;
};

/**
 * Represents a generic type that allows for unsubscribing based on a given condition.
 *
 * This type is designed to provide an interface for managing subscriptions
 * that can be terminated by evaluating a condition specified by the user.
 *
 * @template T - The type of the value being processed or observed in the context
 * of the unsubscribe operation.
 *
 * @property {function} unsubscribeBy - A method to unsubscribe based on a specified condition.
 * This condition is defined as a callback function that determines whether the unsubscribe action
 * should be performed.
 *
 * @param {ICallback<T>} condition - A callback function that evaluates the condition for unsubscribing.
 * The callback should return a value indicating whether the specified condition has been met.
 *
 * @returns {ISetup<T>} - Returns an instance of ISetup to allow further configuration or management
 * following the unsubscribe operation.
 */
export type IUnsubscribeByPositive<T> = {
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
};

/**
 * Represents an interface for managing ordered unsubscription using a provided condition.
 *
 * @template T - The type parameter representing the data model or entity being handled.
 *
 * @typedef {Object} IOrderedUnsubscribeByPositive
 * @property {(condition: ICallback<T>) => ISetup<T>} unsubscribeBy - Method to unsubscribe items based on a specific condition.
 *   Accepts a callback function that determines the criteria for unsubscription and returns the setup object associated with the operation.
 */
export type IOrderedUnsubscribeByPositive<T> = {
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
};

/**
 * Represents a type for an object that allows emitting events based on a negative condition.
 *
 * @template T The type of the value that will be passed to the callback and setup methods.
 *
 * @property {function(condition: ICallback<T>): ISetup<T>} emitByNegative - A method that triggers a setup process
 *                                                                          if a specified condition evaluates to a negative result.
 */
export type IEmitByNegative<T> = {
    emitByNegative(condition: ICallback<T>): ISetup<T>;
};

/**
 * Represents an interface for handling ordered emissions based on a negative condition.
 *
 * @template T - The type of the value being processed.
 *
 * @typedef {Object} IOrderedEmitByNegative
 *
 * @property {function(condition: ICallback<T>): IOrderedSetup<T>} emitByNegative -
 * A method that determines ordered emissions of elements based on a provided
 * condition that evaluates to a negative criteria.
 *
 * @callback ICallback<T>
 * A callback function used to define the negative condition for emission.
 *
 * @returns {IOrderedSetup<T>}
 * Returns an instance of IOrderedSetup<T>, facilitating further configuration
 * of the ordered emission process based on the negative condition.
 */
export type IOrderedEmitByNegative<T> = {
    emitByNegative(condition: ICallback<T>): IOrderedSetup<T>;
};

/**
 * Represents a type that facilitates AND-logic filtering of conditions.
 *
 * @template T - The type of data or element that the methods operate on.
 *
 * @typedef {Object} IEmitByPositive
 *
 * @property {function(condition: ICallback<T>): ISetup<T>} and - Applies AND-logic filter condition.
 * @property {function(conditions: ICallback<T>[]): ISetup<T>} allOf - Applies multiple AND-logic filter conditions (all must pass).
 */
export type IEmitByPositive<T> = {
    and(condition: ICallback<T>): ISetup<T>;
    allOf(conditions: ICallback<T>[]): ISetup<T>;
};

/**
 * Represents a transformation interface that defines a chainable method to apply transformations to a value
 * using a provided callback function and returning a setup structure for further transformations.
 *
 * @template T - The type of the input value that the transformation operates on.
 *
 * @typedef {Object} ITransform
 *
 * @property {function} map - Method that takes a callback function and returns a setup structure for further transformations.
 * @param {ICallback<T>} condition - The transformation logic applied to the input.
 * @returns {ISetup<K>} A setup structure for additional transformations.
 */
export type ITransform<T> = {
    map<K>(condition: ICallback<T>): ISetup<K>;
};

/**
 * ISerialisation interface defines the structure for objects responsible for
 * handling JSON serialization and deserialization of data.
 *
 * This interface provides methods to convert data to JSON string format
 * and to parse JSON strings back into a desired type.
 *
 * The generic method `fromJson` allows flexibility in defining the type
 * of data to be returned upon deserialization.
 */
export type ISerialisation = {
    toJson(): ISetup<string>;
    fromJson<K>(): ISetup<K>;
};

/**
 * A type that represents an ordered operation which processes and refines
 * elements for a positive outcome. This is achieved through the use of
 * conditional callbacks and the ability to chain multiple refinement conditions.
 *
 * @template T - The type of the element being processed.
 *
 * @property {Function} and - Applies a single AND-logic filter condition.
 * This function accepts a single callback condition which determines the filter logic
 * and returns an updated setup instance.
 *
 * @property {Function} allOf - Applies multiple AND-logic filter conditions (all must pass).
 * Accepts an array of callback conditions and returns an updated setup instance.
 */
export type IOrderedEmitByPositive<T> = {
    and(condition: ICallback<any>): ISetup<T>;
    allOf(conditions: ICallback<any>[]): ISetup<T>;
};

/**
 * Represents an interface for an ordered transformation sequence applied to a data type `T`.
 *
 * @template T - The type of the data to be transformed.
 */
export type IOrderedTransform<T> = {
    map<K>(condition: ICallback<T>): ISetup<K>;
};

/**
 * Represents an interface for ordered serialization and deserialization operations.
 * Useful for implementing structured serialization mechanisms that maintain a specific order.
 *
 * @interface
 * @typedef {Object} IOrderedSerialisation
 *
 * @property {function(): ISetup<string>} toJson - Converts an object or value to JSON string in a structured and ordered format.
 * @property {function(): ISetup<K>} fromJson - Parses a JSON string back into an object or value of type `K`.
 */
export type IOrderedSerialisation = {
    toJson(): ISetup<string>;
    fromJson<K>(): ISetup<K>;
};

/**
 * Defines a structure for an object that provides a mechanism to emit a match based on a given condition.
 *
 * @template T The type parameter representing the expected return type of the setup process.
 */
export type IEmitMatchCondition<T> = {
    emitMatch(condition: ICallback<any>): ISetup<T>;
};

/**
 * Represents a condition for emitting a match in a specific order.
 * The match condition is defined by the provided callback and
 * can be used to set up ordered operations.
 *
 * @template T - The type of data associated with the ordered setup.
 *
 * @property {function(condition: ICallback<any>): IOrderedSetup<T>} emitMatch
 * - A method to define a condition for emitting a match. It accepts a callback and returns an ordered setup configuration.
 */
export type IOrderedEmitMatchCondition<T> = {
    emitMatch(condition: ICallback<any>): IOrderedSetup<T>;
};

/**
 * ICollector is an interface that combines IDestroy and ISubscribeCounter interfaces,
 * providing additional functionality for managing subscriptions.
 * This interface allows for collecting, unsubscribing, and batch unsubscription of subscription-like objects.
 *
 * The primary purpose of ICollector is to manage subscription lifecycles efficiently and ensure
 * that subscriptions are correctly unsubscribed when no longer needed.
 *
 * Methods:
 * - collect(...subscriptionLikeList): Adds one or more subscription-like objects to be managed by the collector.
 * - unsubscribe(subscriptionLike): Unsubscribes a single subscription-like object that the collector is managing.
 * - unsubscribeAll(): Unsubscribes all subscription-like objects managed by the collector.
 */
export type ICollector =
    IDestroy &
    ISubscribeCounter &
    {
        collect(...subscriptionLikeList: ISubscriptionLike[]): void;
        unsubscribe(subscriptionLike: ISubscriptionLike): void;
        unsubscribeAll(): void;
    };

/**
 * IOrderedObservable is a type definition that represents an object with the ability
 * to determine whether elements are sorted in a specific order.
 *
 * This type contains a single method, `sortByOrder`, which is used to perform a determination
 * or operation associated with the ordering of elements.
 *
 * @typedef {Object} IOrderedObservable
 * @property {Function} sortByOrder - A method that checks or enforces the ordering of elements.
 * Returns a boolean representing whether the ordering is correct or applicable.
 */
export type IOrderedObservable = {
    sortByOrder(): boolean;
};

/**
 * Represents a type that combines the behavior of an observer, an ordered observable, and an ordered observable pipe.
 * This interface is generic and accepts a type parameter `T`, which specifies the data type it operates on.
 *
 * The `IOrdered` interface is composed of:
 * - `IObserver<T>`: Handles observation logic for receiving values of type `T`.
 * - `IOrderedObservable`: Encapsulates logic for ordered observables.
 * - `IOrderedObservablePipe<T>`: Defines transformation and handling of ordered observable data of type `T`.
 *
 * Use this interface when working with structures that need ordered observation and transformation capabilities.
 */
export type IOrdered<T> = IObserver<T> & IOrderedObservable & IOrderedObservablePipe<T>;

/**
 * A type that combines the features of `ISubscriptionLike` and `IOrder`.
 * Represents a subscription-like object that also implements ordering properties or methods.
 *
 * This type is typically used in scenarios where an object needs to maintain
 * subscription behavior alongside ordered data or operations.
 *
 * It inherits all the characteristics and requirements of both `ISubscriptionLike` and `IOrder`.
 */
export type IOrderedSubscriptionLike = (ISubscriptionLike & IOrder);

/**
 * Represents an interface for an ordered subscription mechanism.
 *
 * @template T The type of data that the subscription will handle.
 *
 * @typedef {Object} IOrderedSubscribe
 * @property {function(IListener<T>, IErrorCallback=): IOrderedSubscriptionLike} subscribe
 *  Subscribes to the updates with a listener callback and an optional error handler.
 *  Returns a subscription-like object for managing the subscription.
 *
 * @callback IListener
 *  Defines a listener callback function that is notified with updates of type T.
 *
 * @callback IErrorCallback
 *  Defines an optional error handler that is called whenever an error occurs in the subscription mechanism.
 *
 * @typedef {Object} IOrderedSubscriptionLike
 *  Represents an object that provides methods to manage the lifecycle of the subscription.
 */
export type IOrderedSubscribe<T> = {
    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike;
};

/**
 * Represents a container for a chain of elements.
 *
 * This interface defines a structure that holds an array of elements.
 * It is used to manage and interact with a sequential chain of items.
 *
 * Properties:
 * - chain: An array representing the chain, where each element can be of any type.
 */
export type IChainContainer = {
    chain: any[];
}

/**
 * Represents the payload structure used within a pipe system.
 *
 * This type defines the fields necessary for managing the flow and control
 * within a pipe operation, including breaking, unsubscribing, availability
 * status, and the actual payload to be processed or transmitted.
 *
 * Properties:
 * - isBreak: A boolean indicating if the pipe operation should terminate.
 * - isUnsubscribe: A boolean indicating if the operation should include an unsubscribing action.
 * - isAvailable: A boolean specifying whether the payload is available for processing.
 * - payload: A flexible property designed to hold any data intended to be carried through the pipe.
 */
export type IPipePayload = { isBreak: boolean, isUnsubscribe: boolean, isAvailable: boolean, payload: any };
/**
 * Represents a callback function interface for handling chain-related operations.
 * This function is typically invoked with a payload to perform specific operations
 * in a chain or pipeline.
 *
 * @callback IChainCallback
 * @param {IPipePayload} data - The payload passed to the callback function
 *                              containing the necessary data for processing.
 */
export type IChainCallback = (data: IPipePayload) => void;
/**
 * Represents a pipeline case that extends the functionality of subscribing
 * to a stream of data with additional case-checking operations.
 *
 * @template T - The type of data being processed in the pipeline.
 * @extends ISubscribe<T>
 */
export type IPipeCase<T> = ISubscribe<T> & {
    or(condition: ICallback<any>): IPipeCase<T> & ISubscribe<T>;
    anyOf(conditions: ICallback<any>[]): IPipeCase<T> & ISubscribe<T>;
};
/**
 * Represents a combined subscriber that can either be a listener or a setter for observable values.
 *
 * This type is a union of `IListener<T>` and `ISetObservableValue`, providing flexibility to handle subscriptions
 * with different behaviors. It allows implementing components to react to changes in data or directly set observable values.
 *
 * @template T - The type of the value to be handled by the subscriber.
 */
export type ICombinedSubscriber<T> = IListener<T> | ISetObservableValue;
/**
 * Represents a type definition for a group of subscriptions.
 *
 * This type can be either a single `ICombinedSubscriber` instance or an array of `ICombinedSubscriber` instances.
 *
 * @template T The type of data that the subscriber(s) will handle.
 */
export type ISubscribeGroup<T> =
    ICombinedSubscriber<T> |
    ICombinedSubscriber<T>[];

/**
 * Represents an interface for adding a filter to a specific setup or configuration.
 *
 * @template T - The type that the filter setup operates on.
 */
export type IAddFilter<T> = {
    addFilter(): IFilterSetup<T>;
}
/**
 * Represents a setup for filtering that combines the functionality of IFilter and IFilterSwitch interfaces.
 * This type is parameterized with a generic type T, which determines the type of data it operates on.
 *
 * It encompasses the capabilities provided by the IFilter and IFilterSwitch types, allowing for more
 * robust and flexible filter setups. This is particularly useful in scenarios where both filtering
 * logic and the ability to switch between filter states are required.
 *
 * @template T The type of the items to be filtered by the setup.
 */
export type IFilterSetup<T> = IFilter<T> & IFilterSwitch<T>;

/**
 * Represents a generic filtering interface that applies conditions to a data set.
 *
 * @template T The type of data this filter will operate on.
 *
 * @typedef {Object} IFilter
 *
 * @property {function(condition: ICallback<any>): IFilterSetup<T>} and
 * Applies a single AND-logic filtering condition to the data set.
 *
 * @property {function(conditions: ICallback<any>[]): IFilterSetup<T>} allOf
 * Applies multiple AND-logic filtering conditions to the data set (all must pass).
 */
export type IFilter<T> = {
    and(condition: ICallback<any>): IFilterSetup<T>;
    allOf(conditions: ICallback<any>[]): IFilterSetup<T>;
};

/**
 * Interface representing a filter switch mechanism.
 *
 * This interface defines a method for managing cases within a filter switch
 * process, allowing the user to determine a specific behavior based on a given
 * context or condition mapped to the type parameter `T`.
 *
 * @template T Type of the context or condition used by the filter switch.
 */
export type IFilterSwitch<T> = {
    choice(): FilterSwitchCase<T>;
};

/**
 * Represents a filtering construct that allows chaining of conditional cases.
 * Utilized to sequentially apply multiple conditions for filtering items.
 *
 * @template T - The type of the elements to be filtered.
 */
export type IFilterCase<T> = {
    or(condition: ICallback<any>): IFilterCase<T>;
    anyOf(conditions: ICallback<any>[]): IFilterCase<T>;
};

/**
 * Represents the structure of a filter payload that includes the state of a break, availability, and additional payload.
 *
 * @typedef {Object} IFilterPayload
 * @property {boolean} isBreak Indicates whether the current state represents a break.
 * @property {boolean} isAvailable Indicates whether the current state is available.
 * @property {any} payload Holds additional data associated with the filter payload.
 */
export type IFilterPayload = { isBreak: boolean, isAvailable: boolean, payload: any };

/**
 * Represents a callback function that is invoked during a filter chain operation.
 *
 * The IFilterChainCallback is intended to process or manipulate the provided
 * filter payload and perform necessary actions as part of the filter chain execution.
 *
 * The callback function receives a single argument, which is the filter payload data,
 * allowing it to perform operations relevant to the filtering process.
 *
 * @callback IFilterChainCallback
 * @param {IFilterPayload} data - The payload data to be processed by the callback during the filter chain execution.
 */
export type IFilterChainCallback = (data: IFilterPayload) => void;

/**
 * Represents the response format for a filtering operation.
 *
 * This type defines the standard structure for the response data when
 * performing a filter operation. It indicates the success status and
 * contains the corresponding payload of data.
 *
 * Properties:
 * - `isOK`: A boolean indicating whether the filtering operation was successful.
 * - `payload`: The data retrieved or processed during the filtering operation;
 *   this can be of any type.
 */
export type IFilterResponse = {
    isOK: boolean;
    payload: any;
};
