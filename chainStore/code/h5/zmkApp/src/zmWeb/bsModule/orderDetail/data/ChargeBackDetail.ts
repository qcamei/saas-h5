import {PayItem} from "../../order/data/PayItem";
import {ChargeBackItemDetail} from "./ChargeBackItemDetail";
export class ChargeBackDetail {
    constructor(){}
    id:number;
    number:string;
    createTime:number;
    creatorId:number;
    creatorName:string;
    chargeBackItems:Array<ChargeBackItemDetail>;
    payItems:Array<PayItem>;
    remark:string;
}
