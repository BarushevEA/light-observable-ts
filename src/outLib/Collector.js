"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
class Collector {
    constructor() {
        this.list = [];
        this._isDestroyed = false;
    }
    collect(...subscriptionLikeList) {
        if (this._isDestroyed)
            return null;
        for (let i = 0; i < subscriptionLikeList.length; i++) {
            const subscription = subscriptionLikeList[i];
            subscription && this.list.push(subscription);
        }
    }
    unsubscribe(subscriptionLike) {
        if (this._isDestroyed)
            return null;
        subscriptionLike && subscriptionLike.unsubscribe();
        (0, FunctionLibs_1.deleteFromArray)(this.list, subscriptionLike);
    }
    unsubscribeAll() {
        if (this._isDestroyed)
            return null;
        const length = this.list.length;
        for (let i = 0; i < length; i++) {
            this.unsubscribe(this.list.pop());
        }
    }
    size() {
        if (this._isDestroyed)
            return 0;
        return this.list.length;
    }
    destroy() {
        this.unsubscribeAll();
        this.list.length = 0;
        this.list = 0;
        this._isDestroyed = true;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
}
exports.Collector = Collector;
