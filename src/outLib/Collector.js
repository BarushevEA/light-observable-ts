"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
class Collector {
    arr = [];
    killed = false;
    collect(...subscriptionLikeList) {
        if (!this.killed)
            this.arr.push(...subscriptionLikeList);
    }
    unsubscribe(subscriptionLike) {
        if (this.killed)
            return;
        subscriptionLike?.unsubscribe();
        (0, FunctionLibs_1.quickDeleteFromArray)(this.arr, subscriptionLike);
    }
    unsubscribeAll() {
        if (this.killed)
            return;
        while (this.arr.length > 0)
            this.unsubscribe(this.arr.pop());
    }
    size() {
        if (this.killed)
            return 0;
        return this.arr.length;
    }
    destroy() {
        this.unsubscribeAll();
        this.arr.length = 0;
        this.arr = 0;
        this.killed = true;
    }
    get isDestroyed() {
        return this.killed;
    }
}
exports.Collector = Collector;
