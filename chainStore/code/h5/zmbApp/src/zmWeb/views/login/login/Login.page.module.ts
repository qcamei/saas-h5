import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {LoginPage} from "./Login.page";
import {ZmLoginPhone} from "./comp/ZmLoginPhone";
import {ZmLoginPassword} from "./comp/ZmLoginPassword";
import { ZmCompModule } from '../../zmComp/zmComp.module';
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmLoginVCode} from "./comp/ZmLoginVCode";

@NgModule({
  declarations: [
    LoginPage,
    ZmLoginPhone,
    ZmLoginPassword,
    ZmLoginVCode,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    ZmCompModule,
    ZmInputModule,
  ],
  exports:[
    ZmLoginPhone,
    ZmLoginPassword,
    ZmLoginVCode,
  ],

  providers:[
  ]

})
export class LoginPageModule {}
