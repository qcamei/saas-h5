import {IonicPageModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import { AppointDetailPage } from "./appointDetail.page";
import {ZmCompModule} from "../../../zmComp/zmComp.module";
import {ZmInputModule} from "../../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations: [
    AppointDetailPage,
  ],

  imports: [
    IonicPageModule.forChild(AppointDetailPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
  ]
})
export class AppointDetailPageModule {}
