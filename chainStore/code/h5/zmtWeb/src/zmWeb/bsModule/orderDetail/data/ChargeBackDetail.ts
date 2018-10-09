import {PayItem} from "../../order/data/PayItem";
import {ChargeBackItem} from "../../orderNotes/data/ChargeBackItem";

export class ChargeBackDetail {
    constructor(){}
    id:number;
    number:string;// 退单流水号
    createTime:number;
    creatorId:number;
    creatorName:number;
    chargeBackItems:Array<ChargeBackItem>;
    payItems:Array<PayItem>;
    remark:string;
}
