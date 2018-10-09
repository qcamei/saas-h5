import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TestPage} from "./Test.page";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {ZmInputModule} from "../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../zmBSComp/zmBSComp.module";
import {AreasSelect} from "../zmBSComp/zmb/picker/areasPicker/AreasSelect";
import {ZmbPickerSelect} from "../zmBSComp/zmb/picker/zmbPicker/ZmbPickerSelect";

@NgModule({
  declarations: [
    TestPage
  ],
  imports: [
    IonicPageModule.forChild(TestPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  exports:[
  ]

})
export class TestPageModule {}
