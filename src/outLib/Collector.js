"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
/**
 * The Collector class is responsible for managing a collection of resources or subscription-like objects
 * that need to be cleaned up or unsubscribed from, ensuring proper resource management.
 * Implements the ICollector interface.
 *
 * The typical lifecycle of a Collector involves collecting subscription-like items, optionally
 * unsubscribing from specific ones, unsubscribing from all resources, and destroying the collector
 * when it's no longer needed.
 */
class Collector {
    arr = [];
    killed = false;
    /**
     * Adds one or more subscription-like objects to the internal collection.
     * Ensures the subscriptions are saved for future management if the object
     * is not in a "killed" state.
     *
     * @param {ISubscriptionLike[]} subscriptionLikeList - The subscription-like objects to be collected.
     * @return {void} This method does not return a value.
     */
    collect(...subscriptionLikeList) {
        if (!this.killed)
            this.arr.push(...subscriptionLikeList);
    }
    /**
     * Unsubscribes a given subscription and removes it from the internal array.
     *
     * @param {ISubscriptionLike | undefined} subscriptionLike - The subscription to unsubscribe and remove. If undefined, no action is taken.
     * @return {void} This method does not return a value.
     */
    unsubscribe(subscriptionLike) {
        if (this.killed)
            return;
        subscriptionLike?.unsubscribe();
        (0, FunctionLibs_1.quickDeleteFromArray)(this.arr, subscriptionLike);
    }
    /**
     * Unsubscribes from all the currently active subscriptions managed by this instance.
     * If the instance is marked as killed, the method will exit without performing any action.
     *
     * @return {void | null} Returns `null` if the instance is killed, otherwise does not return a value.
     */
    unsubscribeAll() {
        if (this.killed)
            return;
        const arr = this.arr;
        for (let i = 0; i < arr.length; i++)
            arr[i].unsubscribe();
        arr.length = 0;
    }
    /**
     * Determines the size of the array managed by the instance.
     * If the instance is marked as killed, the size is returned as 0.
     *
     * @return {number} The number of elements in the array, or 0 if the instance is killed.
     */
    size() {
        if (this.killed)
            return 0;
        return this.arr.length;
    }
    /**
     * Cleans up resources by unsubscribing from all subscriptions, clearing the array, and marking the instance as destroyed.
     *
     * @return {void} Does not return any value.
     */
    destroy() {
        this.unsubscribeAll();
        this.arr.length = 0;
        this.arr = 0;
        this.killed = true;
    }
    /**
     * Checks if the object is destroyed.
     *
     * @return {boolean} Returns true if the object is destroyed, otherwise false.
     */
    get isDestroyed() {
        return this.killed;
    }
}
exports.Collector = Collector;
