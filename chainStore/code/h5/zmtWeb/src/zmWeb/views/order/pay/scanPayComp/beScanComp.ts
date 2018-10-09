import {Component, OnInit, Input, OnDestroy, Output, Inject} from '@angular/core';

import {PayItemData} from "../../../zmComp/form/zmPay/PayItemData";
import {OrderMgr} from "../../../../bsModule/order/OrderMgr";
import {AppCfg} from "../../../../comModule/AppCfg";
import {Order} from "../../../../bsModule/order/data/Order";
import {AppUtils} from "../../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'becan-comp',
  template: `
    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-weight-bold">收款二维码</div>
      </div>
      <div mat-dialog-content>
         <p style="width:200px;height:200px;margin:0 auto 20px;">
         <img class="w-100-p h-100-p" [src]="getQrCodeUrl()">
         </p>
         <p class="text-center"><button mat-stroked-button color="accent" (click)="refresh()" [disabled]="isTrue">刷新支付状态<span style="color:#ccc;" *ngIf="isTrue">({{numb}}s)</span></button></p>
        <!-- <p class="text-center mb-0"><zm-btn-md (zmbtnClick)="refresh()" [disabled]="isTrue" [stroked]="true" [name]="'刷新支付状态'"></zm-btn-md><span *ngIf="isTrue">({{numb}}s)</span></p>-->
      </div>
    </div>
`,
  styles: [`
  .btn-primary{
    background-color: #4678fa !important;
  }
  `]
})
export class BScanComp implements OnInit ,OnDestroy {

  public numb:number;
  public isTrue:boolean=true;
  public timer;
  @Input() orderId:string;
  @Input() imgUrl:string;
  @Input() payItemData:PayItemData;
  @Output() action:any;

  private activeModal: any;

  constructor(private orderMgr:OrderMgr,
              @Inject(MAT_DIALOG_DATA) private dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
    this.numb=65;
    this.timer=setInterval(() => {
      this.timerFun();
    }, 1000);
  }

  /**
   * 支付二维码
   * @returns {string}
   */
  getQrCodeUrl(){
    return AppCfg.getInstance().getImgPreUrl() + this.imgUrl;
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
    if (this.numb == 0){
      this.isTrue=false;
      clearTimeout(this.timer);
    }
  }

  /**
   * 请求订单刷新订单支付状态
   */
  private getOrderPayState() {
    // DataDetailCacheMgr.getInstance().removeTableCache(DataVersionEnum.Order);
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

