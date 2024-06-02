"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListener = exports.quickDeleteFromArray = exports.deleteFromArray = exports.sortDescending = exports.sortAscending = void 0;
const sortAscending = (a, b) => {
    if (a.order > b.order)
        return 1;
    if (a.order < b.order)
        return -1;
    return 0;
};
exports.sortAscending = sortAscending;
const sortDescending = (a, b) => {
    if (a.order > b.order)
        return -1;
    if (a.order < b.order)
        return 1;
    return 0;
};
exports.sortDescending = sortDescending;
function deleteFromArray(arr, component) {
    const index = arr.indexOf(component);
    if (index === -1)
        return false;
    arr.splice(index, 1);
    return true;
}
exports.deleteFromArray = deleteFromArray;
function quickDeleteFromArray(arr, component) {
    const index = arr.indexOf(component);
    if (index === -1)
        return false;
    arr[index] = arr[arr.length - 1];
    arr.length = arr.length - 1;
    return true;
}
exports.quickDeleteFromArray = quickDeleteFromArray;
function getListener(listener) {
    if ("next" in listener)
        return (value) => listener.next(value);
    return listener;
}
exports.getListener = getListener;
