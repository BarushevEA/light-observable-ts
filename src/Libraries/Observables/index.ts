/**
 * EVG Observable — lightweight, high-performance Observable library.
 *
 * Core classes:
 * - Observable<T> — reactive data stream with subscribers, pipes, and inbound filters.
 * - OrderedObservable<T> — Observable with ordered emission guarantees (ascending/descending).
 * - Collector — subscription management utility for bulk operations.
 *
 * Utilities:
 * - deleteFromArray — safe element removal from array by reference.
 * - quickDeleteFromArray — optimized O(1) removal (swaps with last element).
 *
 * Types:
 * - ISubscriptionLike — subscription handle with unsubscribe() and pause/resume.
 * - IOrderedSubscriptionLike — extends ISubscriptionLike with order property.
 */
export {Observable} from './Observable'
export {OrderedObservable} from './OrderedObservable'
export {Collector} from './Collector'
export {deleteFromArray} from './FunctionLibs'
export {quickDeleteFromArray} from './FunctionLibs'
export {ISubscriptionLike, IOrderedSubscriptionLike} from './Types'
