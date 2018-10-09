import {NgModule} from "@angular/core";
import {LeaguerAttributePage} from "./LeaguerAttribute.page";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmDatePipe} from "../../zmComp/pipe/ZmDatePipe";

@NgModule({
  declarations:[
    LeaguerAttributePage,
  ],
  imports:[
    IonicPageModule.forChild(LeaguerAttributePage),

    //公共module
    ZmCompModule,
    ZmBsCompModule,
  ],
  providers:[
    ZmDatePipe,
  ]
})
export class LeaguerAttributePageModule{}
