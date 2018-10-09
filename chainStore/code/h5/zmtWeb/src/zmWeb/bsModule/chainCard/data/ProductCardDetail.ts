import {ProductCardItem} from "./ProductCardItem";
export class ProductCardDetail {
    constructor(){}
    id:string;
    chainId:number;
    number:string;
    name:string;
    typeId:string;
    status:number;
    entityState:number;
    sellPrice:number;
    imgPath:string;
    validPeriod:number;
    validPeriodUnit:number;
    sellFlag:number;
    applyStoreIds:Array<number>;
    descript:string;
    imgPaths:Array<string>;
    productCardItems:Array<ProductCardItem>;
    splitMark:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
