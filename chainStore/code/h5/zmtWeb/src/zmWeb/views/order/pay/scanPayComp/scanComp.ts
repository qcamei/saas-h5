import {Component, OnInit, Input, OnDestroy, Output, Inject} from '@angular/core';
import {PayItemData} from "../../../zmComp/form/zmPay/PayItemData";
import {Order} from "../../../../bsModule/order/data/Order";
import {AppUtils} from "../../../../comModule/AppUtils";
import {PayResp} from "../../../../bsModule/pay/data/PayResp";
import {ScanApiForm} from "../../../../bsModule/pay/apiData/ScanApiForm";
import {PayTypeEnum} from "../../../../bsModule/order/data/PayTypeEnum";
import {ApiTypeEnum} from "../../../../bsModule/pay/data/ApiTypeEnum";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {RestResp} from "../../../../comModule/RestResp";
import {PayMgr} from "../../../../bsModule/pay/PayMgr";
import {OrderMgr} from "../../../../bsModule/order/OrderMgr";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'scan-comp',
  template: `
    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-weight-bold">扫描二维码</div>
      </div>
      <div mat-dialog-content>
        <p style="padding:80px 20px 30px 20px;"><input #user autofocus type="text" class="text-center w-100-p" style="border:2px solid #ccc;border-radius:8px;height:60px;"  placeholder="请扫描顾客二维码" [(ngModel)]="authCode" (keyup.enter)="scan($event)"/></p>
        <p class="text-center"><button mat-stroked-button color="accent" (click)="refresh()" [disabled]="isTrue">刷新支付状态<span style="color:#ccc;" *ngIf="isTrue">({{numb}}s)</span></button></p>
      </div>
    </div>
`,
  styles: [`
 
  `]
})
export class ScanComp implements OnInit ,OnDestroy{

  public numb:number;
  public isTrue:boolean=true;
  public timer;
  public authCode:string;
  @Input() orderId:string;
  @Input() payItemData:PayItemData;
  @Output() action:any;

  private activeModal: any;

  constructor(private payMgr:PayMgr,
              private orderMgr:OrderMgr,
              @Inject(MAT_DIALOG_DATA) private dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
    this.numb=65;
  }

  /**
   * 扫码支付
   */
  scan(e){
    let authCode = e.target.value;
    if(!AppUtils.isNullObj(authCode) && !AppUtils.isNullOrWhiteSpace(authCode)){
      let scanApiForm = new ScanApiForm();
      scanApiForm.apiType = this.payItemData.payType == PayTypeEnum.WECHAT?ApiTypeEnum.WXPAY:ApiTypeEnum.ALIPAY;
      scanApiForm.storeId = SessionUtil.getInstance().getStoreId();
      // scanApiForm.storeId = "1";
      scanApiForm.orderId = this.orderId;
      scanApiForm.authCode = authCode;//付款码
      scanApiForm.totalAmount = this.payItemData.value.toString();
      AppUtils.showMask("提交支付信息");
      this.payMgr.scan(scanApiForm).then((restResp:RestResp)=>{
        AppUtils.closeMask();
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          let payResp: PayResp = new PayResp();
          AppUtils.copyJson(payResp, restResp.tJson);
          AppUtils.showSuccess("提示","扫码成功");
          this.payItemData.outTradeNo = payResp.outTradeNo;
          this.timer=setInterval(() => {
            this.timerFun();
          }, 1000);
        }else{
          if(!AppUtils.isNullObj(restResp)){
            AppUtils.showError("提示",restResp.tips);
          }else{
            AppUtils.showError("提示","扫码失败");
          }
        }
      })
    }
  }

  /**
   * 点击刷新支付状态
   */
  refresh(){
    this.numb=5;
    this.isTrue=true;
    this.timer=setInterval(() => {
      this.timerFun();
    }, 1000);
  }

  /**
   * 定时器
   */
  timerFun(){
    this.getOrderPayState();
    this.numb--;
    if (this.numb ==0){
      this.isTrue=false;
      clearTimeout(this.timer);
    }
  }

  /**
   * 请求订单刷新订单支付状态
   */
  private getOrderPayState() {
    if (this.numb % 5 == 0) {
      this.orderMgr.get(this.orderId).then((order: Order) => {
        if (!AppUtils.isNullObj(order)) {
          let payItemMap = order.getPayItemMap();
          if (payItemMap.get(AppUtils.format('{0}_{1}', this.payItemData.payType, this.payItemData.outTradeNo))) {
            AppUtils.showSuccess("提示", "支付成功");
            this.action();
            this.closeModal();
          }
        }
      })
    }
  }

  closeModal(){
    this.activeModal.close();
  }

  ngOnDestroy(){
    if(this.timer){
      clearTimeout(this.timer);
      this.timer=null;
    }
  }

}

