import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {AppComponent} from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ZmMainModule} from "../zmWeb/views/zm.main.module";
import {BUserModule} from "../zmWeb/views/buser/buser.module";
import {AppUtils} from "../zmWeb/comModule/AppUtils";
import {ActivatedRoute, Router} from "@angular/router";
import {AppRouter} from "../zmWeb/comModule/AppRouter";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {Popup} from "../zmWeb/views/common/popup/popup";
import {SessionUtil} from "../zmWeb/comModule/session/SessionUtil";
import {StoreBSmodule} from "../zmWeb/bsModule/store/Store.bsmodule";
import {ConfigBSmodule} from "../zmWeb/bsModule/config/Config.bsmodule";
import {ConfigService} from "../zmWeb/bsModule/config/ConfigService";
import {ZmPopup} from "../zmWeb/views/zmComp/popup/ZmPopup";
import {HttpClientModule} from "@angular/common/http";
import {HttpInterceptorProviders} from "../zmWeb/comModule/interceptor/HttpInterceptorProviders";
import {Notify} from "../zmWeb/comModule/Notify";
import {NotifyService, NotifyModule} from "ngx-notify";

import {CurrentStore, StoreData, UserData} from "../zmWeb/comModule/session/SessionData";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    //common module
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    //app module
    ConfigBSmodule,
    BUserModule,
    StoreBSmodule,
    ZmMainModule,
    AppRoutingModule,

    NotifyModule.forRoot({
      options: {
        className:"my-notify",
        maxStack:1,
        zIndex:9999
      },
      notify: {
        progress: false,
        animate_in: 'bounceInDown',
        animate_out: 'zoomOut',
        timeout:2000,
      }
    }),

  ],
  bootstrap: [AppComponent],
  providers: [
    {provide:LocationStrategy,useClass:HashLocationStrategy},//hash#风格
    // { provide: APP_BASE_HREF, useValue: '/zmtweb/' },//h5风格
    HttpInterceptorProviders,
  ],
})
export class AppModule {

  constructor(private router: Router, private notifyService: NotifyService, private configService: ConfigService, private activatedRoute: ActivatedRoute) {
    AppUtils.setNotify(new Notify(this.notifyService));
    AppRouter.setRouter(this.router);

    //初始化弹窗
    Popup.getInstance().init();
    ZmPopup.Zmstance().PopupInit();
    //初始化配置
    this.configService.initServiceConfig();

    this.activatedRoute.queryParams.subscribe(params => {
      let p = params['p'];
      let u = params['u'];
      let s = params['s'];
      if (!AppUtils.isNullObj(p)&& !AppUtils.isNullObj(u) && !AppUtils.isNullObj(s)){
        let storeData = StoreData.newInstance();
        storeData.setCurrentStore(CurrentStore.newInstance4Web(s));
        SessionUtil.getInstance().setStoreData(storeData);
        let user = UserData.newInstance(u, "");
        user.setAccessToken(p);
        SessionUtil.getInstance().setUserData(user);
      }
    });
  }
}
