export class ChargeBackItem {
    constructor(){}
    itemId:string;
    buyType:number;//BuyTypeEnum
    pgId:string;
    pgName:string;
    cost:number;// 退单金额
    count:number;
}
