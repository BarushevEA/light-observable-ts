"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positiveCallback = exports.negativeCallback = exports.deleteFromArray = void 0;
function deleteFromArray(arr, component) {
    const index = arr.indexOf(component);
    if (index === -1)
        return false;
    const length = arr.length - 1;
    for (let i = index; i < length;)
        arr[i++] = arr[i];
    arr.length = length;
    return true;
}
exports.deleteFromArray = deleteFromArray;
const negativeCallback = () => false;
exports.negativeCallback = negativeCallback;
const positiveCallback = () => true;
exports.positiveCallback = positiveCallback;
