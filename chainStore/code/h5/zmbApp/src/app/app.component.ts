import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
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
import {SessionUtil} from "../zmWeb/comModule/session/SessionUtil";
import {MainViewData} from "../zmWeb/views/main/MainViewData";
import {Constants} from "../zmWeb/views/zmComUtils/Constants";
import {MainViewDataMgr} from "../zmWeb/views/main/MainViewDataMgr";


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  viewData: AppViewData = new AppViewData();

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
    private cdRef: ChangeDetectorRef) {

    this.initializeApp();

    MainViewDataMgr.getInstance().onDataChange(MainViewData.getInstance(), (mainViewDataP: MainViewData) => {
      if (mainViewDataP) {
        this.initViewDataFromMainViewData(mainViewDataP);
        this.cdRef.markForCheck();
      }
    });

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

    this.configService.initServiceConfig();

    // let serviceAddress ="http://192.168.40.220/storems/ws/v1";
    // let imgPreUrl="http://192.168.40.220/";
    // AppCfg.getInstance().init(serviceAddress,imgPreUrl);


    this.initViewDataFromMainViewData(MainViewData.getInstance());
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    // this.nav.setRoot(page.component);
    AppRouter.getInstance().push(page);
  }

  initViewDataFromMainViewData(mainViewDataP: MainViewData){
    this.viewData = new AppViewData();

    this.viewData.rootPage = "main";
    // this.viewData.rootPage = "loginPage";
    // this.viewData.rootPage = "TestPage";

    this.viewData.appTopLeftItemName = "个人设置";
    this.viewData.appTopRightItemName = "退出登录";
    this.viewData.appMenuItems = [
      // {title: '添加店铺', component: "storeAdd", icon: 'zm-wunit'},
      // {title: '用户反馈', component: "userFeedback", icon: 'zm-admin'},
      {title: '关于我们', component: "aboutUs", icon: 'zm-work'},
    ];

    this.viewData.imgUrl = mainViewDataP.imgUrl;
    this.viewData.userName = mainViewDataP.userName;
    this.viewData.userRole = mainViewDataP.userRole;
  }


  goUserDetailPage(){
    AppRouter.getInstance().goUserDetailPage();
    // this.nav.setRoot("userDetail");
  }

  userDetailCallback(viewDataP: any){
    this.viewData = viewDataP;
  }


  logout(){
    SessionUtil.getInstance().onLogout();
  }

}

class AppViewData{
  rootPage: string = "main";
  imgUrl:string = Constants.USER_DEFAULT_IMG;
  userName:string = "";
  userRole:string = "";
  appTopLeftItemName:string = "";
  appTopRightItemName:string = "";
  appMenuItems: Array<MenuItem> = [];

}

export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}
