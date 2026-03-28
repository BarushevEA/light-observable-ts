export type ICallback<T> = (value?: T) => any;
export type IErrorCallback = (errorData: any, errorMessage: any) => void;
export type IListener<T> = ICallback<T>;
export type IDestroy = {
    destroy(): void;
    isDestroyed: boolean;
};
export type IOrder = {
    order: number;
};
export type ISetObservableValue = {
    next(value: any): void;
};
export type IPause = {
    pause(): void;
    resume(): void;
};
export type ISubscribeCounter = {
    size(): number;
};
export type IStream<T> = {
    of(value: T[]): void;
};
export type ISend<T> = {
    send(value: T): void;
};
export type IChainContainer = {
    chain: any[];
};
export type IPipePayload = {
    isBreak: boolean;
    isUnsubscribe: boolean;
    isAvailable: boolean;
    debounceMs: number;
    debounceTimer: any;
    debounceValue: any;
    debounceIndex: number;
    payload: any;
};
export type IChainCallback = (data: IPipePayload) => void;
export type ICombinedSubscriber<T> = IListener<T> | ISetObservableValue;
export type ISubscribeGroup<T> = ICombinedSubscriber<T> | ICombinedSubscriber<T>[];
