import { SubscribeObject } from "./SubscribeObject";
import { IErrorCallback, IListener, IOrdered, IOrderedSetup, IOrderedSubscribe, IOrderedSubscriptionLike, ISetObservableValue } from "./Types";
import { OrderedObservable } from "./OrderedObservable";
export declare class OrderedSubscribeObject<T> extends SubscribeObject<T> implements IOrderedSetup<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, isPipe?: boolean);
    get order(): number;
    set order(value: number);
    subscribe(observer: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): IOrderedSubscriptionLike;
    once(): IOrderedSubscribe<T>;
}
