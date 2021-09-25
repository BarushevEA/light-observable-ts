import { Observable, SubscribeObject } from "./Observable";
import { IListener, IOrderedObservable, IOrderedSubscriptionLike, ISetup } from "./Types";
export declare class OrderedSubscribeObject<T> extends SubscribeObject<T> {
    get order(): number;
    set order(value: number);
    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T>;
}
export declare class OrderedObservable<T> extends Observable<T> implements IOrderedObservable {
    sortByOrder(): void;
    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T>;
    pipe(): ISetup<T>;
}
