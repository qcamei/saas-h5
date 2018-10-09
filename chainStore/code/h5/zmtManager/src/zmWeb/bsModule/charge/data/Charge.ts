import {ChargePayItem} from "./ChargePayItem";

export class Charge {
    constructor(){}
    id:string;
    buserId:string;
    phone:string;
    name:string;
    chargeType:number; //ChargeTypeEnum

    vipLevelId:number;
    expiredTime:number;
    // chargeChannel:number;
    money:number; // 实付金额
    payItems:Array<ChargePayItem> = new Array<ChargePayItem>(); // 支付明细

    agencyArea:string;
    agencyName:string;
    agencyPhone:string;
    remark:string;
    entityState:number;
    origin:number;//来源 ChargeOriginEnum
    status:number;//状态 ChargeStatusEnum
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
