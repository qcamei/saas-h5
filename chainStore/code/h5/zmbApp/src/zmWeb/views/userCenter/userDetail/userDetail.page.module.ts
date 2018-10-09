import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {UserDetailPage} from "./userDetail.page";

@NgModule({
  declarations: [
    UserDetailPage,
  ],

  imports: [
    IonicPageModule.forChild(UserDetailPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,


  ],
  providers:[
  ]


})
export class UserDetailPageModule {}
