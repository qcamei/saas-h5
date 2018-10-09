import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {AppCfg} from "../../../../comModule/AppCfg";
import {ChargeMgr} from "../../../../bsModule/charge/ChargeMgr";
import {Charge} from "../../../../bsModule/charge/data/Charge";
import {AppUtils} from "../../../../comModule/AppUtils";
import {ChargeStatusEnum} from "../../../../bsModule/charge/data/ChargeStatusEnum";


@Component({
  selector: 'charge-bescan-comp',
  template: `
    <div>
      <div mat-dialog-title>
        <div class="font-weight-bold">{{header}}</div>
      </div>
      <div mat-dialog-content>
         <p style="width:200px;height:200px;margin:0 auto 20px;">
           <img class="w-100-p h-100-p" [src]="getQrCodeUrl()">
         </p>
         <p class="text-center mb-0">
          {{tip}}
         </p>
         <p class="text-center mb-0">
            <button (click)="refresh()" [disabled]="isTrue"  mat-stroked-button color="accent">刷新支付状态 <span *ngIf="isTrue">({{numb}}s)</span></button>
         </p>
      </div>
      <mat-dialog-actions class="mt-8" fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <zm-btn  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn>
      
     </mat-dialog-actions>

    </div>
`,
  styles: [`
 
  `]
})
export class ChargeScanComp implements OnInit,OnDestroy {

  public header:string = "支付宝支付";
  public tip:string = "请使用支付宝扫一扫进行扫码支付";
  public imgUrl:string;
  public chargeId:string;
  public action:any;
  public numb:number;
  public isTrue:boolean=true;
  public timer;
  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any,
               private chargeMgr:ChargeMgr,) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
    this.numb=65;
    this.timer=setInterval(() => {
      this.timerFun();
    }, 1000);
  }

  ngOnDestroy(){
    if(this.timer){
      clearTimeout(this.timer);
      this.timer=null;
    }
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
    this.refreshChargePayState();
    this.numb--;
    if (this.numb == 0){
      this.isTrue=false;
      clearTimeout(this.timer);
    }
  }

  /**
   * 刷新支付状态
   */
  private refreshChargePayState() {
    if (this.numb % 5 == 0) {
      this.chargeMgr.get(this.chargeId).then((charge: Charge) => {
        if (!AppUtils.isNullObj(charge)) {
          if(charge.status == ChargeStatusEnum.HAS_PAY){
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

}
