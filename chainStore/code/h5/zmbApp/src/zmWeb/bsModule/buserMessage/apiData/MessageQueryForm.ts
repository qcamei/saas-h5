
export class MessageQueryForm {
    constructor(){}
    minTime:any;
    maxTime:any;
    buserId:string;
    messageType:Array<number>;
    status:number; //已读 未读
    pageItemCount:number;
    pageNo:number;
}
