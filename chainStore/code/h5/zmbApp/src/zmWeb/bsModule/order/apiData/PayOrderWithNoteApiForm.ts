import {PayItem} from "../data/PayItem";
export class PayOrderWithNoteApiForm {
    constructor(){}
    payItems:Array<PayItem>;
    remark:string;
}
