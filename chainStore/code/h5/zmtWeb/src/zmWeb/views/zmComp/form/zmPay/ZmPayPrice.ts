import {
  Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef
} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {PayTypeEnum} from "../../../../bsModule/order/data/PayTypeEnum";
import { ScanPayComp } from '../../../order/pay/scanPayComp/scanPayComp';
import {PayItemData} from "./PayItemData";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../modal/ZmModalMgr";

/**
 <zm-pay-input [balance]="data.balance" [(payList)]="data.payList" (callback)="changePayAmount()"></zm-pay-input>
 */
@Component({
  selector:'zm-pay-input',
  template: `
            <div *ngFor="let item of payList">
                <div fxLayout="row" fxLayoutAlign="start" class="disFlex align-center mg-b-20" style="height: 52px;" *ngIf="item.isSelect">
                    <div fxLayout="row"  fxLayoutAlign="start center" class="w-25-p">
                        <img *ngIf="item.payType==0" src="assets/images/icon/yen.png" /><!--现金-->
                        <img *ngIf="item.payType==1" src="assets/images/icon/zfb.png" /><!--支付宝-->
                        <img *ngIf="item.payType==2" src="assets/images/icon/weixin.png" /><!--微信-->
                        <!--刷卡-->
                        <img *ngIf="item.payType==3" src="assets/images/icon/unionpay.png" />
                        <!--会员卡扣金额-->
                        <img *ngIf="item.payType==4" src="assets/images/icon/cardcome.png" />
                        <img *ngIf="item.payType==5" src="assets/images/icon/redyen.png" /><!--欠款-->
                        <div class="dib mg-l-15">
                            <p class="fz-16 my-0" style="color:#333;"   [ngStyle]="{'width':payType==4?'auto':'100px'}">{{(item.payType|orderPayTypePipe)+"支付"}}</p>
                            <p *ngIf="item.payType==4" class="fz-14 my-0" [class.text-danger]="checkRestAmount()" style="color:#999;">余额：&yen;{{balance}}</p>
                        </div>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="start center" class="w-70-p" >
                      <input [disabled]="!item.canEdit" type="number" oninput="if(value<0 || value>99999999)value=null" style="color:#333;border-radius:6px;border:2px solid #E7EAEF;max-width:40%;" class="fz-14 mg-l-20 form-control flex"  placeholder="请输入金额" [(ngModel)]="item.value" (blur)="changePayAmount($event,item)"/>
                    <button [disabled]="!item.canEdit" *ngIf="item.payType==2" mat-raised-button color="accent" class="zmCurHand ml-4" (click)="pay(item)">扫码支付</button>
                    <button [disabled]="!item.canEdit" *ngIf="item.payType==1" mat-raised-button color="accent" class="zmCurHand ml-4" (click)="pay(item)">扫码支付</button>
                    </div>
                  
                </div>   
            </div>
            `,
  styles:[
    `
     .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .flex {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      -webkit-flex: 1;
         -moz-box-flex: 1;
              flex: 1;
    }
    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    }
    
    .hor-center {
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      -moz-box-pack: center;
      justify-content: center;
    }
    .mg-b-20{
      margin-bottom:20px;
    }
    .mg-l-10{
      margin-left:10px;
    } 
    .dib{
      display: inline-block;
    } 
    .mg-l-15{
      margin-left:15px;
    } 
    .mg-l-20{
      margin-left:20px;
    }
    .fz-16{
      font-size: 16px;
    } 
  
    .fz-14{
      font-size: 14px;
    } 
    .mg-l-15{
      margin-left:15px;
    }
    .form-control:focus {
      border: 2px solid #DADFE6 !important;
      box-shadow: none;
    }

    input[type=number] {
      -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .form-control{
      padding: 0.75rem 0.75rem;
      border: 2px solid #ced4da;
    }
    .form-control:focus{
      box-shadow: none;
    }

    `],
})
export class ZmPayPriceComp implements OnInit{

  @Input() orderId:string;
  @Input() balance:number;
  @Output() callback = new EventEmitter();
  private _payList:Array<PayItemData>;

  @Input()
  get payList(): Array<PayItemData> {
    return this._payList;
  }

  set payList(value: Array<PayItemData>) {
    this._payList = value;
    this.callback.emit(this._payList);
  }

  constructor(private matDialog: MatDialog,private cdRef: ChangeDetectorRef) {
    ZmModalMgr.getInstance().reset(matDialog);
  }

  ngOnInit():void{

  }

  /**
   * 微信扫码
   */
  pay(item:PayItemData){
    if(item.value <= 0){
      AppUtils.showWarn("提示","请输入有效的支付金额");
    }else if(item.value > 10000){
      AppUtils.showWarn("提示","单次支付金额最大不得超过10000元");
    }else{
      const activeModal = ZmModalMgr.getInstance().newSmallModal(ScanPayComp,null,null);
      activeModal.componentInstance.orderId = this.orderId;
      activeModal.componentInstance.payItemData = item;
      activeModal.componentInstance.callback = ()=>{
        this.cdRef.markForCheck();//手动触发刷新
      };
    }
  }

  /**
   * 检查会员卡扣款金额是否大于会员卡余额 大于返回true
   * @returns {boolean}
   */
  checkRestAmount():boolean{
    let success = false;
    for(let i=0;i<this.payList.length;i++){
      let payItem = this.payList[i];
      if(payItem.payType == PayTypeEnum.MEMBERSHIPCARD && payItem.value && (parseFloat(payItem.value.toString()) > parseFloat(this.balance.toString()))){
        success = true;
        break;
      }
    }
    return success;
  }

  changePayAmount(e,item):void{
    let value = e.target.value;
    item.value = AppUtils.appendZero(this.validateValue(value));
    this.callback.emit(this.payList);
  }

  private validateValue(value) {
    if(!AppUtils.isNumber(value.toString())) {
      value = "";
    }else{
      value = AppUtils.twoDecimal(value);
      if(value<0 || value>99999999){
        value = "";
      }
    }
    return value?value:0;
  }

}

