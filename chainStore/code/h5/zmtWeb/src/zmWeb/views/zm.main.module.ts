import { NgModule } from '@angular/core';
import {ZmMainRoutingModule} from "./zm.main-routing.module";
import {ZmComModule} from "../comModule/ZmCom.module";
import {StoreClerkInfoBSmodule} from "../bsModule/storeClerkInfo/StoreClerkInfo.bsmodule";
import {StoreBSmodule} from "../bsModule/store/Store.bsmodule";
import {BUserBSModule} from "../bsModule/buser/BUser.bsModule";
import {StoreBeauticianInfoBSmodule} from "../bsModule/storeBeauticianInfo/StoreBeauticianInfo.bsmodule";
import {MainGuard} from "../comModule/guard/MainGuard";
import {AuthService} from "../comModule/guard/AuthService";
import {EUserModule} from "./euser/euser.module";
import {ErrorViewDataMgr} from "./error/errorViewDataMgr";
import {CommonModule} from "@angular/common";
import {MainPageModule} from "./main/mainPage.module";
import {MainResolve} from "../comModule/guard/MainResolve";
import {DetailDataVersionBSmodule} from "../bsModule/detailDataVersion/DetailDataVersion.bsmodule";
import {PermService} from "./permService";
import { ZmStatisticRoutingModule } from "./zm.statistic-routing.module";
import { StatisticMainModule } from './statisticMain/statisticMain.module';
import {TestModule} from "./test/test.module";



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ZmComModule,
    ZmMainRoutingModule,
    ZmStatisticRoutingModule,
    //主页面模块
    MainPageModule,
    StatisticMainModule,

    //业务模块
    EUserModule,
    BUserBSModule,
    StoreBSmodule,
    StoreClerkInfoBSmodule,
    StoreBeauticianInfoBSmodule,
    DetailDataVersionBSmodule,
    TestModule,
  ],
  providers: [
    ErrorViewDataMgr,
    MainGuard,
    AuthService,
    MainResolve,
    PermService,
  ]
})
export class ZmMainModule {}
