"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = exports.SubscribeObject = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
class SubscribeObject {
    constructor(observable, listener) {
        this.isMarkedForUnsubscribe = false;
        this.isListenPaused = false;
        this.once = { isOnce: false, isFinished: false };
        this.unsubscribeByNegativeCondition = null;
        this.unsubscribeByPositiveCondition = null;
        this.emitByNegativeCondition = null;
        this.emitByPositiveCondition = null;
        this.emitMatchCondition = null;
        this._order = 0;
        this.observable = observable;
        this.listener = listener;
    }
    subscribe(listener) {
        this.listener = listener;
        return this;
    }
    unsubscribe() {
        if (!!this.observable) {
            this.observable.unSubscribe(this);
            this.observable = 0;
            this.listener = 0;
        }
    }
    send(value) {
        this.sendValueToListener(value);
    }
    sendValueToListener(value) {
        const asyncSend = (value) => {
            const listener = this.listener;
            return new Promise((resolve => {
                switch (true) {
                    case !this.observable:
                    case !listener:
                        this.unsubscribe();
                        return;
                    case this.isListenPaused:
                        return;
                    case this.once.isOnce:
                        this.once.isFinished = true;
                        listener && listener((value));
                        this.unsubscribe();
                        break;
                    case !!this.unsubscribeByNegativeCondition:
                        if (!this.unsubscribeByNegativeCondition()) {
                            this.unsubscribeByNegativeCondition = null;
                            this.unsubscribe();
                            return;
                        }
                        listener && listener((value));
                        break;
                    case !!this.unsubscribeByPositiveCondition:
                        if (this.unsubscribeByPositiveCondition()) {
                            this.unsubscribeByPositiveCondition = null;
                            this.unsubscribe();
                            return;
                        }
                        listener && listener((value));
                        break;
                    case !!this.emitByNegativeCondition:
                        !this.emitByNegativeCondition() && listener && listener(value);
                        break;
                    case !!this.emitByPositiveCondition:
                        this.emitByPositiveCondition() && listener && listener(value);
                        break;
                    case !!this.emitMatchCondition:
                        (this.emitMatchCondition() === value) && listener && listener(value);
                        break;
                    default:
                        listener && listener((value));
                }
                resolve(true);
            }));
        };
        asyncSend(value)
            .catch(err => {
            console.log('(Unit of SubscribeObject).send(value: T) call .sendValueToListener(value: T) ERROR:', err);
        });
    }
    setOnce() {
        this.once.isOnce = true;
        return this;
    }
    unsubscribeByNegative(condition) {
        if (typeof condition !== "function")
            condition = () => false;
        this.unsubscribeByNegativeCondition = condition;
        return this;
    }
    unsubscribeByPositive(condition) {
        if (typeof condition !== "function")
            condition = () => true;
        this.unsubscribeByPositiveCondition = condition;
        return this;
    }
    emitByNegative(condition) {
        if (typeof condition !== "function")
            condition = () => true;
        this.emitByNegativeCondition = condition;
        return this;
    }
    emitByPositive(condition) {
        if (typeof condition !== "function")
            condition = () => false;
        this.emitByPositiveCondition = condition;
        return this;
    }
    emitMatch(condition) {
        if (typeof condition !== "function")
            condition =
                () => `ERROR CONDITION TYPE ${typeof condition},  CONTROL STATE ${this.observable && !this.observable.getValue()}`;
        this.emitMatchCondition = condition;
        return this;
    }
    resume() {
        this.isListenPaused = false;
    }
    pause() {
        this.isListenPaused = true;
    }
    get order() {
        return this._order;
    }
    set order(value) {
        this._order = value;
    }
}
exports.SubscribeObject = SubscribeObject;
class Observable {
    constructor(value) {
        this.value = value;
        this.listeners = [];
        this._isEnable = true;
        this._isDestroyed = false;
        this.isNextProcess = false;
        this.listenersForUnsubscribe = [];
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
        this.value = value;
        this.isNextProcess = true;
        for (let i = 0; i < this.listeners.length; i++)
            this.listeners[i].send(value);
        this.isNextProcess = false;
        this.handleListenersForUnsubscribe();
    }
    handleListenersForUnsubscribe() {
        for (const listener of this.listenersForUnsubscribe) {
            this.unSubscribe(listener);
        }
        this.listenersForUnsubscribe.length = 0;
    }
    unSubscribe(listener) {
        if (this._isDestroyed)
            return;
        if (this.isNextProcess) {
            const marker = listener;
            !marker.isMarkedForUnsubscribe && this.listenersForUnsubscribe.push(listener);
            marker.isMarkedForUnsubscribe = true;
            return;
        }
        this.listeners &&
            !(0, FunctionLibs_1.deleteFromArray)(this.listeners, listener);
    }
    destroy() {
        this.value = 0;
        this.unsubscribeAll();
        this.listeners = 0;
        this._isDestroyed = true;
    }
    unsubscribeAll() {
        if (this._isDestroyed)
            return;
        const listeners = this.listeners;
        const length = listeners.length;
        for (let i = 0; i < length; i++) {
            const subscriber = listeners.pop();
            subscriber && subscriber.unsubscribe();
        }
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
    subscribe(listener) {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new SubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    pipe() {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new SubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
}
exports.Observable = Observable;
