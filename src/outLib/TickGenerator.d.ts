import { Observable } from "./Observables/Observable";
import { cb_function, delay_ms, delay_second, ITick, ITickListener } from "./Types";
import { ISubscriptionLike } from "./Observables/Types";
declare class TickGenerator implements ITick {
    private counter100;
    private counter1000;
    private isDestroyProcessed;
    private _isDestroyed;
    constructor();
    private init;
    executeSecondInterval(cb: cb_function, time: delay_second): ISubscriptionLike<any>;
    execute100MsInterval(cb: cb_function, time: delay_second): ISubscriptionLike<any>;
    private handleTimeOutListeners;
    private optimizeKeys;
    get isDestroyed(): boolean;
    get tick10$(): Observable<any>;
    get tick100$(): Observable<any>;
    get tick1000$(): Observable<any>;
    get secondFPS$(): Observable<any>;
    executeTimeout(cb: cb_function, time: delay_ms): ITickListener;
    clearTimeout(id: ITickListener): void;
    destroy(): void;
    private resetListeners;
}
export declare const tickGenerator: TickGenerator;
export {};
