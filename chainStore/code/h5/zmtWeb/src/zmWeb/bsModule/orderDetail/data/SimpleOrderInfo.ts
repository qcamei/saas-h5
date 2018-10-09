export class SimpleOrderInfo {
    constructor(){}
    orderId:string;
    number:string;
    orderType:number;//OrderTypeEnum
    leaguerId:string;
    name:string;//会员姓名
    cost:number;// 应结金额
    realPay:number;
    status:number;//OrderStatusEnum
    entityState:number;
    createdTime:number;
    payTime:number;
    storeId:string;
    creatorId:string;
    buserName:string;//跟进人员
}
