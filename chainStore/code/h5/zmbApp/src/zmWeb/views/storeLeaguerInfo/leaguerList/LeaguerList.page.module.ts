import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {LeaguerListPage} from "./LeaguerList.page";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmDatePipe} from "../../zmComp/pipe/ZmDatePipe";

@NgModule({
  declarations:[
    LeaguerListPage,

  ],
  imports:[
    IonicPageModule.forChild(LeaguerListPage),
    //公共module
    ZmCompModule,
    ZmBsCompModule,
  ],
  providers:[
    ZmDatePipe,
  ]
})
export class LeaguerListPageModule{}
