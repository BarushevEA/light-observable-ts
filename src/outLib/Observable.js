"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = exports.SubscribeObject = void 0;
var FunctionLibs_1 = require("./FunctionLibs");
var SubscribeObject = /** @class */ (function () {
    function SubscribeObject(observable, listener) {
        this.isListenPaused = false;
        this.once = { isOnce: false, isFinished: false };
        this.unsubscribeByNegativeCondition = null;
        this.unsubscribeByPositiveCondition = null;
        this.emitByNegativeCondition = null;
        this.emitByPositiveCondition = null;
        this.emitMatchCondition = null;
        this.isPipePromise = false;
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
        if (this.isPipePromise) {
            this.handlePromiseExecution(value)
                .catch(function (err) { return console.log("ERROR: isPipePromise = \"true\" SubscribeObject.send(" + value + ")", err); });
        }
        this.handleNoPromiseExecution(value);
    };
    SubscribeObject.prototype.handlePromiseExecution = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 16, , 17]);
                        _a = true;
                        switch (_a) {
                            case !this.observable: return [3 /*break*/, 1];
                            case !this.listener: return [3 /*break*/, 1];
                            case this.isListenPaused: return [3 /*break*/, 2];
                            case this.once.isOnce: return [3 /*break*/, 3];
                            case !!this.unsubscribeByNegativeCondition: return [3 /*break*/, 4];
                            case !!this.unsubscribeByPositiveCondition: return [3 /*break*/, 6];
                            case !!this.emitByNegativeCondition: return [3 /*break*/, 8];
                            case !!this.emitByPositiveCondition: return [3 /*break*/, 10];
                            case !!this.emitMatchCondition: return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 14];
                    case 1:
                        this.unsubscribe();
                        return [2 /*return*/];
                    case 2: return [2 /*return*/];
                    case 3:
                        this.once.isFinished = true;
                        this.listener(value);
                        this.unsubscribe();
                        return [3 /*break*/, 15];
                    case 4: return [4 /*yield*/, this.unsubscribeByNegativeCondition()];
                    case 5:
                        if (!(_b.sent())) {
                            this.unsubscribeByNegativeCondition = null;
                            this.unsubscribe();
                            return [2 /*return*/];
                        }
                        this.listener(value);
                        return [3 /*break*/, 15];
                    case 6: return [4 /*yield*/, (this.unsubscribeByPositiveCondition())];
                    case 7:
                        if (_b.sent()) {
                            this.unsubscribeByPositiveCondition = null;
                            this.unsubscribe();
                            return [2 /*return*/];
                        }
                        this.listener(value);
                        return [3 /*break*/, 15];
                    case 8: return [4 /*yield*/, this.emitByNegativeCondition()];
                    case 9:
                        !(_b.sent()) && this.listener(value);
                        return [3 /*break*/, 15];
                    case 10: return [4 /*yield*/, this.emitByPositiveCondition()];
                    case 11:
                        (_b.sent()) && this.listener(value);
                        return [3 /*break*/, 15];
                    case 12: return [4 /*yield*/, this.emitMatchCondition()];
                    case 13:
                        ((_b.sent()) === value) && this.listener(value);
                        return [3 /*break*/, 15];
                    case 14:
                        this.listener(value);
                        _b.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        err_1 = _b.sent();
                        console.log("ERROR: handlePromiseExecution, SubscribeObject.send(" + value + ")", err_1);
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    SubscribeObject.prototype.handleNoPromiseExecution = function (value) {
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
        if (typeof condition !== "function")
            condition = function () { return true; };
        this.unsubscribeByNegativeCondition = condition;
        return this;
    };
    SubscribeObject.prototype.unsubscribeByPositive = function (condition) {
        if (typeof condition !== "function")
            condition = function () { return false; };
        this.unsubscribeByPositiveCondition = condition;
        return this;
    };
    SubscribeObject.prototype.emitByNegative = function (condition) {
        if (typeof condition !== "function")
            condition = function () { return false; };
        this.emitByNegativeCondition = condition;
        return this;
    };
    SubscribeObject.prototype.emitByPositive = function (condition) {
        if (typeof condition !== "function")
            condition = function () { return true; };
        this.emitByPositiveCondition = condition;
        return this;
    };
    SubscribeObject.prototype.emitMatch = function (condition) {
        if (typeof condition !== "function")
            condition = function () { return true; };
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
    SubscribeObject.prototype.likePromise = function () {
        this.isPipePromise = true;
        return this;
    };
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