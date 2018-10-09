import {PackageItem} from "./PackageItem";
export class PackageProjectDetail {
    constructor(){}
    id:string;
    chainId:number;
    number:string;
    name:string;
    typeId:string;
    state:number;
    entityState:number;
    sellPrice:number;
    cost:number;
    defaultImg:string;
    applyStoreIds:Array<number>;
    descript:string;
    imgPaths:Array<string>;
    packageItems:Array<PackageItem>;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
