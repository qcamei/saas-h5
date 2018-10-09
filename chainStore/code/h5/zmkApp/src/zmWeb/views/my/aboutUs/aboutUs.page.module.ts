import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {AboutUsPage} from "./aboutUs.page";

@NgModule({
  declarations: [
    AboutUsPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutUsPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],

  entryComponents:[
  ],
  exports:[
  ]

})
export class AboutUsPageModule {}
