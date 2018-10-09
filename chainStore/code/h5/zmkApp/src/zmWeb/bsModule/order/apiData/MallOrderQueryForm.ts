export class MallOrderQueryForm {
    constructor(){}
    storeId:string;
    minTime:number;
    maxTime:number;
    numberOrName:string;
    status:Array<number> = new Array<number>();
    leaguerId:string;
    pageItemCount:number = 10;
    pageNo:number = 1;
}
