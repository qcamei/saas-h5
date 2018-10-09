import {IonicPageModule} from "ionic-angular";

import {NgModule} from "@angular/core";
import {OpenWFPage} from "./openWF.page";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";

@NgModule({
  declarations: [
    OpenWFPage
  ],

  imports: [
    IonicPageModule.forChild(OpenWFPage),
    ZmBsCompModule,
    // ZmInputModule,
    ZmCompModule

  ],
  providers:[
  ]


})
export class OpenWFPageModule {}
