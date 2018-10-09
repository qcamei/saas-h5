import {OrderAddApiForm} from "./OrderAddApiForm";
import {BonusInfoAddForm} from "../../workFlow/apiData/BonusInfoAddForm";
import {PayItem} from "../data/PayItem";

export class OrderItemAddForm {
orderAddApiForm:OrderAddApiForm;
bonusInfoAddForms:Array<BonusInfoAddForm>;
payItems:Array<PayItem>;
constructor(){}
}
