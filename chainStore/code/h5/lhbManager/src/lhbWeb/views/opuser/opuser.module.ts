import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {ToasterModule} from "angular2-toaster";
import {OPUserBSModule} from "../../bsModule/opUser/OPUser.bsModule";
import {OPUserRoutingModule} from "./opuser-routing.module";
import {LoginPage} from "./login/login";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {VerifyCodeComp} from "./verifyCode/verifyCodeComp";



@NgModule({
  declarations: [
    LoginPage,
    VerifyCodeComp,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ToasterModule,

    ZmCompModule,

    OPUserBSModule,
    OPUserRoutingModule,


  ],
  providers: [

  ],
  exports: [
    VerifyCodeComp
  ],
  entryComponents: [

  ]
})

export class OPUserModule {}
