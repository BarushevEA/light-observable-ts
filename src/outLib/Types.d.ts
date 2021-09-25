import { Observable } from "./Observables/Observable";
import { ISubscriptionLike } from "./Observables/Types";
export declare type IDestroyed = {
    isDestroyed: boolean;
};
export declare type delay_ms = number;
export declare type delay_second = number;
export declare type cb_function = () => void;
export declare type ITickListener = {
    counter: number;
    delay: delay_ms;
    callback: cb_function;
    isDestroy: boolean;
};
export declare type ITick = {
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
