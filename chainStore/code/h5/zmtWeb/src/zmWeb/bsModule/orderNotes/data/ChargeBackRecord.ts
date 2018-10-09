import {ChargeBackItem} from "./ChargeBackItem";
import {PayItem} from "../../order/data/PayItem";
export class ChargeBackRecord {
    constructor(){}
    id:number;
    number:string;
    createTime:number;
    creatorId:number;
    creatorName:number;
    chargeBackItems:Array<ChargeBackItem>;
    payItems:Array<PayItem>;
    remark:string;
}
