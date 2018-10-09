import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {PayTypeSelectViewDataMgr} from "./payTypeSelectViewDataMgr";
import {PayTypeSelectPage} from "./payTypeSelect.page";

@NgModule({
  declarations: [
    PayTypeSelectPage,
  ],

  imports: [
    IonicPageModule.forChild(PayTypeSelectPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],
  providers:[
    PayTypeSelectViewDataMgr
  ]


})
export class PayTypeSelectPageModule {}
