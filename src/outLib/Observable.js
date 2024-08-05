"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
const SubscribeObject_1 = require("./SubscribeObject");
const FilterCollection_1 = require("./FilterCollection");
class Observable {
    value;
    listeners = [];
    isStop = true;
    isKilled = false;
    isProcess = false;
    trash = [];
    filters = new FilterCollection_1.FilterCollection();
    constructor(value) {
        this.value = value;
    }
    addFilter(errorHandler) {
        if (errorHandler) {
            this.filters.addErrorHandler(errorHandler);
        }
        return this.filters;
    }
    disable() {
        this.isStop = false;
    }
    enable() {
        this.isStop = true;
    }
    get isEnable() {
        return this.isStop;
    }
    next(value) {
        if (this.isKilled)
            return;
        if (!this.isStop)
            return;
        if (!this.filters.isEmpty) {
            if (!this.filters.processChain(value).isOK)
                return;
        }
        this.isProcess = true;
        this.value = value;
        for (let i = 0; i < this.listeners.length; i++)
            this.listeners[i].send(value);
        this.isProcess = false;
        this.trash.length && this.handleListenersForUnsubscribe();
    }
    stream(values) {
        if (this.isKilled)
            return;
        if (!this.isStop)
            return;
        for (let i = 0; i < values.length; i++)
            this.next(values[i]);
    }
    handleListenersForUnsubscribe() {
        const length = this.trash.length;
        for (let i = 0; i < length; i++)
            this.unSubscribe(this.trash[i]);
        this.trash.length = 0;
    }
    unSubscribe(listener) {
        if (this.isKilled)
            return;
        if (this.isProcess && listener) {
            this.trash.push(listener);
            return;
        }
        this.listeners && !(0, FunctionLibs_1.quickDeleteFromArray)(this.listeners, listener);
    }
    destroy() {
        this.value = null;
        this.unsubscribeAll();
        this.listeners = null;
        this.isKilled = true;
    }
    unsubscribeAll() {
        if (this.isKilled)
            return;
        this.listeners.length = 0;
    }
    getValue() {
        if (this.isKilled)
            return undefined;
        return this.value;
    }
    size() {
        if (this.isKilled)
            return 0;
        return this.listeners.length;
    }
    subscribe(observer, errorHandler) {
        if (!this.isListener(observer))
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, false);
        this.addObserver(subscribeObject, observer, errorHandler);
        return subscribeObject;
    }
    addObserver(subscribeObject, observer, errorHandler) {
        subscribeObject.subscribe(observer, errorHandler);
        this.listeners.push(subscribeObject);
    }
    isListener(listener) {
        if (this.isKilled)
            return false;
        return !!listener;
    }
    pipe() {
        if (this.isKilled)
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    get isDestroyed() {
        return this.isKilled;
    }
}
exports.Observable = Observable;
