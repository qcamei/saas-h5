import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {AboutUsPage} from "./aboutUs.page";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AboutUsPage,
  ],

  imports: [
    IonicPageModule.forChild(AboutUsPage),
    FormsModule,
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
  ]


})
export class AboutUsPageModule {}
