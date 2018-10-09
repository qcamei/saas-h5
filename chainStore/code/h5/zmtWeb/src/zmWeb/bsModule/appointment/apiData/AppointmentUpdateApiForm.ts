import {AppointmentUpdateInfoApiForm} from "./AppointmentUpdateInfoApiForm";
import {AppointmentUpdateStatusApiForm} from "./AppointmentUpdateStatusApiForm";
import {AppointmentDeleteForm} from "./AppointmentDeleteForm";

export class AppointmentUpdateApiForm {
storeId:string;
updateType:number;
updateInfoData:AppointmentUpdateInfoApiForm;
updateStatusData:AppointmentUpdateStatusApiForm;
appointmentDeleteForm:AppointmentDeleteForm;

constructor(){}
}
