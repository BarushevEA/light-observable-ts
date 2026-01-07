"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAscending = sortAscending;
exports.sortDescending = sortDescending;
exports.deleteFromArray = deleteFromArray;
exports.quickDeleteFromArray = quickDeleteFromArray;
exports.getListener = getListener;
function sortAscending(a, b) {
    if (a.order > b.order)
        return 1;
    if (a.order < b.order)
        return -1;
    return 0;
}
function sortDescending(a, b) {
    if (a.order > b.order)
        return -1;
    if (a.order < b.order)
        return 1;
    return 0;
}
function deleteFromArray(arr, component) {
    const index = arr.indexOf(component);
    if (index === -1)
        return false;
    arr.splice(index, 1);
    return true;
}
function quickDeleteFromArray(arr, component) {
    const index = arr.indexOf(component);
    if (index === -1)
        return false;
    arr[index] = arr[arr.length - 1];
    arr.length--;
    return true;
}
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
function wrapListener(listener) {
    if ("next" in listener)
        return (value) => listener.next(value);
    return listener;
}
