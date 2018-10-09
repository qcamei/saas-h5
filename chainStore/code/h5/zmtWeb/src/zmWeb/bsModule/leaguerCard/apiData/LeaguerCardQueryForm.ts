import {Constants} from "../../../views/common/Util/Constants";
export class LeaguerCardQueryForm {
    constructor(){}
    storeId:string;
    leaguerNameOrPhone:string;
    sort:number=0;
    loadType:number=0;
    cardTypeId:string = "";
    pageItemCount:number=Constants.DEFAULT_PAGEITEMCOUNT;
    pageNo:number=Constants.DEFAULT_PAGENO;
}
