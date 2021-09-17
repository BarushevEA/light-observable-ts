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
    execute100MsInterval(cb: cb_function, time: number): ISubscriptionLike<number>;
    executeSecondInterval(cb: cb_function, time: delay_second): ISubscriptionLike<number>;
    clearTimeout(id: ITickListener): void;
    destroy(): void;
} & IDestroyed;
