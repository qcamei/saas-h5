import { NgModule } from '@angular/core';
import {ZmMainRoutingModule} from "./zm.main-routing.module";
import {ZmComModule} from "../comModule/ZmCom.module";
import {MainPage} from "./main/main.page";
import {ThemeModule} from "../../app/@theme/theme.module";
import {MainLayoutComp} from "./main/layout/main.layout";
import {MainHeaderComp} from "./main/head/main.header";
import {ToasterModule} from "angular2-toaster";
import {MainViewDataMgr} from "./main/mainViewDataMgr";
import {MainGuard} from "../comModule/MainGuard";
import {AuthService} from "../comModule/AuthService";
import {SideBarComp} from "./main/sideBar/sideBar";


@NgModule({
  declarations: [
    MainPage,
    MainLayoutComp,
    MainHeaderComp,
    SideBarComp,
  ],
  imports: [
    ThemeModule,
    ZmComModule,
    ZmMainRoutingModule,
    ToasterModule,
    //业务模块
  ],
  providers: [
    MainViewDataMgr,
    MainGuard,
    AuthService,
  ]
})
export class ZmMainModule {}
