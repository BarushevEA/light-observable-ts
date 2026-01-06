"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedSubscribeObject = void 0;
const SubscribeObject_1 = require("./SubscribeObject");
/**
 * Represents an ordered subscription object, extending the functionality
 * of the SubscribeObject to include ordering and the ability to manage
 * subscriptions based on a given order.
 *
 * This class is designed to work with observables that support ordering
 * functionality. It implements the `IOrderedSetup` interface to manage
 * ordering behavior and sorting operations.
 *
 * @template T The type of the data managed by the subscription.
 */
class OrderedSubscribeObject extends SubscribeObject_1.SubscribeObject {
    /**
     * Creates an instance of the constructor with the specified observable and pipe flag.
     *
     * @param {OrderedObservable<T> | IOrdered<T>} observable - The ordered observable or IOrdered instance to attach to this instance.
     * @param {boolean} [isPipe] - Optional flag indicating if the stream is part of a piping sequence.
     * @return {void}
     */
    constructor(observable, isPipe) {
        super(observable, isPipe);
    }
    /**
     * Retrieves the order value.
     *
     * @return {number} The current order value.
     */
    get order() {
        return this._order;
    }
    /**
     * Sets the order value for this object. If the observer is not defined or is destroyed,
     * the order value is reset to undefined. Otherwise, the order value is updated, and
     * the observer is instructed to sort items by the updated order.
     *
     * @param {number} value - The new order value to be set.
     */
    set order(value) {
        if (!this.observer ||
            (this.observer && this.observer.isDestroyed)) {
            this._order = undefined;
            return;
        }
        this._order = value;
        this.observer.sortByOrder();
    }
    /**
     * Subscribes an observer to the observable, allowing it to receive updates.
     *
     * @param {IListener<T> | ISetObservableValue} observer - The observer that will receive updates. It can be either a listener function or a setter for the observable value.
     * @param {IErrorCallback} [errorHandler] - An optional error callback that will be invoked if an error occurs during the subscription process.
     * @return {IOrderedSubscriptionLike} The current subscription instance for chaining purposes.
     */
    subscribe(observer, errorHandler) {
        super.subscribe(observer, errorHandler);
        return this;
    }
    /**
     * Sets the subscription to be invoked only once. After the subscription
     * is called for the first time, it will be automatically removed.
     *
     * @return {IOrderedSubscribe<T>} The subscription instance configured to execute only once.
     */
    setOnce() {
        return super.setOnce();
    }
}
exports.OrderedSubscribeObject = OrderedSubscribeObject;
