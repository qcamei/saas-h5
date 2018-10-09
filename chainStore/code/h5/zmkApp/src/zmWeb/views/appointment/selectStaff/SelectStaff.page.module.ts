import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SelectStaffPage} from "./SelectStaff.page";
import {ZmkStaffItem} from "./ZmkStaffItem";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations: [
    SelectStaffPage,
    //组件
    ZmkStaffItem,
  ],
  imports: [
    IonicPageModule.forChild(SelectStaffPage),
    ZmInputModule,
    ZmCompModule,
    ZmBsCompModule,
  ],

  entryComponents:[
  ],
  exports:[
  ]

})
export class SelectStaffPageModule {}
