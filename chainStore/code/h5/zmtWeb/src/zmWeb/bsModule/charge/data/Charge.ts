import {ChargePayItem} from "./ChargePayItem";
export class Charge {
    constructor(){}
    id:string;
    buserId:string;
    phone:string;
    name:string;
    chargeType:number;// 类型 ChargeTypeEnum 续费、升级、普通
    number:string;// 编号
    validPeriod:number;// 等级时长 12月
    validPeriodUnit:number;// 单位 对应 ValidPeriodUnitEnum
    offsetAmount:number;// 抵扣金额
    discountAmount;// 优惠金额
    vipAmount:number;//等级费用
    vipLevelId:string;// 会员等级id
    vipLevelName:string;// 会员等级名称
    expiredTime:number;// 到期时间
    agencyArea:string;
    agencyName:string;
    agencyPhone:string;
    remark:string;
    entityState:number;
    origin:number;//来源 ChargeOriginEnum
    status:number;//状态 ChargeStatusEnum
    money:number;// 实付金额
    payItems:Array<ChargePayItem>;// 支付明细
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
