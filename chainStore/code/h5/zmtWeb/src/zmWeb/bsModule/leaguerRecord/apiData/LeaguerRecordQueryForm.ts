export class LeaguerRecordQueryForm {
    constructor(){}
    storeId:string;
    minTime:string = "0";
    maxTime:string = "0";
    leaguerId:string;
    workFlowDataId:string;
    pageItemCount:number = 10;
    pageNo:number = 1;
}
