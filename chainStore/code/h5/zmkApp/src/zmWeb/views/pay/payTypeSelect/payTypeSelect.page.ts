import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {OrderMgr} from "../../../bsModule/order/orderMgr";
import {Order} from "../../../bsModule/order/data/Order";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PayTypeSelectViewDataMgr} from "./payTypeSelectViewDataMgr";
import {PayTypeSelectViewData} from "./payTypeSelectViewData";
import {BeScanApiForm} from "../../../bsModule/pay/apiData/BeScanApiForm";
import {RestResp} from "../../../comModule/asynDao/apiData/RestResp";
import {PayMgr} from "../../../bsModule/pay/PayMgr";
import {PayResp} from "../../../bsModule/pay/data/PayResp";
import {PayDataWrappr} from "../payDataWrappr";
import {ApiTypeEnum} from "../../../bsModule/pay/data/ApiTypeEnum";
import {PayOrderForCuserForm} from "../../../bsModule/order/apiData/PayOrderForCuserForm";
import {MiniProgramApiForm} from "../../../bsModule/pay/apiData/MiniProgramApiForm";
import {Constants} from "../../zmComUtils/Constants";
import {MiniProgramPayResp} from "../../../bsModule/pay/data/MiniProgramPayResp";
import {WXUtils} from "../../zmComUtils/WXUtils";

@IonicPage({
  name: "payTypeSelect",
  segment: 'payTypeSelect'
})

@Component({
  template: `
    <zm-page-header no-back title="选择支付方式"></zm-page-header>
    <zm-page-content>
    <div mb-100-p>
      <!--<div>订单编号:{{viewData.order.number}}</div>-->
      <div style="padding:30px 0 20px 10px;font-size:16px;"><b mr-2>支付金额</b>:<span
        style="color:red;">￥{{viewData.order.cost}}</span></div>
      <!--<div zmk-item-lg>-->
        <!--<button ion-item detail-push (click)="storePayClick()"><img mr-2 src="assets/img/zf.png">到店支付</button>-->
      <!--</div>-->

      <div zmk-item-lg>
        <button zmk-item-lg ion-item detail-push (click)="wxPayClick()"><img mr-2 src="assets/img/weixin.png">微信支付
        </button>
      </div>

      <div zmk-item-lg>
        <button zmk-item-lg ion-item detail-push (click)="alipayClick()"><img mr-2 src="assets/img/zfb.png">支付宝支付
        </button>
      </div>
      
      <p *ngIf="!isQrcodeLoading" style="height:24px;margin-bottom:0;"></p>
      <p *ngIf="isQrcodeLoading" text-center>正在获取收款二维码<img style="width:50px;margin-left:5px;" src="assets/img/loading.gif">
      </p>
    </div>      
    </zm-page-content>
    <ion-footer (click)="payConfirmClick(viewData.order.id)">
      <div style="padding:0 10px;">
        <button block ion-button style="opacity: 0.5" (click)="goMainPage()">暂不支付(回首页)</button>
        <button block ion-button>确认支付</button>
      </div>
    </ion-footer>
  `
})
export class PayTypeSelectPage {

  public isQrcodeLoading:boolean=false;
  private service: PayTypeSelectService;
  private viewDataSub: any;
  public viewData: PayTypeSelectViewData = new PayTypeSelectViewData;

  constructor(private cdRef: ChangeDetectorRef,
              private navParams: NavParams) {

    this.service = new PayTypeSelectService();

    let initData = new PayTypeSelectViewData();
    this.viewDataSub = PayTypeSelectViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: PayTypeSelectViewData) => {
      this.viewData = viewDataP;
      PayDataWrappr.getInstance().setOrder(viewDataP.order);
      this.cdRef.markForCheck();
    });
  }

  ionViewDidEnter() {
    this.initData();
  }

  private initData() {
    let orderId = AppRouter.getInstance().getTargetId(this.navParams);
    if(!AppUtils.isNullOrWhiteSpace(orderId)){
      this.service.initViewData(orderId);
    }
  }

  storePayClick(){
    AppRouter.getInstance().goWaitForPayPage(this.viewData.order.id);
  }


  goMainPage(){
    AppRouter.getInstance().goMain();
  }

  wxPayClick(){
    // this.beScan(ApiTypeEnum.WXPAY);
    this.miniProgramPayClick();
  }

  alipayClick(){
    this.beScan(ApiTypeEnum.ALIPAY);
  }

  /**
   * 获取小程序支付参数，并跳到小程序
   */
  miniProgramPayClick(){
    if(this.isValidViewDataOrder()){
      let miniProgramApiForm = new MiniProgramApiForm();
      miniProgramApiForm.storeId = SessionUtil.getInstance().getCurStoreId();
      miniProgramApiForm.orderId = this.viewData.order.id;
      miniProgramApiForm.totalAmount = this.viewData.order.cost.toString();
      miniProgramApiForm.appid = Constants.WX_MINI_APPID;
      miniProgramApiForm.openid = SessionUtil.getInstance().getOpenId();
      let _self = this;
      PayMgr.getInstance().miniProgramPay(miniProgramApiForm).then((restResp:RestResp)=>{
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          let miniProgramPayResp: MiniProgramPayResp = new MiniProgramPayResp();
          AppUtils.copyJson(miniProgramPayResp, restResp.tJson);
          _self.goMiniProgramPayPage(miniProgramApiForm.orderId, miniProgramPayResp);
        }else{
          if(!AppUtils.isNullObj(restResp)){
            AppUtils.showError("提示",restResp.tips);
          }else{
            AppUtils.showError("提示","小程序支付参数获取失败，请重试");
          }
        }
      })
    }else{
      AppUtils.showWarn("提示","请检查支付信息");
    }
  }

  /**
   * 跳到小程序支付页面
   * @param {MiniProgramPayResp} data
   */
  goMiniProgramPayPage(orderId: string, data: MiniProgramPayResp){
    let _package = data._package.split("=")[1]; //去掉参数值中的=号
    let params = '?timeStamp='+data.timeStamp+'&nonceStr='+data.nonceStr
      +'&package='+_package+'&signType='+data.signType
      +'&paySign='+data.paySign+'&orderId='+orderId;
    let path = '/pages/pay/pay'+params;
    console.log(path);
    WXUtils.getInstance().miniProgramNavigateTo(path);
  }

  /**
   * 生成收款二维码
   */
  beScan(apiTypeP: ApiTypeEnum){
    if(this.isValidViewDataOrder()){
      AppUtils.showInfo("提示","正在获取收款二维码");
      let beScanApiForm = new BeScanApiForm();
      beScanApiForm.apiType = apiTypeP;
      beScanApiForm.storeId = SessionUtil.getInstance().getCurStoreId();
      beScanApiForm.orderId = this.viewData.order.id;
      beScanApiForm.totalAmount = this.viewData.order.cost.toString();
      this.isQrcodeLoading=true;
      PayMgr.getInstance().beScan(beScanApiForm).then((restResp:RestResp)=>{
        this.isQrcodeLoading=false;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          let payResp: PayResp = new PayResp();
          AppUtils.copyJson(payResp, restResp.tJson);
          AppUtils.showSuccess("提示","收款二维码获取成功");
          PayDataWrappr.getInstance().setPayResp(payResp);
          AppRouter.getInstance().goPayQrcodePage();
        }else{
          if(!AppUtils.isNullObj(restResp)){
            AppUtils.showError("提示",restResp.tips);
          }else{
            AppUtils.showError("提示","收款二维码获取失败，请重试");
          }
        }
      })
    }else{
      AppUtils.showWarn("提示","请检查支付信息");
    }
  }

  /*
   * 确认支付
   */
  payConfirmClick(orderId:string){
    let storeId = SessionUtil.getInstance().getCurStoreId();
    OrderMgr.getInstance().get(storeId,orderId).then((orderTmp:Order)=>{
      let isPaySuccess: boolean = false;
      if(!AppUtils.isNullObj(orderTmp.payItems)){
        for(let i=0;i<orderTmp.payItems.length;i++){
          let payItem = orderTmp.payItems[i];
          if(orderTmp.cost = payItem.cost){
            isPaySuccess = true;
            break;
          }
        }
      }
      if(isPaySuccess){
        AppUtils.showSuccess("提示","支付成功");
        OrderMgr.getInstance().payOrder(PayOrderForCuserForm.from(orderTmp));
        AppRouter.getInstance().goPaySuccessPage();
      }else{
        AppUtils.showInfo("提示","未支付成功，请重试");
      }
    });
  }

  /**
   * 检查viewData中的order信息是否有效
   * @returns {boolean}
   */
  private isValidViewDataOrder(){
    return !AppUtils.isNullOrWhiteSpace(this.viewData.order.id)
      && this.viewData.order.cost > 0;
  }

}

export class PayTypeSelectService {

  constructor() {}

  public initViewData(orderId:string) {
    let viewDataTmp = new PayTypeSelectViewData();
    PayTypeSelectViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(orderId,(viewData: PayTypeSelectViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: PayTypeSelectViewData) {
    PayTypeSelectViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(orderId:string,callback: (viewDataP: PayTypeSelectViewData) => void) {
    let viewDataTmp = new PayTypeSelectViewData();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let orderTmp :Order = await OrderMgr.getInstance().get(storeId,orderId);
    viewDataTmp.order  = orderTmp;
    callback(viewDataTmp);
  }

}






