export class MembershipCardDetailQueryForm {
    constructor(){}
    minTime:string = "0";
    maxTime:string =  "0";
    storeId:string;
    pageItemCount:number;
    pageNo:number;
    cardNameOrNumber:string;
    statusSet:Array<number> = new Array<number>();//CardStatusEnum
}
