import {Component, OnInit, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy} from '@angular/core';
import {StoreListViewDataMgr} from "./StoreListViewDataMgr";
import {StoreListService} from "./StoreListService";
import {StoreListViewData} from "./StoreListViewData";
import {Store} from "../../../bsModule/store/data/Store";
import {IonicPage, ViewController} from "ionic-angular";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreJoinService} from "./StoreJoinService";
import {AppUtils} from "../../../comModule/AppUtils";
import {RestResp} from "../../../comModule/asynDao/apiData/RestResp";
import {WXUtils} from "../../zmComUtils/WXUtils";

@IonicPage({
  name:"mainStoreSelect",
  segment: 'mainStoreSelect'
})
@Component({
  template: `
         <zm-modal-header title="选择店铺" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
         
         <zm-page-content>
           <!--  <button ion-button icon-start block color="primary" tappable  (click)="logout()">
           <ion-icon name="log-in"></ion-icon>退出
           </button>-->
           <ng-container *ngIf="viewData.storeList">
                <zm-store-info *ngFor="let item of viewData.storeList" 
                    [store]="item" (zmClick)="onSelect($event)" ></zm-store-info>
                <zm-no-data *ngIf="viewData.loadFinish==true && viewData.storeList!=null && viewData.storeList.length==0"  text="没有数据" ></zm-no-data>
           </ng-container>
          </zm-page-content>
          
          <ion-footer (click)="scanQrcodeClick()">
             <div style="padding:0 10px;"> <button ion-button block>扫码加入店铺</button></div>
          </ion-footer>

    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StoreSelectComp implements OnInit,OnDestroy{

  private service:StoreListService;
  public viewData:StoreListViewData;

  private storeJoinServie: StoreJoinService;

  modalCtrl:ModalCtrl;
  constructor( private cdRef: ChangeDetectorRef,private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(this.viewCtrl);
    this.service = new StoreListService();
    this.viewData = new StoreListViewData();
    this.storeJoinServie = new StoreJoinService();
  }

  ngOnInit(): void {
    let initData:StoreListViewData = null;
    StoreListViewDataMgr.getInstance().onDataChanged(initData,(viewDataP:StoreListViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    });

    this.service.buildViewData();
    WXUtils.getInstance().init();
  }

  ngOnDestroy(): void {
    StoreListViewDataMgr.getInstance().onViewDestroy();
  }

  ionViewWillEnter(){
  }

  ionViewDidEnter() {
  }

  ionViewDidLoad(){
  }

  ionViewDidLeave(){
  }

  ionViewWillUnload(){
  }

  ionViewCanEnter(){
  }

  ionViewCanLeave(){
  }

  async onSelect(store:Store){
    await SessionUtil.getInstance().switchStore(store.id);
    this.modalCtrl.dismiss(store);
  }

  /**
   * 扫码
   */
  scanQrcodeClick(){
    WXUtils.getInstance().scanQrcode(this.handleCodeResult.bind(this));
    this.modalCtrl.dismiss(null);
  }

  /**
   * 解析扫到的数据; 二维码规则zhimeitong_1_storeId
   * @param result
   */
  handleCodeResult(result){
    let resultArr = result.split('_');
    if(resultArr.length==3 && resultArr[0]=='zhimeitong'){
      let storeId = resultArr[2];
      this.joinAndSwitchStore(storeId);
    }else{
      AppUtils.showWarn("提示", '请扫描正确的二维码');
    }
  }

  /**
   * 加入并切换店铺
   * @param {string} storeId
   * @returns {Promise<void>}
   */
  async joinAndSwitchStore(storeId:string){
    let hasJoined = this.hasJoinedThisStore(storeId);
    if(hasJoined){
      // AppUtils.showInfo("提示", '已经加入过');
      SessionUtil.getInstance().switchStore(storeId);
    }else{
      // AppUtils.showInfo("提示", '没有加入过，开始加入');
      this.storeJoinServie.joinStore(storeId).then((restResp: RestResp)=>{
        this.handleJoinStoreRestResp(restResp,storeId);
        // AppUtils.showInfo("提示", '拿到加入店铺的RestResp');
      });
    }
  }

  /**
   * 判断是否已加入过此店铺
   * @param {string} storeId
   */
  hasJoinedThisStore(storeId: string): boolean{
    let hasJoined = false;
    let cuserStoreIds = SessionUtil.getInstance().getStoreIdsFromCache();
    for(let i = 0; i < cuserStoreIds.length; i++){
      if(cuserStoreIds[i] == storeId){
        hasJoined = true;
        break;
      }
    }
    return hasJoined;
  }

  /**
   * 处理加入店铺的结果
   * @param {RestResp} restResp
   * @param {string} storeId
   */
  handleJoinStoreRestResp(restResp:RestResp, storeId:string){
    if(restResp != null){
      if(restResp.code == 200){
        AppUtils.showSuccess("提示", "加入店铺成功！");
        SessionUtil.getInstance().switchStore(storeId);
      }else{
        AppUtils.showError("提示", "加入店铺失败，" + restResp.tips);
      }
    }else{
      AppUtils.showError("提示", "加入店铺失败");
    }
  }

}




