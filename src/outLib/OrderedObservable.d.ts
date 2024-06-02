import { Observable } from "./Observable";
import { IErrorCallback, IListener, IOrdered, IOrderedSetup, IOrderedSubscriptionLike, ISetObservableValue, ISubscriptionLike } from "./Types";
export declare class OrderedObservable<T> extends Observable<T> implements IOrdered<T> {
    private sortDirection;
    setAscendingSort(): boolean;
    setDescendingSort(): boolean;
    sortByOrder(): boolean;
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): IOrderedSubscriptionLike | undefined;
    pipe(): IOrderedSetup<T> | undefined;
    unSubscribe(listener: ISubscriptionLike): void;
}
