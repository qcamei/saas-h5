import {Component, Input, Output, EventEmitter} from "@angular/core";
import {PayItemData} from "./PayItemData";

/**
 *
 <zm-pay-type [(payList)]="data.payList"></zm-pay-type>
 */
@Component({
  selector:'zm-pay-type',
  template: `
            <div fxLayout="row wrap" fxLayoutGap="20px">
              <div *ngFor="let item of payList">
                <div fxLayout="row" fxLayoutAlign="center center" class="align-center cur-hand" style="width:142px; height: 38px; margin-bottom:10px; border-radius: 6px; border:1px solid #E7EAEF;" [class.select]="item.isSelect" (click)="select(item)">
                    <img *ngIf="item.payType==0" src="assets/images/icon/yen.png" alt="" /><!--现金-->
                    <img *ngIf="item.payType==1" src="assets/images/icon/zfb.png" alt="" /><!--支付宝-->
                    <img *ngIf="item.payType==2" src="assets/images/icon/weixin.png" alt="" /><!--微信-->
                    <!--刷卡-->
                    <img *ngIf="item.payType==3" src="assets/images/icon/unionpay.png" alt="" />
                    <!--会员卡扣金额-->
                    <img *ngIf="item.payType==4" src="assets/images/icon/cardcome.png" alt="" />
                    <img *ngIf="item.payType==5" src="assets/images/icon/redyen.png" alt="" /><!--欠款-->
                    <div class="dib mg-l-10">
                        <p class="fz-16 my-0" style="color:#333; font-weight: normal;">{{item.payType | orderPayTypePipe}}</p>
                    </div>
                </div>
              </div>
            </div>
            `,
  styles:[
    `
      :host{
        display: inline-block;
      }
         
    
     .select{
      border: none;
      background: url("assets/images/icon/paytype_select.png") no-repeat;
      background-size:100% 100%;
     }

    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    }
    
    
    .mg-r-15{
      margin-right:15px;
    }
    .mg-l-10{
      margin-left:10px;
    } 
    .mg-b-20{
      margin-bottom:20px;
    }
    .dib{
      display: inline-block;
    } 

    .fz-16{
      font-size: 16px;
    } 
    .mg-b-0{
      margin-bottom:0;
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
    .cur-hand{
      cursor: pointer;
    }

    `]
})

export class ZmPayType{

  @Input() restAmount:number = 0;
  @Output() callback = new EventEmitter();

  private _payList:Array<PayItemData>;

  @Input()
  get payList(): Array<PayItemData> {
    return this._payList;
  }

  set payList(value: Array<PayItemData>) {
    this._payList = value;
  }

  select(item:PayItemData){
    if(item.canEdit){
      item.isSelect = !item.isSelect;
      if(!item.isSelect){
        item.value = undefined;
      }else{
        item.value = this.restAmount;
      }
      this.callback.emit();
    }
  }


}
