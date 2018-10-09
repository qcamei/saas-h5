import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MultiImgUpload} from "./MultiImgUpload";
import {ZmCompModule} from "../../zmComp.module";

@NgModule({
  declarations: [
    MultiImgUpload,
  ],
  imports: [
    IonicPageModule.forChild(MultiImgUpload),
    ZmCompModule,
  ],
  exports:[
    MultiImgUpload,
  ]

})
export class RegPageModule {}
