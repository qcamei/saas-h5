import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {WaitForPayPage} from "./waitForPay.page";

@NgModule({
  declarations: [
    WaitForPayPage,
  ],

  imports: [
    IonicPageModule.forChild(WaitForPayPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],
  providers:[
  ]


})
export class WaitForPayPageModule {}
