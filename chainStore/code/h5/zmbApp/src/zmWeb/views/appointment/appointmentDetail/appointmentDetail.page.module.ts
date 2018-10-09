import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {NgModule} from "@angular/core";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {AppointmentDetailPage} from "./appointmentDetail.page";

@NgModule({
  declarations: [
    AppointmentDetailPage,
  ],

  imports: [
    IonicPageModule.forChild(AppointmentDetailPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers: []


})
export class AppointmentDetailPageModule {
}
