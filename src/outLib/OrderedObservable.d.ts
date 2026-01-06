import { Observable } from "./Observable";
import { IErrorCallback, IOrdered, IOrderedSetup, IOrderedSubscriptionLike, ISubscribeGroup, ISubscriptionLike } from "./Types";
/**
 * Represents an observable data structure that maintains elements in a specific order and provides
 * methods to manipulate and subscribe to its elements.
 *
 * The `OrderedObservable` class supports sorting elements in ascending or descending order and allows
 * for subscription to changes in its state. It extends the capabilities of a basic `Observable` by
 * incorporating sorting and ordered processing mechanisms.
 *
 * @template T The type of data stored and handled by the observable.
 * @extends Observable<T>
 * @implements IOrdered<T>
 */
export declare class OrderedObservable<T> extends Observable<T> implements IOrdered<T> {
    /**
     * Represents the direction in which sorting should occur.
     * The value is expected to indicate whether the sorting
     * should be performed in ascending or descending order.
     *
     * Possible values:
     * - `sortAscending`: Sorting in ascending order.
     * - `sortDescending`: Sorting in descending order.
     */
    private sortDirection;
    /**
     * Sets the sorting order to ascending and applies the sorting.
     *
     * @return {boolean} Returns true if the sorting operation is successful, otherwise false.
     */
    setAscendingSort(): boolean;
    /**
     * Sets the sorting order to descending and updates the sort configuration.
     *
     * @return {boolean} Returns `true` if the sorting operation is configured and applied successfully, otherwise returns `false`.
     */
    setDescendingSort(): boolean;
    /**
     * Sorts the `subs` array based on the specified sort direction if the object is not in a "killed" state.
     *
     * @return {boolean} Returns true if the sorting was performed, false if the object is in a "killed" state.
     */
    sortByOrder(): boolean;
    /**
     * Subscribes a listener to this instance with an optional error handler.
     *
     * @param {ISubscribeGroup<T>} listener - The listener object that should be notified of changes.
     * @param {IErrorCallback} [errorHandler] - An optional handler to process errors during execution.
     * @return {IOrderedSubscriptionLike | undefined} Returns an instance of IOrderedSubscriptionLike if the listener is valid; otherwise, returns undefined.
     */
    subscribe(listener: ISubscribeGroup<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike | undefined;
    /**
     * Creates and returns an instance of `OrderedSubscribeObject` tied to the current object,
     * facilitating ordered subscription setup. If the instance is marked as killed, it returns undefined.
     *
     * @return {IOrderedSetup<T> | undefined} An instance of `OrderedSubscribeObject` for subscription setup,
     *         or undefined if the operation is not allowed.
     */
    pipe(): IOrderedSetup<T> | undefined;
    /**
     * Removes a previously subscribed listener from the subscription list,
     * preventing it from receiving further updates. If the system is in a
     * "killed" state or specific conditions in the process flow are met,
     * the listener may instead be added to a trash list.
     *
     * @param {ISubscriptionLike} listener - The subscription listener to be unsubscribed or handled accordingly.
     * @return {void} Does not return any value.
     */
    unSubscribe(listener: ISubscriptionLike): void;
}
