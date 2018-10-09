import {AppointProduct} from "./AppointProduct";
import {CancelReason} from "./CancelReason";

export class Appointment{

id:string;

storeId:number;

leaguerId:string;

name:string;//会员名

phone:string;//会员电话

cuserId:number;

appointTime:number;

status:number;//AppointmentStatusEnum

origin:number;//OriginTypeEnum

appointProducts:Array<AppointProduct>;

entityState:number;

cancelReason:CancelReason;

creatorId:string;

creatorName:string;

createdTime:string;

lastUpdateTime:string;

ver:number;

constructor(){}
}
