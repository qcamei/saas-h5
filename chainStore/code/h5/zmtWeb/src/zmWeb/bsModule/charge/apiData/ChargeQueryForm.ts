export class ChargeQueryForm {
    constructor(){}
    origin:number = -1;//来源 ChargeOriginEnum
    status:number = -1;//状态 ChargeStatusEnum
    chargeChannel:number = -1;
    minCreateTime:string;
    maxCreateTime:string;
    minMoney:number;
    maxMoney:number;
    buserId:string;
    phone:string;
    name:string;
    pageItemCount:number;
    pageNo:number;
}
