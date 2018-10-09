import {NgModule} from "@angular/core";
import {AppointCancelReasonPage} from "./appointCancelReason.page";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations:[
    AppointCancelReasonPage,
  ],
  imports:[
    IonicPageModule.forChild(AppointCancelReasonPage),

    //公共module
    ZmCompModule,
    ZmBsCompModule,
  ]
})
export class AppointCancelReasonPageModule{}
