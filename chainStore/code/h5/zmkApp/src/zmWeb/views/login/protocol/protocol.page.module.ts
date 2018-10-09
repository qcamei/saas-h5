import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {ProtocolPage} from "./protocol.page";

@NgModule({
  declarations: [
    ProtocolPage,
  ],

  imports: [
    IonicPageModule.forChild(ProtocolPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],
  providers:[
  ]


})
export class ProtocolPageModule {}
