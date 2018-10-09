import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {PaySuccessPage} from "./paySuccess.page";

@NgModule({
  declarations: [
    PaySuccessPage,
  ],

  imports: [
    IonicPageModule.forChild(PaySuccessPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],
  providers:[
  ]


})
export class PaySuccessPageModule {}
