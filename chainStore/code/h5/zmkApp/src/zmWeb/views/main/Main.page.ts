import {Component, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {MainViewDataMgr} from "./MainViewDataMgr";
import {MainService} from "./MainService";
import {MainViewData} from "./MainViewData";
import {IonicPage} from "ionic-angular";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {AppRouter} from "../zmComUtils/AppRouter";
import {StoreJoinService} from "../store/select/StoreJoinService";
import {AppUtils} from "../../comModule/AppUtils";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {Constants} from "../zmComUtils/Constants";
import {WxOpenIdMgr} from "../../bsModule/wxOpenId/WxOpenIdMgr";
import {WxOpenId} from "../../bsModule/wxOpenId/data/WxOpenId";

@IonicPage({
  name: "main",
  segment: 'main'
})

@Component({
  template: `
            
            <ion-tabs [tabsHighlight]="true" tabindex="1">
                <ion-tab small tabIcon="alarm" tabTitle="预约" [root] = "'appointment'"></ion-tab>
                <ion-tab small tabIcon="apps" tabTitle="商城" [root] = "'mallList'"></ion-tab>
                <ion-tab small tabIcon="person" tabTitle="我的" [root] = "'myPage'"></ion-tab>
            </ion-tabs>
    `,
  styles: [`
    
  `],
})
export class MainPage implements OnDestroy {

  private service: MainService;
  viewData: MainViewData;
  storeJoinServie: StoreJoinService;

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new MainService();
    this.storeJoinServie = new StoreJoinService();
    let initData: MainViewData = null;
    MainViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MainViewData) => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    });

    this.checkLogin();
    this.getOpenIdForWxMiniProgram();
  }

  ionViewWillEnter(){
    this.joinAndSwitchForSceneStoreId();
  }

  /**
   * 检查是否已登陆
   */
  checkLogin(){
    let isLogin: boolean = SessionUtil.getInstance().isLogin();
    if(!isLogin){
      AppRouter.getInstance().goLogin();
    }
  }

  /**
   * 加入并切换到webview传入的sceneStoreId
   */
  joinAndSwitchForSceneStoreId(){
    let sceneStoreId = SessionUtil.getInstance().getSceneStoreId();
    if(AppUtils.isNullOrWhiteSpace(sceneStoreId)){
      return;
    }
    let hasJoined = this.hasJoinedThisStore(sceneStoreId);
    if(hasJoined){
        this.switchAndRemoveSceneStoreId(sceneStoreId);
    }else{
      this.storeJoinServie.joinStore(sceneStoreId).then((restResp: RestResp)=>{
        if(restResp != null && restResp.code == 200) {
          this.switchAndRemoveSceneStoreId(sceneStoreId);
        }
      });
    }
  }

  /**
   * 判断是否已加入过此店铺
   * @param {string} sceneStoreId
   */
  hasJoinedThisStore(sceneStoreId: string): boolean{
    let hasJoined = false;
    let cuserStoreIds = SessionUtil.getInstance().getStoreIdsFromCache();
    for(let i = 0; i < cuserStoreIds.length; i++){
      if(cuserStoreIds[i] == sceneStoreId){
        hasJoined = true;
        break;
      }
    }
    return hasJoined;
  }

  /**
   * 切换并清除sceneStoreId
   * @param {string} sceneStoreId
   */
  switchAndRemoveSceneStoreId(sceneStoreId:string){
    SessionUtil.getInstance().switchStore(sceneStoreId);
    SessionUtil.getInstance().removeSceneStoreId();
  }

  /**
   * 为小程序支付获取openId
   * jsCode有效期为5分钟，所以要在main页面及时获取openId
   */
  getOpenIdForWxMiniProgram(){
    let appId = Constants.WX_MINI_APPID;
    let jsCode = SessionUtil.getInstance().getJsCode();
    WxOpenIdMgr.getInstance().genOpenId(appId, jsCode).then((wxOpenId:WxOpenId)=>{
      let curOpenId = SessionUtil.getInstance().getOpenId();
      if(!AppUtils.isNullObj(wxOpenId) && AppUtils.isNullOrWhiteSpace(curOpenId)){
        SessionUtil.getInstance().setOpenId(wxOpenId.openId);
        // AppUtils.showSuccess("提示","openId获取成功");
      }else{
        // AppUtils.showError("提示","openId获取失败");
      }
    })
  }

  ionViewDidEnter() {
  }

  ngOnDestroy(): void {

  }

}




