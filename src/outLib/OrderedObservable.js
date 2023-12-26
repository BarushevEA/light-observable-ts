"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedObservable = exports.OrderedSubscribeObject = void 0;
const Observable_1 = require("./Observable");
class OrderedSubscribeObject extends Observable_1.SubscribeObject {
    constructor(observable, isPipe) {
        super(observable, isPipe);
    }
    get order() {
        return this._order;
    }
    set order(value) {
        if (!this.observable ||
            (this.observable && this.observable.isDestroyed)) {
            this._order = undefined;
            return;
        }
        this._order = value;
        this.observable.sortByOrder();
    }
    subscribe(listener, errorHandler) {
        this.listener = listener;
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }
    setOnce() {
        return super.setOnce();
    }
    unsubscribeByNegative(condition) {
        return super.unsubscribeByNegative(condition);
    }
    unsubscribeByPositive(condition) {
        return super.unsubscribeByPositive(condition);
    }
    emitByNegative(condition) {
        return super.emitByNegative(condition);
    }
    emitByPositive(condition) {
        return super.emitByPositive(condition);
    }
    emitMatch(condition) {
        return super.emitMatch(condition);
    }
}
exports.OrderedSubscribeObject = OrderedSubscribeObject;
class OrderedObservable extends Observable_1.Observable {
    sortByOrder() {
        if (this._isDestroyed)
            return false;
        this.listeners.sort((a, b) => {
            if (a.order > b.order)
                return 1;
            if (a.order < b.order)
                return -1;
            return 0;
        });
        return true;
    }
    subscribe(listener, errorHandler) {
        if (this._isDestroyed)
            return undefined;
        if (!listener)
            return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, false);
        subscribeObject.subscribe(listener, errorHandler);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    pipe() {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
}
exports.OrderedObservable = OrderedObservable;
