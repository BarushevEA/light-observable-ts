export type ICallback = (value?: any) => void;

export type ISubscribe = {
    subscribe(listener: IListener): ISubscriptionLike;
};

export type IListener = ICallback | IOrderedListener;

export type IDestroy = {
    destroy(): void;
};

export type ISetObservableValue = {
    next(value: any): void;
};

export type IListeners = IListener[]

export type ISubscriptionLike = {
    unsubscribe(): void;
};

export type ISubscribeCounter = {
    getNumberOfSubscribers(): number;
};

export type ISubscriber<T> =
    {
        getValue(): T,
        isEnable: boolean
    } &
    ISubscribe;

export type IObserver<T> =
    ISetObservableValue &
    ISubscriber<T> &
    IDestroy &
    ISubscribeCounter &
    {
        unsubscribeAll(): void,
        disable(): void,
        enable(): void,
    };

export type IOrderedListener = {
    callBack: ICallback;
    order?: number;
    isEventStop?: boolean;
    isEventPause?: boolean;
};

export type IEventPause = {
    pauseEnable(): void;
    pauseDisable(): void;
};

export type IEventStop = {
    eventStop(): void;
    eventRun(): void;
};

export type IExtendedSubscription = ISubscriptionLike & IEventPause;