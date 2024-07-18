"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedSubscribeObject = void 0;
const SubscribeObject_1 = require("./SubscribeObject");
class OrderedSubscribeObject extends SubscribeObject_1.SubscribeObject {
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
    subscribe(observer, errorHandler) {
        super.subscribe(observer, errorHandler);
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
