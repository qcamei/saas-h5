
import {Component, Input, Output, Inject} from '@angular/core';

import {AppUtils} from '../../../../comModule/AppUtils';
import {RechargeSettingWFCompData} from '../../wfComp/WFDataWraper';
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 会员充值结算单模态框
 */
@Component({
  selector:'',
  template:
    `    
    <div animation-modal>
    <div class="modal-header">
      <span class="font-bold fz-16">结算单</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    
    <div class="modal-body">
      <div class="mg-b-30">
        <table class="table table-bordered text-center">
          <tbody>
            <tr><td >充值金额</td><td><i class="fa fa-yen mg-r-5"></i>{{data.rechargeOrderItemData.pay}}</td></tr>
            <tr> <td>额外赠送</td><td><i class="fa fa-yen mg-r-5"></i>{{data.rechargeOrderItemData.largess}}</td></tr>
            <tr><td>实充金额</td><td><i class="fa fa-yen mg-r-5"></i>{{data.rechargeOrderItemData.amount}}</td></tr>
          </tbody>
        </table>
          <!--<h4 class="disFlex" style="padding-right: 20px;justify-content: flex-end;margin: 1rem 0;font-size: 16px;font-weight: bold;">应结金额<span><i class="fa fa-yen mg-l-15"></i>{{data.rechargeOrderItemData.pay}}</span></h4>-->
       </div>

                   <zm-payType-comp [lable]=" '现金' "  [payType]="0"  [balance]="data.balance" [(zmValue)]="data.cash" (callback)="changePayAmount()"></zm-payType-comp>
                   
                    <zm-payType-comp [lable]=" '支付宝' "  [payType]="1"  [balance]="data.balance" [(zmValue)]="data.alipay" (callback)="changePayAmount()"></zm-payType-comp>
                    
                    <zm-payType-comp [lable]=" '微信' "  [payType]="2"  [balance]="data.balance" [(zmValue)]="data.wechat" (callback)="changePayAmount()"></zm-payType-comp>
                    
                    <zm-payType-comp [lable]=" '刷卡' "  [payType]="3"  [balance]="data.balance" [(zmValue)]="data.slotCard" (callback)="changePayAmount()"></zm-payType-comp>
                 
     <div class="" style="border-top: 1px solid #e9ecef;">
         <div class="disFlex  pd-t-30 pd-r-20 align-center mg-b-10">
               <div class="text-right" style="font-size: 18px;font-weight: bold;color: #333;width: calc(80% - 20px);">
                 <p>实付</p>
                 <p style="margin-bottom: 0;">应结</p>
               </div>
                <div  style="margin-left:20px;text-align:right;width:20%;">
                  <p><i class="fa fa-yen mg-r-5"></i>{{payAmount}}</p>
                  <p style="margin-bottom: 0;"><i class="fa fa-yen mg-r-5"></i>{{data.rechargeOrderItemData.pay}}</p>
                </div>
          </div>       
          <div class="pd-r-20 text-right pd-t-20" style="padding-bottom: 26px; ">
                 <button class="btn c-close-btn-modal cur-hand" style="padding: 5px 48px;" (click)="closeModal()">取消</button>
                 <button class="btn  c-btn-blue cur-hand" style="padding: 5px 48px;" (click)="confirm()">确定</button>
           </div>
     </div>
    </div>
    </div>
  `,
  styles:[`
  .c-close-btn-modal{
    border: 2px solid#03a9f4 !important;
    color:#03a9f4 !important;
    background-color: #fff;
  }

  .c-btn-blue{
    color: #fff;
    border-color:#03a9f4 !important;
    background-color:#03a9f4 !important;
  }
  .font-bold{
    font-weight:bold;;
  }
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }
  .disFlex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
  }

  .align-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    align-items: center;
  }
  .mg-b-30{
    margin-bottom:30px;
  }
  .mg-b-10{
    margin-bottom:10px;
  }  
  .mg-r-5{
    margin-right:5px;
  }  
  .pd-r-20{
    padding-right: 20px;
  }
  .pd-t-20{
    padding-top: 20px;
  }
  .pd-t-30{
      padding-top: 30px;
  }
  .fz-16{
    font-size: 16px;
  }
  
  table tbody tr td:nth-child(1) {
        background: #F4F6FA;
        width: 20%;
        font-weight: bold;
    }
  table tbody tr td:nth-child(2) {
        width: 60%;
        background: #fff !important;
    }
  .c-label{
        margin-left: 15px; 
        margin-bottom: 0;
        width: 60px;
        text-align: left;
    }
  .c-input-group{
        height:48px;
     }
  .c-input-icon{
        right:298px;
        z-index:3;
        font-size:14px;
        color: #999;
        top:11px;
    }
  .c-control{
        border:2px solid #ced4da;
        outline:none;
        padding:10px 30px;
        border-radius:0.375rem;
        width:100%;
        // margin-bottom: .5rem;
    }
  .c-control:focus{
       border-radius:0.375rem;
       border:2px solid#03a9f4;
    }
  .c-input-error{
        height: 30px;
        padding-left:4px;
        color: #FF4c6a;
        font-size: 12px;
        align-items:center;
    }
  .modal-body{padding-bottom:0;}
  
  thead th {
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      background-color: #f4f6fa !important;
    }
    tbody tr{
      margin-top: -1px;
    }
    tbody tr:nth-of-type(odd){
      background-color: #ffffff;
    }
    tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
      background-color:#f9fafc;
    }
    tbody .c-tr:hover{
      background-color: #e7f3fd;
    }
    tbody a{cursor:pointer;}
    tbody a:hover{text-decoration: none;color:#03a9f4 !important;}
    
    th, td{
      vertical-align: middle !important;
      font-size: 14px;
      word-wrap:break-word;
      word-break: break-all;
    }
    thead th{
      border-bottom-width: 1px !important;
    }
    th{
      border-bottom-width: 1px !important;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      background-color: #f4f6fa !important;
    }
    
    select::-ms-expand { display: none; }
    
    input[type=number] {
      -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .cancel-btn{
      background: #fff;
      border: 2px solid#03a9f4;
      color:#03a9f4;
      width: 168px;
      line-height: 48px;
      -moz-border-radius: 8px;
      border-radius: 8px;
      cursor: pointer;
    }
    .cancel-btn:focus {
      outline: none;
    }
    
    .confirm-btn {
      background:#03a9f4;
      border: 2px solid#03a9f4;
      color: #fff;
      width: 168px;
      line-height: 48px;
      -moz-border-radius: 8px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm-btn:focus {
      outline: none;
    }
    
    
    `]
})
export class SettleAccountModalComp {
  @Input() data: RechargeSettingWFCompData;
  @Output() action:any;

  public payAmount:number = 0;
  public cheYen:boolean = false;
  public alipay:boolean = false;
  public wechat:boolean = false;
  public slotCard:boolean = false;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  closeModal() {
    this.activeModal.close();
  }

  confirm():void{
    // if(this.payAmount != this.data.rechargeOrderItemData.pay){
    //   AppUtils.showWarn("提示","实付与应结金额不符，请检查金额输入");
    // }
    if(this.checkPay()){
      AppUtils.showWarn("提示","请检查金额输入");
    }else{
      this.closeModal();
      this.action(null);
    }
  }

  changePayAmount(){
    this.payAmount = 0;
    if(this.data.cash){
      this.payAmount = this.payAmount + parseFloat(this.data.cash.toString());
    }
    if(this.data.alipay){
      this.payAmount = this.payAmount + parseFloat(this.data.alipay.toString());
    }
    if(this.data.wechat){
      this.payAmount = this.payAmount + parseFloat(this.data.wechat.toString());
    }
    if(this.data.slotCard){
      this.payAmount  = this.payAmount + parseFloat(this.data.slotCard.toString());
    }
    this.payAmount = AppUtils.roundPoint(this.payAmount,2);
  }

  /**
   * 检查是否选择支付方式 输入支付金额 true：没有选择支付方式
   * @returns {boolean}
   */
  checkPay():boolean{
    if(!this.data.cash
      && !this.data.alipay
      && !this.data.wechat
      && !this.data.slotCard){
      return true;
    }else{
      return false;
    }
  }

}

