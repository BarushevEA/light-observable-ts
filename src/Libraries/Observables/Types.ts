export type ICallback<T> = (value?: T) => any;

export type ISubscribe<T> = {
    subscribe(listener: IListener<T>): ISubscriptionLike<T>;
};

export type IListener<T> = ICallback<T>;

export type IDestroy = {
    destroy(): void;
    isDestroyed: boolean;
};

export type IOnceMarker = {
    isOnce: boolean;
    isFinished: boolean;
};

export type IOrder = {
    order: number;
};

export type IOnce<T> = {
    setOnce(): ISubscribe<T>;
};

export type ISetObservableValue = {
    next(value: any): void;
};

export type ISubscriptionLike<T> = {
    unsubscribe(): void;
};

export type ISetup<T> =
    IUnsubscribeByNegative<T> &
    IUnsubscribeByPositive<T> &
    IEmitByNegative<T> &
    IEmitByPositive<T> &
    IEmitMatchCondition<T> &
    IOnce<T> &
    ISubscribe<T>;

export type IOrderedSetup<T> =
    IUnsubscribeByNegative<T> &
    IUnsubscribeByPositive<T> &
    IEmitByNegative<T> &
    IEmitByPositive<T> &
    IEmitMatchCondition<T> &
    IOnce<T> &
    IOrderedSubscriptionLike<T>;

export type ISubscribeObject<T> =
    ISubscriptionLike<T> &
    IPause &
    IOrder &
    ISend<T> &
    ISetup<T>;

export type ISubscribeCounter = {
    size(): number;
};

export type ISubscriber<T> =
    {
        getValue(): T,
        isEnable: boolean
    } &
    ISubscribe<T>;

export type IObserver<T> =
    ISetObservableValue &
    ISubscriber<T> &
    IDestroy &
    ISubscribeCounter &
    IObservablePipe<T> &
    {
        unSubscribe(ISubscriptionLike): void,
        unsubscribeAll(): void,
        disable(): void,
        enable(): void,
    };

export type IPause = {
    pause(): void;
    resume(): void;
};

export type IObservablePipe<T> = {
    pipe(): ISetup<T>
};

export type ISend<T> = {
    send(value: T): void;
};

export type IUnsubscribeByNegative<T> = {
    unsubscribeByNegative(condition: ICallback<any>): ISubscribe<T>;
};

export type IUnsubscribeByPositive<T> = {
    unsubscribeByPositive(condition: ICallback<any>): ISubscribe<T>;
};

export type IEmitByNegative<T> = {
    emitByNegative(condition: ICallback<any>): ISubscribe<T>;
};

export type IEmitByPositive<T> = {
    emitByPositive(condition: ICallback<any>): ISubscribe<T>;
};

export type IEmitMatchCondition<T> = {
    emitMatch(condition: ICallback<any>): ISubscribe<T>;
};

export type ICollector =
    IDestroy &
    ISubscribeCounter &
    {
        collect(...subscriptionLikeList: ISubscriptionLike<any>[]): void;
        unsubscribe(subscriptionLike: ISubscriptionLike<any>): void;
        unsubscribeAll(): void;
    };

export type IOrderedObservable = {
    sortByOrder(): void;
};

export type IOrdered<T> = IObserver<T> & IOrderedObservable;

export type IOrderedSubscriptionLike<T> = ISubscriptionLike<T> & IOrder;