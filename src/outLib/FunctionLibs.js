"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromArray = void 0;
function deleteFromArray(arr, component) {
    var index = arr.indexOf(component);
    if (index === -1)
        return false;
    var length = arr.length - 1;
    for (var i = index; i < length;)
        arr[i++] = arr[i];
    arr.length--;
    return true;
}
exports.deleteFromArray = deleteFromArray;
