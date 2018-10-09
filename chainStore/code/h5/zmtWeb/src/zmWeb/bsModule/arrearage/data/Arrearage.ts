import {PaymentHistory} from "./PaymentHistory";
export class Arrearage {
id:string;
storeId:string;
leaguerId:string;
leaguerName:string;
leaguerPhone:string;
orderId:number;
orderNumber:string;
status:number;
balanceDue:number;
balanceTotal:number;
paymentHistories:Array<PaymentHistory>;
creatorId:number;
creatorName:string;
createdTime:number;
lastUpdateTime:number;
ver:number;
constructor(){}
}
