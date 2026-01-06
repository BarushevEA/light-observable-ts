import { ICollector, ISubscriptionLike } from "./Types";
export declare class Collector implements ICollector {
    protected arr: ISubscriptionLike[];
    private killed;
    collect(...subscriptionLikeList: ISubscriptionLike[]): void;
    unsubscribe(subscriptionLike: ISubscriptionLike | undefined): void;
    unsubscribeAll(): void | null;
    size(): number;
    destroy(): void;
    get isDestroyed(): boolean;
}
