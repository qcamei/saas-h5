import {IonicPageModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import {ManagerPage} from "./manager.page";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {ZmInputModule} from "../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../zmBSComp/zmBSComp.module";

@NgModule({
  declarations: [
    ManagerPage,
  ],

  imports: [
    IonicPageModule.forChild(ManagerPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
  ]


})
export class ManagerPageModule {}
