import {NgModule} from '@angular/core';
import {MUserRoutingModule} from "./muser-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {LoginPage} from "./login/login";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {ToasterModule} from 'angular2-toaster';
import {StoreBSmodule} from "../../bsModule/store/Store.bsmodule";
import {AppVersionBSModule} from "../../bsModule/appVersion/AppVersion.bsModule";
import {MUserBSModule} from "../../bsModule/muser/MUser.bsModule";


@NgModule({
  declarations: [
    LoginPage,

  ],
  imports: [
    CommonModule,
    FormsModule,
    MUserBSModule,
    StoreBSmodule,
    MUserRoutingModule,
    ThemeModule,
    AppVersionBSModule,
    ToasterModule

  ],
  providers: [

  ],
  //exports: [VerifyCodeComp],
  // entryComponents: [
  //   selectiveComponent,
  //   serviceAgreementComponent
  // ]
})
export class MUserModule {
}
