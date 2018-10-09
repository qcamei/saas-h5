
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CoreModule } from './@core/core.module';

import {AppComponent} from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ToasterModule, ToasterService} from "angular2-toaster";
import {Router} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {HttpModule} from "@angular/http";
import {ConfigBSmodule} from "../lhbWeb/bsModule/config/Config.bsmodule";
import {BUserModule} from "../lhbWeb/views/buser/buser.module";
import {ZmMainModule} from "../lhbWeb/views/zm.main.module";
import {AppUtils} from "../lhbWeb/comModule/AppUtils";
import {Toaster} from "../lhbWeb/comModule/Toaster";
import {ConfigService} from "../lhbWeb/bsModule/config/ConfigService";
import {AppRouter} from "../lhbWeb/comModule/AppRouter";
import {SessionUtil} from "../lhbWeb/comModule/SessionUtil";
import {Popup} from "../lhbWeb/views/common/popup/popup";
import {OPUserModule} from "../lhbWeb/views/opuser/opuser.module";



@NgModule({
  declarations: [AppComponent,],
  imports: [
    //common module
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,

    //ngx admin module
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    ToasterModule,


    //app module
    ConfigBSmodule,
    OPUserModule,
    ZmMainModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide:LocationStrategy,useClass:HashLocationStrategy},
    // { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
  constructor(router: Router,toasterService:ToasterService, private configService:ConfigService){
    AppUtils.setToaster(new Toaster(toasterService));
    AppRouter.setRouter(router);
    SessionUtil.getInstance().checkUserData();
    //初始化弹窗
    Popup.getInstance().init();
    //初始化远程配置
    this.configService.initServiceConfig();
  }
}
