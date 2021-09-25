import { ICollector, ISubscriptionLike } from "./Types";
export declare class Collector implements ICollector {
    private list;
    private _isDestroyed;
    collect(...subscriptionLikeList: ISubscriptionLike<any>[]): void;
    unsubscribe(subscriptionLike: ISubscriptionLike<any>): void;
    unsubscribeAll(): void;
    size(): number;
    destroy(): void;
    get isDestroyed(): boolean;
}
