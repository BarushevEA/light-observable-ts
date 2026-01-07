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
        if (!this.observer ||
            (this.observer && this.observer.isDestroyed)) {
            this._order = undefined;
            return;
        }
        this._order = value;
        this.observer.sortByOrder();
    }
    subscribe(observer, errorHandler) {
        super.subscribe(observer, errorHandler);
        return this;
    }
    setOnce() {
        return super.setOnce();
    }
}
exports.OrderedSubscribeObject = OrderedSubscribeObject;
