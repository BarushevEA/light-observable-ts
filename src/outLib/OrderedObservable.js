"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedObservable = void 0;
const Observable_1 = require("./Observable");
const FunctionLibs_1 = require("./FunctionLibs");
const OrderedSubscribeObject_1 = require("./OrderedSubscribeObject");
class OrderedObservable extends Observable_1.Observable {
    sortDirection = FunctionLibs_1.sortAscending;
    setAscendingSort() {
        this.sortDirection = FunctionLibs_1.sortAscending;
        return this.sortByOrder();
    }
    setDescendingSort() {
        this.sortDirection = FunctionLibs_1.sortDescending;
        return this.sortByOrder();
    }
    sortByOrder() {
        if (this._isDestroyed)
            return false;
        this.listeners.sort(this.sortDirection);
        return true;
    }
    subscribe(listener, errorHandler) {
        if (!this.isSubsValid(listener))
            return undefined;
        const subscribeObject = new OrderedSubscribeObject_1.OrderedSubscribeObject(this, false);
        this.addObserver(subscribeObject, listener, errorHandler);
        return subscribeObject;
    }
    pipe() {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new OrderedSubscribeObject_1.OrderedSubscribeObject(this, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    unSubscribe(listener) {
        if (this._isDestroyed)
            return;
        if (this.isNextProcess && listener) {
            const marker = listener;
            !marker.isMarkedForUnsubscribe && this.listenersForUnsubscribe.push(listener);
            marker.isMarkedForUnsubscribe = true;
            return;
        }
        this.listeners && !(0, FunctionLibs_1.deleteFromArray)(this.listeners, listener);
    }
}
exports.OrderedObservable = OrderedObservable;
