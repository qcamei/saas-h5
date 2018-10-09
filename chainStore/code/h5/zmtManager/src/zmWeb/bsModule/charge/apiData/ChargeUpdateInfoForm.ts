import {ChargePayItem} from "../data/ChargePayItem";

export class ChargeUpdateInfoForm {
    constructor(){}
    id:string;
    buserId:string;
    phone:string;
    name:string;
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
    payItems:Array<ChargePayItem> = new Array<ChargePayItem>();
}
