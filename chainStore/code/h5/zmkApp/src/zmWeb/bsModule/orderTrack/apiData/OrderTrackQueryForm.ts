export class OrderTrackQueryForm {
    constructor(){}
    storeId:string;
    maxTime:number;
    minTime:number;
    status:Array<number>;
    orderIds:Array<string>;
}
