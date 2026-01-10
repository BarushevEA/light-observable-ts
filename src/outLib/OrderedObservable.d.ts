import { Observable } from "./Observable";
import { IErrorCallback, IOrdered, IOrderedSetup, IOrderedSubscriptionLike, ISubscribeGroup, ISubscriptionLike } from "./Types";
export declare class OrderedObservable<T> extends Observable<T> implements IOrdered<T> {
    private sortDirection;
    setAscendingSort(): boolean;
    setDescendingSort(): boolean;
    sortByOrder(): boolean;
    subscribe(listener: ISubscribeGroup<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike | undefined;
    pipe(): IOrderedSetup<T>;
    unSubscribe(listener: ISubscriptionLike): void;
}
