import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by helen on 2018/3/14.
    支付公共组件
 <zm-payType-comp [lable]=" '现金' "  [payType]="0"  [balance]="data.balance" [(zmValue)]="data.payData.cash" (callback)="changePayAmount()"></zm-payType-comp>
 */

@Component({
  selector:'zm-payType-comp',
  template: `
                 <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px" style="height:52px;width: 100%">
                        <div style="width:200px;" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                              <zm-input-checkbox [(zmValue)]="showPay" (onChange)="changeChecked()"></zm-input-checkbox>
                              
                              <img *ngIf="payType==0" src="assets/images/icon/yen.png" alt=""  /><!--现金-->
                              <img *ngIf="payType==1" src="assets/images/icon/zfb.png" alt=""  /><!--支付宝-->
                              <img *ngIf="payType==2" src="assets/images/icon/weixin.png" alt="" /><!--微信-->
                              <!--刷卡-->
                              <img *ngIf="payType==3" src="assets/images/icon/unionpay.png" alt=""  />
                              <!--会员卡扣金额-->
                              <img *ngIf="payType==4" src="assets/images/icon/cardcome.png" alt=""  />
                              <img *ngIf="payType==5" src="assets/images/icon/redyen.png" alt=""  /><!--欠款-->
                              <div fxFlex="1 1">
                                  <p class="fz-16 my-0" style="color:#333;"   [ngStyle]="{'width':payType==4?'auto':'50px'}">{{lable}}</p>
                                  <p *ngIf="payType==4" class="fz-14  my-0" style="color:#999;">余额：&yen;{{balance}}</p>
                              </div>
                        </div>
                        <!--<input *ngIf="showPay" type="number" style="color:#333;border-radius:6px;border:2px solid #E7EAEF; padding: 0.75rem 0.75rem;"   placeholder="请输入金额" [(ngModel)]="zmValue" (blur) ="changePayAmount()"  (keyup)="checkFormat($event)"/>-->
                        <div style="width:100px;"  *ngIf="showPay" >
                              <zm-input-price fxFlexAlign="end center"[placeholder]="'请输入金额'" [(zmValue)]="zmValue"></zm-input-price>
                        </div>
                   
                 </div>
            `
})

export class ZmPayTypeComp implements OnInit{

  @Input() lable:string;
  @Input() payType:number;
  @Input() balance:string;

  @Output() callback = new EventEmitter();
  @Output() zmValueChange = new EventEmitter();
  private valueTmp:any;
  public showPay:boolean;

  @Input()
  get zmValue() {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
    this.callback.emit();
  }

  ngOnInit(){

  }

  changeChecked(){
    if(!this.showPay){
      this.zmValue = undefined;
    }
  }

  // changePayAmount():void{
  //   this.callback.emit();
  // }
  // public checkFormat(e){
  //   let value = e.target.value;
  //   this.valueTmp = this.validateValue(value);
  // }
  //
  // private validateValue(value) {
  //   if(!AppUtils.isNumber(value.toString())) {
  //     value = "";
  //   }else{
  //     value = AppUtils.twoDecimal(value);
  //     if(value<0 || value>99999999){
  //       value = "";
  //     }
  //   }
  //   return value;
  // }

}
