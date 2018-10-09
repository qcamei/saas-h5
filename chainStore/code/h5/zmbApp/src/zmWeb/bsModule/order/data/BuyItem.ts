export class BuyItem {
    constructor(){}
    buyItemId:string;
    buyType:number;//BuyTypeEnum
    pgId:string;
    price:number;
    count:number;
    discount:number;
    cost:number;
    pay:number;
    restCount:number;
    pgName:string;
    prdCardId:string;
    buserIds:Array<number>;
    payName:string;
}
