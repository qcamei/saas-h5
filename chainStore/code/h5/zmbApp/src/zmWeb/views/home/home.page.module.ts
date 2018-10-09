import {IonicPageModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import {HomePage} from "./home.page";
import {ZmBsCompModule} from "../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../zmComp/form/zmInput.module";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {BUserMgr} from "../../bsModule/buser/BUserMgr";
import {HomePageMgr} from "../../bsModule/homePage/HomePageMgr";

@NgModule({
  declarations: [
    HomePage,
  ],

  imports: [
    IonicPageModule.forChild(HomePage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
    BUserMgr,
    HomePageMgr,
  ]


})
export class HomePageModule {}
