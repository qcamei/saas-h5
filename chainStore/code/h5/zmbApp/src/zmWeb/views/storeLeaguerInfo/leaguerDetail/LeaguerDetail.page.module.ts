import {NgModule} from "@angular/core";
import {LeaguerDetailPage} from "./LeaguerDetail.page";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations:[
    LeaguerDetailPage,
  ],
  imports:[
    IonicPageModule.forChild(LeaguerDetailPage),

    //公共module
    ZmCompModule,
    ZmBsCompModule,
  ]
})
export class LeaguerDetailPageModule{}
