"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupManager = exports.Group = void 0;
var Collector_1 = require("./Collector");
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group(options) {
        var _this = _super.call(this) || this;
        _this._name = options.name;
        _this.init(options);
        return _this;
    }
    Group.prototype.init = function (options) {
        if (!options.subscribers)
            return;
        for (var _i = 0, _a = options.subscribers; _i < _a.length; _i++) {
            var subscriber = _a[_i];
            this.collect(subscriber);
        }
    };
    Object.defineProperty(Group.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (value) {
            for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
                var subscriber = _a[_i];
                subscriber.order = value;
            }
            this._order = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    return Group;
}(Collector_1.Collector));
exports.Group = Group;
var GroupManager = /** @class */ (function () {
    function GroupManager() {
    }
    Object.defineProperty(GroupManager.prototype, "isDestroyed", {
        get: function () {
            return this._isDestroyed;
        },
        enumerable: false,
        configurable: true
    });
    GroupManager.prototype.addGroup = function (group) {
    };
    GroupManager.prototype.getGroup = function (name) {
        return undefined;
    };
    GroupManager.prototype.unsubscribe = function (subscriptionLike) {
    };
    GroupManager.prototype.unsubscribeAll = function () {
    };
    GroupManager.prototype.unsubscribeGroup = function (name) {
    };
    GroupManager.prototype.size = function () {
        return 0;
    };
    GroupManager.prototype.destroy = function () {
    };
    return GroupManager;
}());
exports.GroupManager = GroupManager;
