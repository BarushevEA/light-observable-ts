"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAscending = sortAscending;
exports.sortDescending = sortDescending;
exports.deleteFromArray = deleteFromArray;
exports.quickDeleteFromArray = quickDeleteFromArray;
exports.getListener = getListener;
/**
 * Compares two ISubscribeObject items based on their `order` property
 * and sorts them in ascending order.
 *
 * @param {ISubscribeObject<any>} a - The first object to compare.
 * @param {ISubscribeObject<any>} b - The second object to compare.
 * @return {number} - Returns 1 if the `order` property of `a` is greater than `b`,
 *                    -1 if the `order` property of `a` is less than `b`,
 *                     or 0 if they are equal.
 */
function sortAscending(a, b) {
    if (a.order > b.order)
        return 1;
    if (a.order < b.order)
        return -1;
    return 0;
}
/**
 * Compares two objects based on their `order` property for descending sorting.
 *
 * @param {ISubscribeObject<any>} a - The first object to compare, expected to have an `order` property.
 * @param {ISubscribeObject<any>} b - The second object to compare, expected to have an `order` property.
 * @return {number} - Returns -1 if `a.order` is greater than `b.order`, 1 if `a.order` is less than `b.order`, and 0 if they are equal.
 */
function sortDescending(a, b) {
    if (a.order > b.order)
        return -1;
    if (a.order < b.order)
        return 1;
    return 0;
}
/**
 * Removes the specified component from the provided array if it exists.
 *
 * @param {T[]} arr - The array from which the component will be removed.
 * @param {T} component - The component to be removed from the array.
 * @return {boolean} Returns true if the component was successfully removed, false otherwise.
 */
function deleteFromArray(arr, component) {
    const index = arr.indexOf(component);
    if (index === -1)
        return false;
    arr.splice(index, 1);
    return true;
}
/**
 * Removes a specified element from an array by replacing it with the last element
 * and reducing the array's length. This method avoids maintaining order but performs
 * the deletion operation efficiently.
 *
 * @param {T[]} arr - The array from which the element will be removed.
 * @param {T} component - The element to be removed from the array.
 * @return {boolean} - Returns true if the element was found and removed;
 *                     otherwise, returns false.
 */
function quickDeleteFromArray(arr, component) {
    const index = arr.indexOf(component);
    if (index === -1)
        return false;
    arr[index] = arr[arr.length - 1];
    arr.length--;
    return true;
}
/**
 * Returns a listener function based on the provided listener group.
 *
 * @param {ISubscribeGroup<T>} listenerGroup - The group of listener(s). It can be a single listener
 *        or an array of listeners that are invoked when the returned listener is called.
 * @return {IListener<T>} A single listener function that wraps the provided listener or group of listeners
 *         and invokes them with the provided data.
 */
function getListener(listenerGroup) {
    if (Array.isArray(listenerGroup)) {
        const group = [];
        for (let i = 0; i < listenerGroup.length; i++)
            group.push(wrapListener(listenerGroup[i]));
        return (data) => {
            for (let i = 0; i < group.length; i++)
                group[i](data);
        };
    }
    return wrapListener(listenerGroup);
}
/**
 * Wraps the provided listener, ensuring it conforms to the IListener<T> interface.
 *
 * @param listener The listener to be wrapped. Can be either an IListener<T> or an ISetObservableValue.
 * @return Returns a listener that adheres to the IListener<T> interface.
 */
function wrapListener(listener) {
    if ("next" in listener)
        return (value) => listener.next(value);
    return listener;
}
