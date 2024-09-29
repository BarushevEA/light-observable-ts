"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
const SubscribeObject_1 = require("./SubscribeObject");
const FilterCollection_1 = require("./FilterCollection");
class Observable {
    value;
    subs = [];
    enabled = true;
    killed = false;
    process = false;
    trash = [];
    filters = new FilterCollection_1.FilterCollection();
    constructor(value) {
        this.value = value;
    }
    addFilter(errorHandler) {
        if (errorHandler)
            this.filters.addErrorHandler(errorHandler);
        return this.filters;
    }
    disable() {
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
    }
    get isEnable() {
        return this.enabled;
    }
    next(value) {
        if (this.killed)
            return;
        if (!this.enabled)
            return;
        if (!this.filters.isEmpty && !this.filters.processChain(value).isOK)
            return;
        this.process = true;
        this.value = value;
        for (let i = 0; i < this.subs.length; i++)
            this.subs[i].send(value);
        this.process = false;
        this.trash.length && this.clearTrash();
    }
    stream(values) {
        if (this.killed)
            return;
        if (!this.enabled)
            return;
        for (let i = 0; i < values.length; i++)
            this.next(values[i]);
    }
    clearTrash() {
        const length = this.trash.length;
        for (let i = 0; i < length; i++)
            this.unSubscribe(this.trash[i]);
        this.trash.length = 0;
    }
    unSubscribe(listener) {
        if (this.killed)
            return;
        if (this.process && listener) {
            this.trash.push(listener);
            return;
        }
        this.subs && !(0, FunctionLibs_1.quickDeleteFromArray)(this.subs, listener);
    }
    destroy() {
        if (this.killed)
            return;
        this.killed = true;
        if (!this.process) {
            this.value = null;
            this.subs.length = 0;
            return;
        }
        const timer = setInterval(() => {
            if (this.process)
                return;
            clearInterval(timer);
            this.value = null;
            this.subs.length = 0;
        }, 10);
    }
    unsubscribeAll() {
        if (this.killed)
            return;
        this.subs.length = 0;
    }
    getValue() {
        if (this.killed)
            return undefined;
        return this.value;
    }
    size() {
        if (this.killed)
            return 0;
        return this.subs.length;
    }
    subscribe(observer, errorHandler) {
        if (this.killed)
            return undefined;
        if (!this.isListener(observer))
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, false);
        this.addObserver(subscribeObject, observer, errorHandler);
        return subscribeObject;
    }
    addObserver(subscribeObject, observer, errorHandler) {
        subscribeObject.subscribe(observer, errorHandler);
        this.subs.push(subscribeObject);
    }
    isListener(listener) {
        if (this.killed)
            return false;
        return !!listener;
    }
    pipe() {
        if (this.killed)
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, true);
        this.subs.push(subscribeObject);
        return subscribeObject;
    }
    get isDestroyed() {
        return this.killed;
    }
}
exports.Observable = Observable;
