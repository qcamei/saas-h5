import {ChargePayItem} from "../data/ChargePayItem";

export class ChargeAddForm {
    constructor(){}
    buserId:string;
    phone:string;
    name:string;
    chargeType:number;
    validPeriod:number;
    validPeriodUnit:number;
    offsetAmount:number;
    discountAmount:number;
    vipLevelId:number;
    vipLevelName:string;
    expiredTime:number;
    agencyArea:string;
    agencyName:string;
    agencyPhone:string;
    remark:string;
    origin:number;
    payItems:Array<ChargePayItem> = new Array<ChargePayItem>();
}
