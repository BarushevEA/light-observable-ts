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
        if (!this._isDestroyed) {
            this.list.push(...subscriptionLikeList);
        }
    }
    unsubscribe(subscriptionLike) {
        if (this._isDestroyed)
            return;
        subscriptionLike === null || subscriptionLike === void 0 ? void 0 : subscriptionLike.unsubscribe();
        (0, FunctionLibs_1.quickDeleteFromArray)(this.list, subscriptionLike);
    }
    unsubscribeAll() {
        if (this._isDestroyed)
            return;
        while (this.list.length > 0) {
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
