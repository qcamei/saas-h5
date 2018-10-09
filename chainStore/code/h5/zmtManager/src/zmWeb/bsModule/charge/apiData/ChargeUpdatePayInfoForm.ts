import {ChargePayItem} from "../data/ChargePayItem";

export class ChargeUpdatePayInfoForm {
    constructor(){}
    id:number;
    status:number;
    payItems:Array<ChargePayItem>;
}
