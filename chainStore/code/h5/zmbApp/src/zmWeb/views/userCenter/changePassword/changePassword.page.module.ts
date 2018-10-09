import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ChangePasswordPage} from "./changePassword.page";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ChangePasswordPage,
  ],

  imports: [
    IonicPageModule.forChild(ChangePasswordPage),
    FormsModule,
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
  ]


})
export class ChangePasswordPageModule {}
