"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
const SubscribeObject_1 = require("./SubscribeObject");
const Filter_1 = require("./Filter");
class Observable {
    value;
    listeners = [];
    _isEnable = true;
    _isDestroyed = false;
    isNextProcess = false;
    listenersForUnsubscribe = [];
    filterCase = new Filter_1.Filter();
    constructor(value) {
        this.value = value;
    }
    addFilter(errorHandler) {
        if (errorHandler) {
            this.filterCase.addErrorHandler(errorHandler);
        }
        return this.filterCase;
    }
    disable() {
        this._isEnable = false;
    }
    enable() {
        this._isEnable = true;
    }
    get isEnable() {
        return this._isEnable;
    }
    next(value) {
        if (this._isDestroyed)
            return;
        if (!this._isEnable)
            return;
        if (!this.filterCase.isEmpty) {
            if (!this.filterCase.processChain(value).isOK)
                return;
        }
        this.isNextProcess = true;
        this.value = value;
        for (let i = 0; i < this.listeners.length; i++)
            this.listeners[i].send(value);
        this.isNextProcess = false;
        this.listenersForUnsubscribe.length && this.handleListenersForUnsubscribe();
    }
    stream(values) {
        if (this._isDestroyed)
            return;
        if (!this._isEnable)
            return;
        for (let i = 0; i < values.length; i++)
            this.next(values[i]);
    }
    handleListenersForUnsubscribe() {
        const length = this.listenersForUnsubscribe.length;
        for (let i = 0; i < length; i++)
            this.unSubscribe(this.listenersForUnsubscribe[i]);
        this.listenersForUnsubscribe.length = 0;
    }
    unSubscribe(listener) {
        if (this._isDestroyed)
            return;
        if (this.isNextProcess && listener) {
            const marker = listener;
            !marker.isMarkedForUnsubscribe && this.listenersForUnsubscribe.push(listener);
            marker.isMarkedForUnsubscribe = true;
            return;
        }
        this.listeners && !(0, FunctionLibs_1.quickDeleteFromArray)(this.listeners, listener);
    }
    destroy() {
        this.value = null;
        this.unsubscribeAll();
        this.listeners = null;
        this._isDestroyed = true;
    }
    unsubscribeAll() {
        if (this._isDestroyed)
            return;
        this.listeners.length = 0;
    }
    getValue() {
        if (this._isDestroyed)
            return undefined;
        return this.value;
    }
    size() {
        if (this._isDestroyed)
            return 0;
        return this.listeners.length;
    }
    subscribe(observer, errorHandler) {
        if (!this.isSubsValid(observer))
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, false);
        this.addObserver(subscribeObject, observer, errorHandler);
        return subscribeObject;
    }
    addObserver(subscribeObject, observer, errorHandler) {
        subscribeObject.subscribe(observer, errorHandler);
        this.listeners.push(subscribeObject);
    }
    isSubsValid(listener) {
        if (this._isDestroyed)
            return false;
        return !!listener;
    }
    pipe() {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
}
exports.Observable = Observable;
