
export class BUserMessage {
    constructor(){}
    id:number;
    buserId:string;
    storeId:string;
    storeName:string;
    messageObjId:string;
    messageType:number;
    messageBody:string;
    status:number;  //已读 未读  MessageStatusEnum
    createdTime:any;
    lastUpdateTime:any;
    ver:number;

}
