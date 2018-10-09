import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ChargeMgr} from "../../../bsModule/charge/ChargeMgr";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {ChargeViewDataMgr} from "../chargeViewDataMgr";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {AppUtils} from "../../../comModule/AppUtils";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import { ChargeScanComp } from "./chargeScanComp/chargeScanComp";
import {ActivatedRoute} from "@angular/router";
import {Charge} from "../../../bsModule/charge/data/Charge";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {PayMgr} from "../../../bsModule/pay/PayMgr";
import {BeScanApiForm} from "../../../bsModule/pay/apiData/BeScanApiForm";
import {ApiTypeEnum} from "../../../bsModule/pay/data/ApiTypeEnum";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {RestResp} from "../../../comModule/RestResp";
import {PayResp} from "../../../bsModule/pay/data/PayResp";
import {ChargeChannelEnum} from "../../../bsModule/charge/data/ChargeChannelEnum";
import {OrderOriginTypeEnum} from "../../../bsModule/pay/apiData/OrderOriginTypeEnum";

/**
 * 续费升级支付
 */
@Component({
  selector:'charge-pay',
  templateUrl:'chargePay.html',
  styleUrls:['chargePay.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class ChargePayPage implements OnInit,OnDestroy{

  private paramSub:any;
  private viewDataSub:any;
  private service:ChargePayService;
  public viewData:ChargePayViewData;

  public isTrueWx:boolean=false;
  public isTrueZfb:boolean=true;

  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private payMgr:PayMgr,
              private chargeViewDataMgr:ChargeViewDataMgr,
              private cdRef:ChangeDetectorRef,
              private route:ActivatedRoute,
              private matDialog: MatDialog){
      this.service = new ChargePayService(this.chargeMgr,this.vipLevelMgr,this.buserSynDataHolder,this.chargeViewDataMgr);
      ZmModalMgr.getInstance().reset(matDialog);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chargeViewDataMgr.subscribeChargePayVD((viewDataP:ChargePayViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.paramSub = this.route.params.subscribe((params)=>{
      let chargeId = params['chargeId'];
      this.service.initViewData(chargeId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  getPayMoney():number{
    let payMoney = 0;
    if(this.viewData.charge.vipAmount){
      payMoney = this.viewData.charge.vipAmount-this.viewData.charge.offsetAmount-this.viewData.charge.discountAmount;
    }
    return payMoney;
  }

  /**
   * 支付宝支付
   */
  alipay(){
    this.isTrueZfb=true;
    this.isTrueWx=false;
    this.beScan(ChargeChannelEnum.ALIPAY);
  }

  /**
   * 微信支付
   */
  wechatPay(){
    this.isTrueWx=true;
    this.isTrueZfb=false;
    this.beScan(ChargeChannelEnum.WECHAT);
  }

  /**
   * 生成收款二维码
   */
  beScan(payType:number){
    if(!AppUtils.isNullObj(this.viewData.charge)){
      let beScanApiForm = new BeScanApiForm();
      beScanApiForm.apiType = payType == ChargeChannelEnum.WECHAT?ApiTypeEnum.WXPAY:ApiTypeEnum.ALIPAY;
      beScanApiForm.storeId = SessionUtil.getInstance().getStoreId();
      beScanApiForm.orderId = this.viewData.charge.id;
      beScanApiForm.orderOriginType = OrderOriginTypeEnum.STOREMNGMS_CHARGE;
      let payMoney = 0;
      if(this.viewData.charge.vipAmount){
        payMoney = this.viewData.charge.vipAmount-this.viewData.charge.offsetAmount-this.viewData.charge.discountAmount;
      }
      beScanApiForm.totalAmount = payMoney > 0?AppUtils.roundPoint(payMoney/100,2).toString():"0.00";
      AppUtils.showMask("加载中");
      this.payMgr.beScan(beScanApiForm).then((restResp:RestResp)=>{
        AppUtils.closeMask();
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          let payResp: PayResp = new PayResp();
          AppUtils.copyJson(payResp, restResp.tJson);
          AppUtils.showSuccess("提示","二维码获取成功");
          const activeModal = ZmModalMgr.getInstance().newStaticSmallModal(ChargeScanComp,null,null);
          activeModal.componentInstance.header = payType == ChargeChannelEnum.WECHAT?"微信支付":"支付宝支付";
          activeModal.componentInstance.tip = payType == ChargeChannelEnum.WECHAT?"请使用微信扫一扫进行扫码支付":"请使用支付宝扫一扫进行扫码支付";
          activeModal.componentInstance.imgUrl = payResp.imgUrl;
          activeModal.componentInstance.chargeId = this.viewData.charge.id;
          activeModal.componentInstance.action = ()=>{
            this.service.initViewData(this.viewData.charge.id);
          };
        }else{
          if(!AppUtils.isNullObj(restResp)){
            AppUtils.showError("提示",restResp.tips);
          }else{
            AppUtils.showError("提示","二维码获取失败");
          }
        }
      })
    }else{
      AppUtils.showWarn("提示","请检查支付信息");
    }
  }

  /**
   * 刷新支付状态
   */
  refreshPay(){
    if(this.viewData.charge){
      this.service.initViewData(this.viewData.charge.id);
    }
  }

}

export class ChargePayService{
  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private chargeViewDataMgr:ChargeViewDataMgr,){}

  public initViewData(id:string){
    let viewDataTmp = new ChargePayViewData();
    this.chargeViewDataMgr.setChargePayViewData(viewDataTmp);

    this.buildViewData(id);
  }

  private async buildViewData(id:string) {
    let viewDataTmp = new ChargePayViewData();

    let charge:Charge = await this.chargeMgr.get(id);
    if(!AppUtils.isNullObj(charge)){
      viewDataTmp.charge = charge;

      if(!AppUtils.isNullObj(charge.vipLevelId)){
        viewDataTmp.vipLevel = await this.vipLevelMgr.get(charge.vipLevelId);
      }
    }
    this.chargeViewDataMgr.setChargePayViewData(viewDataTmp);
  }

}

export class ChargePayViewData{
  public charge: Charge;
  public vipLevel:VipLevel;
}
