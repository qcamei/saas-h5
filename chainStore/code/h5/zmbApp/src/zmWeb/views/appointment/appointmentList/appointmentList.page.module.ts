import {NgModule} from "@angular/core";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {IonicPageModule} from "ionic-angular";
import {AppointmentListPage} from "./appointmentList.page";

@NgModule({
  declarations: [
    AppointmentListPage,
  ],

  imports: [
    IonicPageModule.forChild(AppointmentListPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
  ]


})
export class AppointmentListPageModule {}
