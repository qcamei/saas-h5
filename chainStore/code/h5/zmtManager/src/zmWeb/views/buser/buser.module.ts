import {NgModule} from '@angular/core';
import {BUserRoutingModule} from "./buser-routing.module";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RegPage} from "./reg/reg";
import {LoginPage} from "./login/login";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {ResetPwdPage} from "./resetPwd/resetPwd";
import {ToasterModule} from 'angular2-toaster';
import {StoreBSmodule} from "../../bsModule/store/Store.bsmodule";
import {SelectivePage} from "./selective/selective";
import {selectiveComponent} from "./selective/selectiveComponent";
import {AppVersionBSModule} from "../../bsModule/appVersion/AppVersion.bsModule";
import {serviceAgreementComponent} from "./reg/serviceAgreementComponent";
import {BUserListPage} from "./buserList/buserList";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {BUserEditPage} from "./buserEdit/buserEdit";
import {BUserViewDataMgr} from "./BUserViewDataMgr";
import {BUserRolePipe} from "./pipe/BUserRolePipe";
import {VipTypePipe} from "./pipe/VipTypePipe";
import {ZmtDatePipe} from "../common/Pipe/ZmtDatePipe";
import {ExpiredTimePipe} from "./pipe/ExpiredTimePipe";
import {ExpiredStatePipe} from "./pipe/ExpiredStatePipe";
import {BUserRoleBSModule} from "../../bsModule/buserRole/buserRole.bsModule";
import {StoreMenuBSModule} from "../../bsModule/storeMenu/storeMenu.bsmodule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {VipLevelBSModule} from "../../bsModule/vipLevel/VipLevel.bsmodule";
import {VipLevelTypeBSModule} from "../../bsModule/vipLevelType/VipLevelType.bsmodule";
import {VipLevelTypePipe} from "./pipe/vipLevelTypePipe";


@NgModule({
  declarations: [
    selectiveComponent,
    serviceAgreementComponent,
    LoginPage,
    RegPage,
    ResetPwdPage,
    SelectivePage,
    BUserListPage,
    BUserEditPage,
    //Pipe
    ZmtDatePipe,
    ExpiredTimePipe,
    BUserRolePipe,
    VipTypePipe,
    ExpiredStatePipe,
    VipLevelTypePipe

  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ToasterModule,
    ZmCompModule,
    SharedModule,

    AppVersionBSModule,
    BUserBSModule,
    StoreBSmodule,
    BUserRoutingModule,
    BUserRoleBSModule,
    StoreMenuBSModule,
    VipLevelBSModule,
    VipLevelTypeBSModule,
  ],
  providers: [
    BUserViewDataMgr
  ],
  exports: [],
  entryComponents: [
    selectiveComponent,
    serviceAgreementComponent
  ]
})
export class BUserModule {
}
