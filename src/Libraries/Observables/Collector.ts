import {ICollector, ISubscriptionLike} from "./Types";
import {quickDeleteFromArray} from "./FunctionLibs";

/**
 * The Collector class is responsible for managing a collection of resources or subscription-like objects
 * that need to be cleaned up or unsubscribed from, ensuring proper resource management.
 * Implements the ICollector interface.
 *
 * The typical lifecycle of a Collector involves collecting subscription-like items, optionally
 * unsubscribing from specific ones, unsubscribing from all resources, and destroying the collector
 * when it's no longer needed.
 */
export class Collector implements ICollector {
    protected arr: ISubscriptionLike[] = [];
    private killed = false;

    /**
     * Adds one or more subscription-like objects to the internal collection.
     * Ensures the subscriptions are saved for future management if the object
     * is not in a "killed" state.
     *
     * @param {ISubscriptionLike[]} subscriptionLikeList - The subscription-like objects to be collected.
     * @return {void} This method does not return a value.
     */
    collect(...subscriptionLikeList: ISubscriptionLike[]): void {
        if (!this.killed) this.arr.push(...subscriptionLikeList);
    }

    /**
     * Unsubscribes a given subscription and removes it from the internal array.
     *
     * @param {ISubscriptionLike | undefined} subscriptionLike - The subscription to unsubscribe and remove. If undefined, no action is taken.
     * @return {void} This method does not return a value.
     */
    unsubscribe(subscriptionLike: ISubscriptionLike | undefined): void {
        if (this.killed) return;
        subscriptionLike?.unsubscribe();
        quickDeleteFromArray(this.arr, subscriptionLike);
    }

    /**
     * Unsubscribes from all the currently active subscriptions managed by this instance.
     * If the instance is marked as killed, the method will exit without performing any action.
     *
     * @return {void | null} Returns `null` if the instance is killed, otherwise does not return a value.
     */
    unsubscribeAll(): void | null {
        if (this.killed) return;
        while (this.arr.length > 0) this.unsubscribe(this.arr.pop());
    }

    /**
     * Determines the size of the array managed by the instance.
     * If the instance is marked as killed, the size is returned as 0.
     *
     * @return {number} The number of elements in the array, or 0 if the instance is killed.
     */
    size(): number {
        if (this.killed) return 0;
        return this.arr.length;
    }

    /**
     * Cleans up resources by unsubscribing from all subscriptions, clearing the array, and marking the instance as destroyed.
     *
     * @return {void} Does not return any value.
     */
    destroy(): void {
        this.unsubscribeAll();
        this.arr.length = 0;
        this.arr = <any>0;
        this.killed = true;
    }

    /**
     * Checks if the object is destroyed.
     *
     * @return {boolean} Returns true if the object is destroyed, otherwise false.
     */
    get isDestroyed(): boolean {
        return this.killed;
    }
}
