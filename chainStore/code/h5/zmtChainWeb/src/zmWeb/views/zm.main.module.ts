import { NgModule } from '@angular/core';
import {ZmMainRoutingModule} from "./zm.main-routing.module";
import {ZmComModule} from "../comModule/ZmCom.module";
import {MainGuard} from "../comModule/guard/MainGuard";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {MainPageModule} from "./main/mainPage.module";
import {PermService} from "./permService";
import {AuthService} from "../comModule/guard/AuthService";
import {MainResolve} from "../comModule/guard/MainResolve";


@NgModule({
  declarations: [

  ],
  imports: [
    NgbModule,
    CommonModule,
    ZmComModule,
    ZmMainRoutingModule,

    //主页面模块
    MainPageModule,

  ],
  providers: [
    MainGuard,
    AuthService,
    MainResolve,
    PermService,
  ]
})
export class ZmMainModule {}
