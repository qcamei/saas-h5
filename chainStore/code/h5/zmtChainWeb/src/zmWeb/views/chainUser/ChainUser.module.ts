import {NgModule} from '@angular/core';
import {ChainUserRoutingModule} from "./ChainUser-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RegPage} from "./reg/reg";
import {LoginPage} from "./login/login";
import {SmsBSModule} from "../../bsModule/sms/Sms.bsmodule";
import {ResetPwdPage} from "./resetPwd/resetPwd";
import {VerifyCodeComp} from "./verifyCode/verifyCodeComp";
import {AppVersionBSModule} from "../../bsModule/appVersion/AppVersion.bsModule";
import {serviceAgreementComponent} from "./reg/serviceAgreementComponent";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmLoginPhone} from "./login/comp/ZmLoginPhone";
import {ZmLoginPassword} from "./login/comp/ZmLoginPassword";
import {ZmLoginButton} from "./login/comp/ZmLoginButton";
import {ZmRegInputName} from "./reg/comp/ZmRegInputName";
import {ZmRegInputGender} from "./reg/comp/ZmRegInputGender";
import {ZmRegInputPhone} from "./reg/comp/ZmRegInputPhone";
import {ZmRegInputPwd} from "./reg/comp/ZmRegInputPwd";
import {ZmRegInputPwdConfirm} from "./reg/comp/ZmRegInputPwdConfirm";
import {ZmRegVCode} from "./reg/comp/ZmRegVCode";
import {ZmRegInputBtn} from "./reg/comp/ZmRegInputBtn";
import {ZmRegInputCheckbox} from "./reg/comp/ZmRegInputCheckbox";
import {ZmResetPwdInputPhone} from "./resetPwd/comp/ZmResetPwdInputPhone";
import {ZmSelectCountry} from "./reg/comp/ZmSelectCountry";
import {ChainUserBSModule} from "../../bsModule/chainUser/ChainUser.bsmodule";
import {ChainClerkBSModule} from "../../bsModule/chainClerk/ChainClerk.bsmodule";
import {ChainModule} from "../chain/Chain.module";


@NgModule({
  declarations: [
    serviceAgreementComponent,

    LoginPage,
    ZmLoginPhone,
    ZmLoginPassword,
    ZmLoginButton,

    RegPage,
    ZmRegInputBtn,
    ZmRegInputCheckbox,
    ZmRegInputName,
    ZmRegInputGender,
    ZmRegInputPhone,
    ZmRegInputPwd,
    ZmRegInputPwdConfirm,
    ZmRegVCode,
    ZmSelectCountry,

    ResetPwdPage,
    ZmResetPwdInputPhone,
    VerifyCodeComp

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ZmCompModule,

    ChainUserBSModule,
    ChainUserRoutingModule,
    ChainModule,
    ChainClerkBSModule,

    SmsBSModule,
    AppVersionBSModule,

  ],
  providers: [

  ],
  exports: [
    VerifyCodeComp,
    ZmRegInputName,
    ZmRegVCode,
    ZmRegInputBtn,
    ZmResetPwdInputPhone,
    ZmSelectCountry,
  ],
  entryComponents: [
    serviceAgreementComponent,
  ]
})
export class ChainUserModule {
}
