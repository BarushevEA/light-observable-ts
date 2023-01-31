"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedObservable = exports.OrderedSubscribeObject = void 0;
const Observable_1 = require("./Observable");
class OrderedSubscribeObject extends Observable_1.SubscribeObject {
    constructor(observable, listener) {
        super(observable, listener);
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
    subscribe(listener) {
        this.listener = listener;
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
            return undefined;
        this.listeners.sort((a, b) => {
            if (a.order > b.order)
                return 1;
            if (a.order < b.order)
                return -1;
            return 0;
        });
    }
    subscribe(listener) {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    pipe() {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new OrderedSubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
}
exports.OrderedObservable = OrderedObservable;
