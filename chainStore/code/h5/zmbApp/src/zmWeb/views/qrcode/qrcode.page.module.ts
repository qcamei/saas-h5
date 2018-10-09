import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";

import {QrcodePage} from "./qrcode.page";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {ZmInputModule} from "../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../zmBSComp/zmBSComp.module";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  declarations:[
    QrcodePage
  ],
  imports:[
    IonicPageModule.forChild(QrcodePage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    FlexLayoutModule,
  ],
  providers:[
  ],
  exports:[
  ],
  entryComponents: [

  ]
})

export class QrcodePageModule{}
