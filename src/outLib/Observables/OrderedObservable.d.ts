import { Observable, SubscribeObject } from "./Observable";
import { IListener, IOrdered, IOrderedSetup, IOrderedSubscriptionLike } from "./Types";
export declare class OrderedSubscribeObject<T> extends SubscribeObject<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, listener?: IListener<T>);
    get order(): number;
    set order(value: number);
    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T>;
}
export declare class OrderedObservable<T> extends Observable<T> implements IOrdered<T> {
    sortByOrder(): void;
    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T>;
    pipe(): IOrderedSetup<T>;
}
