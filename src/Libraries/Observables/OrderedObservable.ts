import {Observable, SubscribeObject} from "./Observable";
import {IListener, IOrderedObservable, IOrderedSubscriptionLike, ISetup} from "./Types";

export class OrderedSubscribeObject<T> extends SubscribeObject<T> {
    get order(): number {
        return this._order;
    }

    set order(value: number) {
        if (!this.observable ||
            (this.observable && this.observable.isDestroyed)) {
            this._order = undefined;
            return
        }
        this._order = value;
        (<IOrderedObservable><any>this.observable).sortByOrder();
    }

    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T> {
        this.listener = listener;
        return this;
    }
}

export class OrderedObservable<T>
    extends Observable<T> implements IOrderedObservable {
    sortByOrder(): void {
        if (this._isDestroyed) return undefined;
        this.listeners.sort((a, b) => {
            if (a.order > b.order) return 1;
            if (a.order < b.order) return -1;
            return 0;
        });
    }

    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T> {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    pipe(): IOrderedSetup<T> {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new OrderedSubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
}
