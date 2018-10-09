import {NgModule} from "@angular/core";
import {MyBonusPage} from "./MyBonus.page";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {ZmBsCompModule} from "../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../zmComp/form/zmInput.module";

@NgModule({
  declarations:[
    MyBonusPage,
  ],
  imports:[
    IonicPageModule.forChild(MyBonusPage),

    //公共module
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ]
})
export class MyBonusPageModule{}
