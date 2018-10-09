import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmTimeSlot} from "./ZmTimeSlot";
import {ZmCompModule} from "../../../zmComp.module";
import {ZmInputModule} from "../../zmInput.module";
import {ZmBsCompModule} from "../../../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations: [
    ZmTimeSlot,
  ],

  imports: [
    IonicPageModule.forChild(ZmTimeSlot),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
  ]


})
export class AppointmentPageModule {}
