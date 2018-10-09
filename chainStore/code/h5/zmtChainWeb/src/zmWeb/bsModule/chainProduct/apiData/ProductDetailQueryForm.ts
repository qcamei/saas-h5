import {Constants} from "../../../views/common/Util/Constants";
export class ProductDetailQueryForm {
    constructor(){}
    minTime:number;
    maxTime:number;
    chainId:string;
    numberOrName:string;
    typeId:string = "-1";
    state: number = Constants.DEFAULT_STATE_VALUE;//ProductInfoState
    stateArray:Array<number> = new Array<number>();
    pageItemCount:number;
    pageNo:number;
}
