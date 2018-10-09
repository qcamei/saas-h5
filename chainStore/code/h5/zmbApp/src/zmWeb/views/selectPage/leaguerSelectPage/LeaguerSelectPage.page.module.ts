import {IonicPageModule} from "ionic-angular";

import {NgModule} from "@angular/core";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {LeaguerSelectPage} from "./LeaguerSelectPage.page";

@NgModule({
  declarations: [
    LeaguerSelectPage
  ],

  imports: [
    IonicPageModule.forChild(LeaguerSelectPage),
    ZmBsCompModule,
    // ZmInputModule,
    ZmCompModule

  ],
  providers:[
  ]


})
export class LeaguerSelectPagePageModule {}
