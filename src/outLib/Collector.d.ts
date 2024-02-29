import { ICollector, ISubscriptionLike } from "./Types";
export declare class Collector implements ICollector {
    protected list: ISubscriptionLike<any>[];
    private _isDestroyed;
    collect(...subscriptionLikeList: ISubscriptionLike<any>[]): void;
    unsubscribe(subscriptionLike: ISubscriptionLike<any> | undefined): void;
    unsubscribeAll(): void | null;
    size(): number;
    destroy(): void;
    get isDestroyed(): boolean;
}
