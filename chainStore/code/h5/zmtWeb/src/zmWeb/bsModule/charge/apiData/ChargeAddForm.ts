export class ChargeAddForm {
    constructor(){}
    buserId:string;
    phone:string;
    name:string;
    chargeType:number;// 类型 ChargeTypeEnum 续费、升级、普通
    validPeriod:number;// 等级时长 12月
    validPeriodUnit:number;// 单位 对应 ValidPeriodUnitEnum
    offsetAmount:number;// 抵扣金额
    discountAmount;// 优惠金额
    vipLevelId:number;// 会员等级id
    vipLevelName:string;// 会员等级名称
    expiredTime:number;
    chargeChannel:number;
    agencyArea:string;
    agencyName:string;
    agencyPhone:string;
    remark:string;
    origin:number;
}
