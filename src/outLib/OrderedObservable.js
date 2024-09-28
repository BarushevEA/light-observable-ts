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
        if (this.killed)
            return false;
        this.subs.sort(this.sortDirection);
        return true;
    }
    subscribe(listener, errorHandler) {
        if (!this.isListener(listener))
            return undefined;
        const subscribeObject = new OrderedSubscribeObject_1.OrderedSubscribeObject(this, false);
        this.addObserver(subscribeObject, listener, errorHandler);
        return subscribeObject;
    }
    pipe() {
        if (this.killed)
            return undefined;
        const subscribeObject = new OrderedSubscribeObject_1.OrderedSubscribeObject(this, true);
        this.subs.push(subscribeObject);
        return subscribeObject;
    }
    unSubscribe(listener) {
        if (this.killed)
            return;
        if (this.process && listener) {
            this.trash.push(listener);
            return;
        }
        this.subs && !(0, FunctionLibs_1.deleteFromArray)(this.subs, listener);
    }
}
exports.OrderedObservable = OrderedObservable;
