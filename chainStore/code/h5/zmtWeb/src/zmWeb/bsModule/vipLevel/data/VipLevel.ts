import {VipContent} from "./VipContent";
export class VipLevel {
    constructor(){}
    id:number;
    number:string;
    name:string;
    type:number;
    validPeriod:number;
    validPeriodUnit:number;
    openCharge:number;
    renewCharge:number;
    state:number;
    vipContent:VipContent;
    imgPaths:Array<string>;
    defualtImg:string;
    entityState:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
