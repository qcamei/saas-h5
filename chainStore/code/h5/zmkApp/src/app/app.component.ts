import { Component, ViewChild } from "@angular/core";
import {
  Platform, Nav, ModalController, AlertController, ToastController, ActionSheetController,
  LoadingController
} from "ionic-angular";

import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import {AppRouter} from "../zmWeb/views/zmComUtils/AppRouter";
import {AlertUtils} from "../zmWeb/views/zmComUtils/AlertUtils";
import {AppUtils} from "../zmWeb/comModule/AppUtils";
import {ActionSheetUtils} from "../zmWeb/views/zmComUtils/ActionSheetUtils";
import {ConfigService} from "../zmWeb/comModule/config/ConfigService";

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = "main";
  // rootPage: string = "loginPage";
  // rootPage: string = "TestPage";
  appMenuItems: Array<MenuItem>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public keyboard: Keyboard,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private configService: ConfigService,
    private loadingCtrl: LoadingController,

  ) {
    this.initializeApp();

    this.appMenuItems = [
      {title: '工作', component: "main", icon: 'zm-work'},
      {title: '管理', component: "mainAdmin", icon: 'zm-admin'},
      {title: '店铺列表', component: "mainWUnitList", icon: 'zm-wunit'},
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.

      //*** Control Splash Screen
      // this.splashScreen.show();
      // this.splashScreen.hide();

      //*** Control Status Bar
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      //*** Control Keyboard
      this.keyboard.disableScroll(true);
    });
  }

  ngAfterViewInit(){
    //只能在这里做初始化
    AppRouter.getInstance().initRouter(this.nav, this.modalCtrl);
    AlertUtils.getInstance().init(this.alertCtrl);
    ActionSheetUtils.getInstance().init(this.actionSheetCtrl);
    AppUtils.setToaster(this.toastCtrl);
    AppUtils.setLoadingCtrl(this.loadingCtrl);

    // let serviceAddress ="http://127.0.0.1:9114/";
    // let imgPreUrl="http://127.0.0.1:9116/";
    // AppCfg.getInstance().init(serviceAddress,imgPreUrl);

    this.configService.initServiceConfig();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}

