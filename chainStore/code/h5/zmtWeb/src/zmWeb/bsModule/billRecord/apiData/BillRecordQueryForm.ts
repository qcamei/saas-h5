export class BillRecordQueryForm {
    constructor(){}
    storeId:number;
    orderId:number;
    leaguerId:string;
    payType:Array<number>;
    billType:number;
    maxTime:number;
    minTime:number;
    pageItemCount:number;
    pageNo:number;
}
