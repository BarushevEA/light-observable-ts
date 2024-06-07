import { ICollector, ISubscriptionLike } from "./Types";
export declare class Collector implements ICollector {
    protected list: ISubscriptionLike[];
    private _isDestroyed;
    collect(...subscriptionLikeList: ISubscriptionLike[]): void;
    unsubscribe(subscriptionLike: ISubscriptionLike | undefined): void;
    unsubscribeAll(): void | null;
    size(): number;
    destroy(): void;
    get isDestroyed(): boolean;
}
