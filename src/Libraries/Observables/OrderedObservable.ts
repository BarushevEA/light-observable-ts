import {Observable, SubscribeObject} from "./Observable";
import {
    ICallback,
    IErrorCallback,
    IListener,
    IObserver,
    IOrdered,
    IOrderedObservable,
    IOrderedSetup,
    IOrderedSubscribe,
    IOrderedSubscriptionLike
} from "./Types";

export class OrderedSubscribeObject<T> extends SubscribeObject<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, isPipe?: boolean) {
        super(<IObserver<T>>observable, isPipe);
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        if (!this.observable ||
            (this.observable && this.observable.isDestroyed)) {
            this._order = <any>undefined;
            return
        }
        this._order = value;
        (<IOrderedObservable><any>this.observable).sortByOrder();
    }

    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike<T> {
        this.listener = listener;
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }

    setOnce(): IOrderedSubscribe<T> {
        return <any>super.setOnce();
    }

    unsubscribeByNegative(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.unsubscribeByNegative(condition);
    }

    unsubscribeByPositive(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.unsubscribeByPositive(condition);
    }

    emitByNegative(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.emitByNegative(condition);
    }

    emitByPositive(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.emitByPositive(condition);
    }

    emitMatch(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.emitMatch(condition);
    }
}

export class OrderedObservable<T>
    extends Observable<T> implements IOrdered<T> {
    sortByOrder(): boolean {
        if (this._isDestroyed) return false;
        this.listeners.sort((a, b) => {
            if (a.order > b.order) return 1;
            if (a.order < b.order) return -1;
            return 0;
        });
        return true
    }

    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike<T> | undefined {
        if (this._isDestroyed) return undefined;
        if (!listener) return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, false);
        subscribeObject.subscribe(listener, errorHandler);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    pipe(): IOrderedSetup<T> | undefined {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
}
