import { IListener, ISubscribeGroup, ISubscribeObject } from "./Types";
export declare const sortAscending: (a: ISubscribeObject<any>, b: ISubscribeObject<any>) => 0 | 1 | -1;
export declare const sortDescending: (a: ISubscribeObject<any>, b: ISubscribeObject<any>) => 0 | 1 | -1;
export declare function deleteFromArray<T>(arr: T[], component: T): boolean;
export declare function quickDeleteFromArray<T>(arr: T[], component: T): boolean;
export declare function getListener<T>(listener: ISubscribeGroup<T>): IListener<T>;
