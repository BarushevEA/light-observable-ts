import { IListener, ISubscribeGroup, ISubscribeObject } from "./Types";
export declare function sortAscending(a: ISubscribeObject<any>, b: ISubscribeObject<any>): number;
export declare function sortDescending(a: ISubscribeObject<any>, b: ISubscribeObject<any>): number;
export declare function deleteFromArray<T>(arr: T[], component: T): boolean;
export declare function quickDeleteFromArray<T>(arr: T[], component: T): boolean;
export declare function getListener<T>(listener: ISubscribeGroup<T>): IListener<T>;
