"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = exports.SubscribeObject = void 0;
var FunctionLibs_1 = require("../FunctionLibs");
var SubscribeObject = /** @class */ (function () {
    function SubscribeObject(observable, listener) {
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
    SubscribeObject.prototype.subscribe = function (listener) {
        this.listener = listener;
        return this;
    };
    SubscribeObject.prototype.unsubscribe = function () {
        if (!!this.observable) {
            this.observable.unSubscribe(this);
            this.observable = 0;
            this.listener = 0;
        }
    };
    SubscribeObject.prototype.send = function (value) {
        switch (true) {
            case !this.observable:
            case !this.listener:
                this.unsubscribe();
                return;
            case this.isListenPaused:
                return;
            case this.once.isOnce:
                this.once.isFinished = true;
                this.listener(value);
                this.unsubscribe();
                break;
            case !!this.unsubscribeByNegativeCondition:
                if (!this.unsubscribeByNegativeCondition()) {
                    this.unsubscribeByNegativeCondition = null;
                    this.unsubscribe();
                    return;
                }
                this.listener(value);
                break;
            case !!this.unsubscribeByPositiveCondition:
                if (this.unsubscribeByPositiveCondition()) {
                    this.unsubscribeByPositiveCondition = null;
                    this.unsubscribe();
                    return;
                }
                this.listener(value);
                break;
            case !!this.emitByNegativeCondition:
                !this.emitByNegativeCondition() && this.listener(value);
                break;
            case !!this.emitByPositiveCondition:
                this.emitByPositiveCondition() && this.listener(value);
                break;
            case !!this.emitMatchCondition:
                (this.emitMatchCondition() === value) && this.listener(value);
                break;
            default:
                this.listener(value);
        }
    };
    SubscribeObject.prototype.setOnce = function () {
        this.once.isOnce = true;
        return this;
    };
    SubscribeObject.prototype.unsubscribeByNegative = function (condition) {
        this.unsubscribeByNegativeCondition = condition;
        return this;
    };
    SubscribeObject.prototype.unsubscribeByPositive = function (condition) {
        this.unsubscribeByPositiveCondition = condition;
        return this;
    };
    SubscribeObject.prototype.emitByNegative = function (condition) {
        this.emitByNegativeCondition = condition;
        return this;
    };
    SubscribeObject.prototype.emitByPositive = function (condition) {
        this.emitByPositiveCondition = condition;
        return this;
    };
    SubscribeObject.prototype.emitMatch = function (condition) {
        this.emitMatchCondition = condition;
        return this;
    };
    SubscribeObject.prototype.resume = function () {
        this.isListenPaused = false;
    };
    SubscribeObject.prototype.pause = function () {
        this.isListenPaused = true;
    };
    Object.defineProperty(SubscribeObject.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (value) {
            this._order = value;
        },
        enumerable: false,
        configurable: true
    });
    return SubscribeObject;
}());
exports.SubscribeObject = SubscribeObject;
var Observable = /** @class */ (function () {
    function Observable(value) {
        this.value = value;
        this.listeners = [];
        this._isEnable = true;
        this._isDestroyed = false;
        this.isNextProcess = false;
        this.listenersForUnsubscribe = [];
    }
    Observable.prototype.disable = function () {
        this._isEnable = false;
    };
    Observable.prototype.enable = function () {
        this._isEnable = true;
    };
    Object.defineProperty(Observable.prototype, "isEnable", {
        get: function () {
            return this._isEnable;
        },
        enumerable: false,
        configurable: true
    });
    Observable.prototype.next = function (value) {
        if (this._isDestroyed)
            return;
        if (!this._isEnable)
            return;
        this.value = value;
        this.isNextProcess = true;
        for (var i = 0; i < this.listeners.length; i++)
            this.listeners[i].send(value);
        this.isNextProcess = false;
        this.handleListenersForUnsubscribe();
    };
    Observable.prototype.handleListenersForUnsubscribe = function () {
        for (var _i = 0, _a = this.listenersForUnsubscribe; _i < _a.length; _i++) {
            var listener = _a[_i];
            this.unSubscribe(listener);
        }
        this.listenersForUnsubscribe.length = 0;
    };
    Observable.prototype.unSubscribe = function (listener) {
        if (this._isDestroyed)
            return;
        if (this.isNextProcess) {
            this.listenersForUnsubscribe.push(listener);
            return;
        }
        this.listeners &&
            !(0, FunctionLibs_1.deleteFromArray)(this.listeners, listener);
    };
    Observable.prototype.destroy = function () {
        this.value = 0;
        this.unsubscribeAll();
        this.listeners = 0;
        this._isDestroyed = true;
    };
    Observable.prototype.unsubscribeAll = function () {
        if (this._isDestroyed)
            return;
        var length = this.listeners.length;
        for (var i = 0; i < length; i++)
            (this.listeners.pop()).unsubscribe();
    };
    Observable.prototype.getValue = function () {
        if (this._isDestroyed)
            return undefined;
        return this.value;
    };
    Observable.prototype.size = function () {
        if (this._isDestroyed)
            return 0;
        return this.listeners.length;
    };
    Observable.prototype.subscribe = function (listener) {
        if (this._isDestroyed)
            return undefined;
        var subscribeObject = new SubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    };
    Observable.prototype.pipe = function () {
        if (this._isDestroyed)
            return undefined;
        var subscribeObject = new SubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    };
    Object.defineProperty(Observable.prototype, "isDestroyed", {
        get: function () {
            return this._isDestroyed;
        },
        enumerable: false,
        configurable: true
    });
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map