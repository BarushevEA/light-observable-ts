export declare type ICallback<T> = (value?: T) => any;
export declare type ISubscribe<T> = {
    subscribe(listener: IListener<T>): ISubscriptionLike<T>;
};
export declare type IListener<T> = ICallback<T>;
export declare type IDestroy = {
    destroy(): void;
    isDestroyed: boolean;
};
export declare type IOnceMarker = {
    isOnce: boolean;
    isFinished: boolean;
};
export declare type IOrder = {
    order: number;
};
export declare type IOnce<T> = {
    setOnce(): ISubscribe<T>;
};
export declare type IOrderedOnce<T> = {
    setOnce(): IOrderedSubscribe<T>;
};
export declare type ISetObservableValue = {
    next(value: any): void;
};
export declare type ISubscriptionLike<T> = {
    unsubscribe(): void;
};
export declare type ISetup<T> = IUnsubscribeByNegative<T> & IUnsubscribeByPositive<T> & IEmitByNegative<T> & IEmitByPositive<T> & IEmitMatchCondition<T> & IOnce<T> & ISubscribe<T>;
export declare type IOrderedSetup<T> = IOrderedUnsubscribeByNegative<T> & IOrderedUnsubscribeByPositive<T> & IOrderedEmitByNegative<T> & IOrderedEmitByPositive<T> & IOrderedEmitMatchCondition<T> & IOrderedOnce<T> & IOrderedSubscribe<T>;
export declare type ISubscribeObject<T> = ISubscriptionLike<T> & IPause & IOrder & ISend<T> & ISetup<T> & IPromise<T>;
export declare type ISubscribeCounter = {
    size(): number;
};
export declare type ISubscriber<T> = {
    getValue(): T;
    isEnable: boolean;
} & ISubscribe<T>;
export declare type IObserver<T> = ISetObservableValue & ISubscriber<T> & IDestroy & ISubscribeCounter & IObservablePipe<T> & {
    unSubscribe(ISubscriptionLike: any): void;
    unsubscribeAll(): void;
    disable(): void;
    enable(): void;
};
export declare type IPause = {
    pause(): void;
    resume(): void;
};
export declare type IObservablePipe<T> = {
    pipe(): ISetup<T>;
};
export declare type ISend<T> = {
    send(value: T): void;
};
export declare type IUnsubscribeByNegative<T> = {
    unsubscribeByNegative(condition: ICallback<any>): ISubscribe<T>;
};
export declare type IOrderedUnsubscribeByNegative<T> = {
    unsubscribeByNegative(condition: ICallback<any>): IOrderedSubscribe<T>;
};
export declare type IUnsubscribeByPositive<T> = {
    unsubscribeByPositive(condition: ICallback<any>): ISubscribe<T>;
};
export declare type IOrderedUnsubscribeByPositive<T> = {
    unsubscribeByPositive(condition: ICallback<any>): IOrderedSubscribe<T>;
};
export declare type IEmitByNegative<T> = {
    emitByNegative(condition: ICallback<any>): ISubscribe<T>;
};
export declare type IOrderedEmitByNegative<T> = {
    emitByNegative(condition: ICallback<any>): IOrderedSubscribe<T>;
};
export declare type IEmitByPositive<T> = {
    emitByPositive(condition: ICallback<any>): ISubscribe<T>;
};
export declare type IOrderedEmitByPositive<T> = {
    emitByPositive(condition: ICallback<any>): IOrderedSubscribe<T>;
};
export declare type IEmitMatchCondition<T> = {
    emitMatch(condition: ICallback<any>): ISubscribe<T>;
};
export declare type IOrderedEmitMatchCondition<T> = {
    emitMatch(condition: ICallback<any>): IOrderedSubscribe<T>;
};
export declare type ICollector = IDestroy & ISubscribeCounter & {
    collect(...subscriptionLikeList: ISubscriptionLike<any>[]): void;
    unsubscribe(subscriptionLike: ISubscriptionLike<any>): void;
    unsubscribeAll(): void;
};
export declare type IOrderedObservable = {
    sortByOrder(): void;
};
export declare type IOrdered<T> = IObserver<T> & IOrderedObservable;
export declare type IOrderedSubscriptionLike<T> = ISubscriptionLike<T> & IOrder;
export declare type IOrderedSubscribe<T> = {
    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T>;
};
export declare type IGroup = ICollector & {
    name: string;
    order: number;
};
export declare type IGroupManager = IDestroy & ISubscribeCounter & {
    unsubscribe(subscriptionLike: ISubscriptionLike<any>): void;
    unsubscribeGroup(name: string): any;
    unsubscribeAll(): void;
    addGroup(group: IGroup): any;
    getGroup(name: any): IGroup;
};
export declare type IGroupOptions = {
    name: string;
    subscribers?: IOrderedSubscriptionLike<any>[];
};
export declare type IPromise<T> = {
    likePromise(): ISetup<T>;
};
export declare type IOrderedPromise<T> = {
    likePromise(): IOrderedSetup<T>;
};
