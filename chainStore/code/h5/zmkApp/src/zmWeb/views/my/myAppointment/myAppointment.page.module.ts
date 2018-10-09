import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {MyAppointmentPage} from "./myAppointment.page";
import {MyAppointmentViewDataMgr} from "./myAppointmentViewDataMgr";

/**
 * 我的预约
 */
@NgModule({
  declarations: [
    MyAppointmentPage,
  ],

  imports: [
    IonicPageModule.forChild(MyAppointmentPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],
  providers:[
    MyAppointmentViewDataMgr
  ]


})
export class MyAppointmentPageModule {}
