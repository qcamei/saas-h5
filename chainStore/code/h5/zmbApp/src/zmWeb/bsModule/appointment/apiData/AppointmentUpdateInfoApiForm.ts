import {AppointProduct} from "../data/AppointProduct";

export class AppointmentUpdateInfoApiForm {
leaguerId:string;
appointTime:number;
appointProducts:Array<AppointProduct>;
name:string;
sex:number;
phone:number;
age:number;
leaguerType:number;
beauticianId:number;
beauticianName:string;
productId:number;
referrer:string;
constructor(){}
}
