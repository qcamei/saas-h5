import {OnInit, OnDestroy, Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {StoreQrcodeViewDataMgr} from "../storeQrcodeViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/apiData/Store";
import {AppCfg} from "../../../comModule/AppCfg";

/**
 * 获取店铺二维码
 */
@Component({
  selector:"get-qrcode",
  template:`
          <view-body-comp [headerArr]="['获取二维码']">
            <div *ngIf="viewData" fxLayout="row wrap" fxLayoutAlign="space-between center" style="width:70%;margin:0 auto;" >
              <div fxLayout="column" fxLayoutAlign="center" fxLayoutGap="20px">
                <img style="width:300px;height:300px;" [src]="getJoinStoreImg()">
                <p class="text-center text-bold">店铺二维码</p>
                <span>店铺二维码仅作为员工加入店铺时扫码使用</span>
                <a *ngIf="viewData.store" mat-raised-button color="accent" href="{{getJoinStoreImg()}}" download="{{getJoinImgName()}}" target="_blank">保存</a>
              </div>
              <div fxLayout="column" fxLayoutAlign="center" fxLayoutGap="20px">
                <img style="width:300px;height:300px;" [src]="getAcodeImg()">
                <p class="text-center text-bold">小程序二维码</p>
                <span>小程序二维码仅作为客户使用小程序时扫码使用</span>
                <a *ngIf="viewData.store" mat-raised-button color="accent" href="{{getAcodeImg()}}" download="{{getAcodeImgName()}}" target="_blank">保存</a>
              </div>
            </div>
          </view-body-comp>
`,
  styles:[

  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class GetQrcodePage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private service:GetQrcodeService;
  public viewData:GetQrcodeViewData;

  constructor(private storeSynDataHolder:StoreSynDataHolder,
              private storeQrcodeViewDataMgr:StoreQrcodeViewDataMgr,
              private cdRef:ChangeDetectorRef){
    this.service = new GetQrcodeService(this.storeSynDataHolder,this.storeQrcodeViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeQrcodeViewDataMgr.subscribeGetQrcodeVD((viewDataP:GetQrcodeViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 加入店铺二维码
   * @returns {string}
   */
  getJoinStoreImg(){
    return AppUtils.isNullObj(this.viewData.store)?"":AppCfg.getInstance().getImgPreUrl() + this.viewData.store.joinStoreImg;
  }

  /**
   * 小程序二维码
   * @returns {string}
   */
  getAcodeImg(){
    return AppUtils.isNullObj(this.viewData.store)?"":AppCfg.getInstance().getImgPreUrl() + this.viewData.store.acodeImg;
  }

  /**
   * 加入店铺二维码name
   */
  getJoinImgName(){
    let storeName = SessionUtil.getInstance().getStoreName();
    let split = this.viewData.store.joinStoreImg.split(".");
    return storeName + "加入店铺二维码." + split[1];
  }

  /**
   * 小程序二维码name
   */
  getAcodeImgName(){
    let storeName = SessionUtil.getInstance().getStoreName();
    let split = this.viewData.store.acodeImg.split(".");
    return storeName + "小程序二维码." + split[1];
  }


}

class GetQrcodeService{
  constructor(private storeSynDataHolder:StoreSynDataHolder,
              private storeQrcodeViewDataMgr:StoreQrcodeViewDataMgr){}

  public initViewData(){
    let viewDataTmp = new GetQrcodeViewData();
    this.storeQrcodeViewDataMgr.setGetQrcodeVD(viewDataTmp);

    this.buildViewData();
  }

  private buildViewData(){
    let viewDataTmp = new GetQrcodeViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeSynDataHolder.getData(storeId).then((store:Store)=>{
      if(!AppUtils.isNullObj(store)){
        viewDataTmp.store = store;
      }
      this.storeQrcodeViewDataMgr.setGetQrcodeVD(viewDataTmp);
    })
  }

}

export class GetQrcodeViewData{
  public store:Store;
}
