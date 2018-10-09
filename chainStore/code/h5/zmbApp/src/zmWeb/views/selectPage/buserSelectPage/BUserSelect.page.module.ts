import {IonicPageModule} from "ionic-angular";

import {NgModule} from "@angular/core";
import {BUserSelectPage} from "./BUserSelect.page";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";

@NgModule({
  declarations: [
    BUserSelectPage
  ],

  imports: [
    IonicPageModule.forChild(BUserSelectPage),
    ZmBsCompModule,
    // ZmInputModule,
    ZmCompModule

  ],
  providers:[
  ]


})
export class BUserSelectPageModule {}
