/**
 * Created by Administrator on 2017/12/11 0011.
 */
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AppointmentListPage} from "./appointmentList/appointmentList";
import {AppointmentDetailsPage} from "./appointmentDetails/appointmentDetails";
import {AddAppointmentPage} from "./addAppointment/addAppointment";
import {AppointmentListResolve} from "../../comModule/guard/listResolve/AppointmentListResolve";


const mRoutes: Routes = [
  {
    path: "appointmentList",
    component: AppointmentListPage
  },
  {
    path: "appointmentDetails/:apptId",
    component: AppointmentDetailsPage
  },
  {
    path: "addAppointment/:leaguerId",
    component: AddAppointmentPage
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(mRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class AppointmentRoutingModule {
}
