import { ICallback, IErrorCallback, IFilter, IFilterChainCallback, IFilterPayload, IFilterResponse, IFilterSetup, IFilterSwitch } from "./Types";
import { SwitchCase } from "./AbstractSwitchCase";
export declare class FilterCollection<T> implements IFilter<T>, IFilterSwitch<T> {
    chain: IFilterChainCallback[];
    flow: IFilterPayload;
    response: IFilterResponse;
    private errHandler;
    get isEmpty(): boolean;
    private push;
    filter(condition: ICallback<any>): IFilterSetup<T>;
    pushFilters(conditions: ICallback<any>[]): IFilterSetup<T>;
    switch(): FilterSwitchCase<T>;
    processChain(value: T): IFilterResponse;
    addErrorHandler(errorHandler: IErrorCallback): void;
}
export declare class FilterSwitchCase<T> extends SwitchCase<T, FilterCollection<T>, IFilter<T>> {
}
