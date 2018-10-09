import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MainPage} from "./Main.page";
import {ZmBsCompModule} from "../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../zmComp/form/zmInput.module";
import {ZmCompModule} from "../zmComp/zmComp.module";

@NgModule({
  declarations: [
    MainPage,
  ],

  imports: [
    IonicPageModule.forChild(MainPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],


})
export class MainPageModule {}
