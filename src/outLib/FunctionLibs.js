"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positiveCallback = exports.negativeCallback = exports.quickDeleteFromArray = exports.deleteFromArray = void 0;
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
