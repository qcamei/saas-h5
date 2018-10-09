import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SelectStaffPage} from "./SelectStaff.page";
import {ZmbStaffItem} from "./ZmbStaffItem";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations: [
    SelectStaffPage,
    //组件
    ZmbStaffItem,
  ],
  imports: [
    IonicPageModule.forChild(SelectStaffPage),
    //公共module
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],

  entryComponents:[
  ],
  exports:[
  ]

})
export class SelectStaffPageModule {}
