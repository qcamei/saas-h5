import {Constants} from "../../../views/zmComUtils/Constants";
export class PackageProjectDetailQueryForm {
    constructor(){}
    minTime:string = Constants.DEFAULT_TIME_VALUE;
    maxTime:string = Constants.DEFAULT_TIME_VALUE;
    storeId:string;
    statusSet:Array<number> = new Array<number>();//PackageStateEnum
    nameOrNumber:string;
    typeId:string = Constants.DEFAULT_TYPE_VALUE;
    pageItemCount:number = Constants.DEFAULT_PAGEITEMCOUNT;
    pageNo:number = Constants.DEFAULT_PAGENO;
}
