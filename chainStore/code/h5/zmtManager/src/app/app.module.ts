
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';
import { CoreModule } from './@core/core.module';

import {AppComponent} from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ZmMainModule} from "../zmWeb/views/zm.main.module";
import {BUserModule} from "../zmWeb/views/buser/buser.module";
import {ToasterModule, ToasterService} from "angular2-toaster";
import {Toaster} from "../zmWeb/comModule/Toaster";
import {AppUtils} from "../zmWeb/comModule/AppUtils";
import {Router} from "@angular/router";
import {AppRouter} from "../zmWeb/comModule/AppRouter";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {Popup} from "../zmWeb/views/common/popup/popup";
import {SessionUtil} from "../zmWeb/comModule/SessionUtil";
import {StoreBSmodule} from "../zmWeb/bsModule/store/Store.bsmodule";
import {ConfigBSmodule} from "../zmWeb/bsModule/config/Config.bsmodule";
import { HttpInterceptorService} from "../zmWeb/views/common/Intercept/Intercept";
import {MUserModule} from "../zmWeb/views/muser/muser.module";
import {ConfigService} from "../zmWeb/bsModule/config/ConfigService";


// export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
//   let service = new HttpInterceptorService(xhrBackend, requestOptions);
//   return service;
// }


@NgModule({
  declarations: [AppComponent],
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
    MUserModule,
    StoreBSmodule,
    ZmMainModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide:LocationStrategy,useClass:HashLocationStrategy},
    // { provide: APP_BASE_HREF, useValue: '/' },
    // HttpInterceptorService,
    // {
    //   provide: Http,
    //   useFactory: interceptorFactory,
    //   deps: [XHRBackend, RequestOptions]
    // }
  ],
})
export class AppModule {
  constructor(router: Router,toasterService:ToasterService, private configService:ConfigService){
    AppUtils.setToaster(new Toaster(toasterService));
    AppRouter.setRouter(router);
    SessionUtil.getInstance().checkUserData();
    //初始化弹窗
    Popup.getInstance().init();
    //初始化配置
    this.configService.initServiceConfig();
  }
}
