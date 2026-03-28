import { ICallback, IErrorCallback, IFilter, IFilterCase, IFilterChainCallback, IFilterPayload, IFilterResponse, IFilterSetup, IFilterSwitch } from "./Types";
import { SwitchCase } from "./AbstractSwitchCase";
export declare class FilterCollection<T> implements IFilter<T>, IFilterSwitch<T> {
    chain: IFilterChainCallback[];
    flow: IFilterPayload;
    response: IFilterResponse;
    private errHandler;
    get isEmpty(): boolean;
    private push;
    and(condition: ICallback<any>): IFilterSetup<T>;
    allOf(conditions: ICallback<any>[]): IFilterSetup<T>;
    choice(): FilterSwitchCase<T>;
    processChain(value: T): IFilterResponse;
    addErrorHandler(errorHandler: IErrorCallback): void;
}
export declare class FilterSwitchCase<T> extends SwitchCase<T, FilterCollection<T>, IFilterCase<T>> {
}
