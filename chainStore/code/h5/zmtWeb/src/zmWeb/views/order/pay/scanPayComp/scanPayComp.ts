import {Component, OnInit, Input, Output, Inject} from '@angular/core';
import { BScanComp } from './beScanComp';
import { ScanComp } from './scanComp';
import {PayItemData} from "../../../zmComp/form/zmPay/PayItemData";
import {PayMgr} from "../../../../bsModule/pay/PayMgr";
import {OrderMgr} from "../../../../bsModule/order/OrderMgr";
import {Order} from "../../../../bsModule/order/data/Order";
import {AppUtils} from "../../../../comModule/AppUtils";
import {BeScanApiForm} from "../../../../bsModule/pay/apiData/BeScanApiForm";
import {PayTypeEnum} from "../../../../bsModule/order/data/PayTypeEnum";
import {ApiTypeEnum} from "../../../../bsModule/pay/data/ApiTypeEnum";
import {RestResp} from "../../../../comModule/RestResp";
import {PayResp} from "../../../../bsModule/pay/data/PayResp";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

@Component({
  selector: 'scan-pay-comp',
  template: `
    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-weight-bold">支付操作选择</div>
      </div>
      <div mat-dialog-content>
        <p class="text-center mb-1"><zm-btn-md class="btn btn-primary cur-hand" (zmbtnClick)="beScan()" [disabled]="isTrue" [name]="'获取收款二维码'"></zm-btn-md></p>
        <p *ngIf="!isTrue"  style="height:24px;margin-bottom:0;" ></p>
        <p *ngIf="isTrue" class="text-center mb-0" >正在获取<img style="width:50px;margin-left:5px;margin-top:5px;" src="assets/images/icon/loading.gif"></p>
        <p class="text-center"><zm-btn-md class="btn btn-primary cur-hand" (zmbtnClick)="scan()"  [disabled]="isShow" [name]="'扫描顾客二维码'"></zm-btn-md>
        <p class="text-center mb-2"> <span style="font-size:16px;">支付异常<img class="ml-2 cur-hand" title="若在使用微信或支付宝支付过程中出现支付异常\n可点击下方的【刷新支付状态】查询支付结果。" src="assets/images/icon/question.png"></span></p>
        <p class="text-center mb-0"> <zm-btn-md class="btn cur-hand btn-sm btn-outline-primary" [stroked]="true" [name]="'刷新支付状态'" (zmbtnClick)="checkOrderPayState()"></zm-btn-md></p>
      </div>
    </div>
`,
  styles: [`
 
  `],
})
export class ScanPayComp implements OnInit {
  public isTrue:boolean=false;
  public isShow:boolean=false;
  @Input() orderId:string;
  @Input() payItemData:PayItemData;
  @Output() callback:any;

  private activeModal: any;
  constructor(private payMgr:PayMgr,
              private orderMgr:OrderMgr,
              private matDialog:MatDialog,
              @Inject(MAT_DIALOG_DATA) private dataInput:any) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {

  }

  /**
   * 关闭弹框
   */
  closeModal(){
    this.activeModal.close();
  }

  /**
   * 请求订单刷新订单支付状态
   */
  checkOrderPayState() {
    this.orderMgr.get(this.orderId).then((order: Order) => {
      if (!AppUtils.isNullObj(order)) {
        let payItemMap = order.getPayItemMap();
        if (payItemMap.get(AppUtils.format('{0}_{1}', this.payItemData.payType, this.payItemData.outTradeNo))) {
          AppUtils.showSuccess("提示", "支付成功");
          this.payItemData.canEdit = false;
          this.callback();
          this.closeModal();
        }
      }
    })
  }

  /**
   * 生成收款二维码
   */
  beScan(){
    if(!AppUtils.isNullOrWhiteSpace(this.orderId) && !AppUtils.isNullObj(this.payItemData) && (this.payItemData.value>0)){
      let beScanApiForm = new BeScanApiForm();
      beScanApiForm.apiType = this.payItemData.payType == PayTypeEnum.WECHAT?ApiTypeEnum.WXPAY:ApiTypeEnum.ALIPAY;
      beScanApiForm.storeId = SessionUtil.getInstance().getStoreId();
      // beScanApiForm.storeId = "1";
      beScanApiForm.orderId = this.orderId;
      beScanApiForm.totalAmount = this.payItemData.value.toString();
      this.isTrue=true;
      this.payMgr.beScan(beScanApiForm).then((restResp:RestResp)=>{
        this.isTrue=false;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          let payResp: PayResp = new PayResp();
          AppUtils.copyJson(payResp, restResp.tJson);
          AppUtils.showSuccess("提示","二维码获取成功");
          this.payItemData.outTradeNo = payResp.outTradeNo;
          this.closeModal();
          const activeModal = ZmModalMgr.getInstance().newSmallModal(BScanComp,null,null);
          activeModal.componentInstance.imgUrl = payResp.imgUrl;
          activeModal.componentInstance.orderId = this.orderId;
          activeModal.componentInstance.payItemData = this.payItemData;
          activeModal.componentInstance.action = ()=>{
            this.payItemData.canEdit = false;
            this.callback();
          };
        }else{
          this.isTrue=false;
          if(!AppUtils.isNullObj(restResp)){
            AppUtils.showError("提示",restResp.tips);
          }else{
            AppUtils.showError("提示","二维码获取失败");
          }
        }
      })
    }else{
      this.isTrue=false;
      AppUtils.showWarn("提示","请检查支付信息");
    }
  }

  /**
   * 扫描顾客二维码
   */
  scan(){
    if(!AppUtils.isNullOrWhiteSpace(this.orderId) && !AppUtils.isNullObj(this.payItemData) && (this.payItemData.value>0)){
      this.isShow=true;
      this.closeModal();
      const activeModal = ZmModalMgr.getInstance().newSmallModal(ScanComp,null,null);
      activeModal.componentInstance.orderId = this.orderId;
      activeModal.componentInstance.payItemData = this.payItemData;
      activeModal.componentInstance.action = ()=>{
        this.payItemData.canEdit = false;
        this.callback();
      }
    }else{
      AppUtils.showWarn("提示","请检查支付信息");
    }
  }

}

