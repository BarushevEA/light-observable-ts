"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortDescending = exports.sortAscending = exports.randomCallback = exports.positiveCallback = exports.negativeCallback = exports.quickDeleteFromArray = exports.deleteFromArray = void 0;
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
const negativeCallback = () => false;
exports.negativeCallback = negativeCallback;
const positiveCallback = () => true;
exports.positiveCallback = positiveCallback;
const randomCallback = () => "772716b8-e6e2-47ac-95e9-e8d99ce35124";
exports.randomCallback = randomCallback;
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
