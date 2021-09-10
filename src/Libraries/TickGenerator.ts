import {Observable} from "./Observables/Observable";
import {cb_function, delay_ms, delay_second, ITick, ITickListener} from "./Types";
import {ISubscriptionLike} from "./Observables/Types";

let listeners: ITickListener[] = [];
const tickDelay = 10;
let tickIndex = <any>0,
    secondFPSIndex = <any>0,
    optimizeCounter = 0,
    optimizeNumber = 1000,
    tick10$ = new Observable(<any>0),
    tick100$ = new Observable(<any>0),
    secondFPS$ = new Observable(<any>0),
    tick1000$ = new Observable(<any>0);

class TickGenerator implements ITick {
    private counter100 = 0;
    private counter1000 = 0;
    private isDestroyProcessed = false;
    private _isDestroyed = false;

    constructor() {
        this.init();
    }

    private init(): void {
        if (!secondFPSIndex) {
            secondFPSIndex = setInterval(() => secondFPS$.next(-1), 1000);
        }
        if (!tickIndex) {
            tickIndex = setInterval(() => {
                this.counter100 += 10;
                if (this.counter100 >= 100) this.counter100 = 0;

                this.counter1000 += 10;
                if (this.counter1000 >= 1000) this.counter1000 = 0;

                tick10$.next(10);
                if (!this.counter100) tick100$.next(100);
                if (!this.counter1000) tick1000$.next(1000);

                this.handleTimeOutListeners();
            }, tickDelay);
        }
    }

    executeSecondInterval(cb: cb_function, time: delay_second): ISubscriptionLike {
        const number = time;
        return tick1000$.subscribe(() => {
            if (time > 0) time--;

            if (!time) {
                cb();
                time = number;
            }
        });
    }

    execute100MsInterval(cb: cb_function, time: delay_second): ISubscriptionLike {
        const number = time;
        return tick100$.subscribe(() => {
            if (time > 0) time--;

            if (!time) {
                cb();
                time = number;
            }
        });
    }

    private handleTimeOutListeners(): void {
        let isNeedToOptimize = false;
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            if (!listener) {
                continue;
            }
            if (listener.isDestroy) {
                listeners[i] = <any>0;
                isNeedToOptimize = true;
            } else {
                if (listener.counter >= listener.delay) {
                    listener.callback();
                    listeners[i] = <any>0;
                    isNeedToOptimize = true;
                } else {
                    listener.counter += tickDelay;
                }
            }
        }
        this.optimizeKeys(isNeedToOptimize);
    }

    private optimizeKeys(isNeedToOptimize: boolean): void {
        if (!isNeedToOptimize) return;

        optimizeCounter++;
        if (optimizeCounter < optimizeNumber) return;

        optimizeCounter = 0;
        const tmpListeners: ITickListener[] = [];

        const length = listeners.length;
        for (let i = 0; i < length; i++) if (listeners[i]) tmpListeners.push(listeners[i]);

        listeners.length = 0;
        listeners = tmpListeners;
        tmpListeners.length = 0;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get tick10$(): Observable<any> {
        return tick10$;
    }

    get tick100$(): Observable<any> {
        return tick100$;
    }

    get tick1000$(): Observable<any> {
        return tick1000$;
    }

    get secondFPS$(): Observable<any> {
        return secondFPS$;
    }

    executeTimeout(cb: cb_function, time: delay_ms): ITickListener {
        const listener: ITickListener = {
            counter: 0,
            delay: time,
            callback: cb,
            isDestroy: false
        };
        listeners.push(listener);
        return listener;
    }

    clearTimeout(id: ITickListener): void {
        if (!id) return;

        id.isDestroy = true;
        id.callback = () => console.log('listener has been destroyed');
    }

    destroy(): void {
        if (this.isDestroyProcessed) return;
        this.isDestroyProcessed = true;

        this.counter100 = 0;
        this.counter1000 = 0;
        clearInterval(tickIndex);
        clearInterval(secondFPSIndex);
        tickIndex = <any>0;
        secondFPSIndex = <any>0;

        this.resetListeners(tick10$);
        this.resetListeners(tick100$);
        this.resetListeners(tick1000$);
        this.resetListeners(secondFPS$);

        tick10$ = <any>0;
        tick100$ = <any>0;
        tick1000$ = <any>0;
        secondFPS$ = <any>0;

        this._isDestroyed = true;
    }

    private resetListeners(observable: Observable<any>): void {
        if (observable) observable.unsubscribeAll();
    }
}

export const tickGenerator = new TickGenerator();
