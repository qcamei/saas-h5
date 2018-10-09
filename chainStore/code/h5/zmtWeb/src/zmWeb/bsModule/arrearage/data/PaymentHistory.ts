import {PayItem} from "../../order/data/PayItem";
export class PaymentHistory {
creatorId:number;
creatorName:string;
createdTime:number;
payItems:Array<PayItem>;
constructor(){}
}
