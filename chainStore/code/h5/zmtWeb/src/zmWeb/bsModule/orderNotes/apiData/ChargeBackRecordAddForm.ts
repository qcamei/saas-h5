import {ChargeBackItem} from "../data/ChargeBackItem";
import {PayItem} from "../../order/data/PayItem";
export class ChargeBackRecordAddForm {
    constructor(){}
    chargeBackItems:Array<ChargeBackItem>;
    payItems:Array<PayItem>;
    remark:string;
}
