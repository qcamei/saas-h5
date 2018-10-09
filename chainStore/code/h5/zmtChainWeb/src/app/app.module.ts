import {AppUtils} from "../zmWeb/comModule/AppUtils";
import {Router, ActivatedRoute} from "@angular/router";
import {AppRouter} from "../zmWeb/comModule/AppRouter";
import {Popup} from "../zmWeb/views/common/popup/popup";
import {SessionUtil} from "../zmWeb/comModule/session/SessionUtil";
import {ConfigService} from "../zmWeb/bsModule/config/ConfigService";
import {ZmPopup} from "../zmWeb/views/zmComp/popup/ZmPopup";
import {Notify} from "../zmWeb/comModule/Notify";
import {NotifyService, NotifyModule} from "ngx-notify";
import {ChainData, CurrentChain, UserData} from "../zmWeb/comModule/session/SessionData";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ConfigBSmodule} from "../zmWeb/bsModule/config/Config.bsmodule";
import {ZmMainModule} from "../zmWeb/views/zm.main.module";
import {AppRoutingModule} from "./app-routing.module";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {HttpInterceptorProviders} from "../zmWeb/comModule/interceptor/HttpInterceptorProviders";
import {ChainUserModule} from "../zmWeb/views/chainUser/ChainUser.module";


@NgModule({
  declarations:[
    AppComponent
  ],
  imports:[
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ConfigBSmodule,
    ChainUserModule,
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
  bootstrap:[AppComponent],
  providers:[
    {provide:LocationStrategy,useClass:HashLocationStrategy},//hash#风格
    // { provide: APP_BASE_HREF, useValue: '/zmtweb/' },//h5风格
    HttpInterceptorProviders,
  ]
})
export class AppModule {
  constructor(private router: Router, private notifyService: NotifyService, private configService: ConfigService, private activatedRoute: ActivatedRoute){
    AppUtils.setNotify(new Notify(this.notifyService));
    AppRouter.setRouter(this.router);

    Popup.getInstance().init();
    ZmPopup.Zmstance().PopupInit();

    //初始化配置
    this.configService.initServiceConfig();

    this.activatedRoute.queryParams.subscribe(params => {
      let p = params['p'];
      let u = params['u'];
      let s = params['s'];
      if (!AppUtils.isNullObj(p)&& !AppUtils.isNullObj(u) && !AppUtils.isNullObj(s)){
        let chainData = ChainData.newInstance();
        chainData.setCurrentChain(CurrentChain.newInstance(s, "", null));
        SessionUtil.getInstance().setChainData(chainData);
        let user = UserData.newInstance(u, "");
        user.setAccessToken(p);
        SessionUtil.getInstance().setUserData(user);

      }

    });

  }
}
