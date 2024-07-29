import { ICallback, IChainContainer } from "./Types";
export declare abstract class SwitchCase<T, P extends IChainContainer, W> {
    protected pipe: P;
    protected counter: number;
    constructor(pipe: P);
    case(condition: ICallback<any>): W;
    pushCases(conditions: ICallback<any>[]): W;
}
