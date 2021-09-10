import {Observable} from "./Observables/Observable";
import {ISubscriptionLike} from "./Observables/Types";

export type IDestroyed = {
    isDestroyed: boolean;
};

export type delay_ms = number;
export type delay_second = number;
export type cb_function = () => void;
export type ITickListener = {
    counter: number;
    delay: delay_ms;
    callback: cb_function;
    isDestroy: boolean;
};
export type ITick = {
    tick10$: Observable<any>;
    tick100$: Observable<any>;
    tick1000$: Observable<any>;
    secondFPS$: Observable<any>;
    executeTimeout(cb: cb_function, time: delay_ms): ITickListener;
    execute100MsInterval(cb: cb_function, time: number): ISubscriptionLike;
    executeSecondInterval(cb: cb_function, time: delay_second): ISubscriptionLike;
    clearTimeout(id: ITickListener): void;
    destroy(): void;
} & IDestroyed;
export type ICollector = {
    collect(...subscribers: ISubscriptionLike[]): void;
    unsubscribe(subscriber: ISubscriptionLike): void;
    clear(): void;
    destroy(): void;
    pauseEnable(): void;
    pauseDisable(): void;
    isEmpty: boolean;
};
