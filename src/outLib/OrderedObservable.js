"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedObservable = void 0;
const Observable_1 = require("./Observable");
const FunctionLibs_1 = require("./FunctionLibs");
const OrderedSubscribeObject_1 = require("./OrderedSubscribeObject");
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
class OrderedObservable extends Observable_1.Observable {
    /**
     * Represents the direction in which sorting should occur.
     * The value is expected to indicate whether the sorting
     * should be performed in ascending or descending order.
     *
     * Possible values:
     * - `sortAscending`: Sorting in ascending order.
     * - `sortDescending`: Sorting in descending order.
     */
    sortDirection = FunctionLibs_1.sortAscending;
    /**
     * Sets the sorting order to ascending and applies the sorting.
     *
     * @return {boolean} Returns true if the sorting operation is successful, otherwise false.
     */
    setAscendingSort() {
        this.sortDirection = FunctionLibs_1.sortAscending;
        return this.sortByOrder();
    }
    /**
     * Sets the sorting order to descending and updates the sort configuration.
     *
     * @return {boolean} Returns `true` if the sorting operation is configured and applied successfully, otherwise returns `false`.
     */
    setDescendingSort() {
        this.sortDirection = FunctionLibs_1.sortDescending;
        return this.sortByOrder();
    }
    /**
     * Sorts the `subs` array based on the specified sort direction if the object is not in a "killed" state.
     *
     * @return {boolean} Returns true if the sorting was performed, false if the object is in a "killed" state.
     */
    sortByOrder() {
        if (this.killed)
            return false;
        this.subs.sort(this.sortDirection);
        return true;
    }
    /**
     * Subscribes a listener to this instance with an optional error handler.
     *
     * @param {ISubscribeGroup<T>} listener - The listener object that should be notified of changes.
     * @param {IErrorCallback} [errorHandler] - An optional handler to process errors during execution.
     * @return {IOrderedSubscriptionLike | undefined} Returns an instance of IOrderedSubscriptionLike if the listener is valid; otherwise, returns undefined.
     */
    subscribe(listener, errorHandler) {
        if (!this.isListener(listener))
            return undefined;
        const subscribeObject = new OrderedSubscribeObject_1.OrderedSubscribeObject(this, false);
        this.addObserver(subscribeObject, listener, errorHandler);
        return subscribeObject;
    }
    /**
     * Creates and returns an instance of `OrderedSubscribeObject` tied to the current object,
     * facilitating ordered subscription setup. If the instance is marked as killed, it returns undefined.
     *
     * @return {IOrderedSetup<T> | undefined} An instance of `OrderedSubscribeObject` for subscription setup,
     *         or undefined if the operation is not allowed.
     */
    pipe() {
        if (this.killed)
            return undefined;
        const subscribeObject = new OrderedSubscribeObject_1.OrderedSubscribeObject(this, true);
        this.subs.push(subscribeObject);
        return subscribeObject;
    }
    /**
     * Removes a previously subscribed listener from the subscription list,
     * preventing it from receiving further updates. If the system is in a
     * "killed" state or specific conditions in the process flow are met,
     * the listener may instead be added to a trash list.
     *
     * @param {ISubscriptionLike} listener - The subscription listener to be unsubscribed or handled accordingly.
     * @return {void} Does not return any value.
     */
    unSubscribe(listener) {
        if (this.killed)
            return;
        if (this.process && listener) {
            this.trash.push(listener);
            return;
        }
        this.subs && !(0, FunctionLibs_1.quickDeleteFromArray)(this.subs, listener);
    }
}
exports.OrderedObservable = OrderedObservable;
