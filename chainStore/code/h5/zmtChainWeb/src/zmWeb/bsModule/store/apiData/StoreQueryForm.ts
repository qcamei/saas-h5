import {Constants} from "../../../views/common/Util/Constants";
export class StoreQueryForm {
    constructor(){}
    chainId:string;
    name:string;
    pageItemCount:number = Constants.DEFAULT_PAGEITEMCOUNT;
    pageNo:number = Constants.DEFAULT_PAGENO;
    storeIds:string;

}
