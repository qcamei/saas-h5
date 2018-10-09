import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {PayQrcodeViewDataMgr} from "./payQrcodeViewDataMgr";
import {PayQrcodePage} from "./payQrcode.page";

@NgModule({
  declarations: [
    PayQrcodePage,
  ],

  imports: [
    IonicPageModule.forChild(PayQrcodePage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],
  providers:[
    PayQrcodeViewDataMgr
  ]


})
export class PayQrcodePageModule {}
