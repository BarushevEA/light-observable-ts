"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
class Collector {
    list = [];
    isKilled = false;
    collect(...subscriptionLikeList) {
        if (!this.isKilled)
            this.list.push(...subscriptionLikeList);
    }
    unsubscribe(subscriptionLike) {
        if (this.isKilled)
            return;
        subscriptionLike?.unsubscribe();
        (0, FunctionLibs_1.quickDeleteFromArray)(this.list, subscriptionLike);
    }
    unsubscribeAll() {
        if (this.isKilled)
            return;
        while (this.list.length > 0)
            this.unsubscribe(this.list.pop());
    }
    size() {
        if (this.isKilled)
            return 0;
        return this.list.length;
    }
    destroy() {
        this.unsubscribeAll();
        this.list.length = 0;
        this.list = 0;
        this.isKilled = true;
    }
    get isDestroyed() {
        return this.isKilled;
    }
}
exports.Collector = Collector;
