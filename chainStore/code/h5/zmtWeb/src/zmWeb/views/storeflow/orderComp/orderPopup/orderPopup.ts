import {Component, Input, Output, OnInit, OnDestroy, Inject} from "@angular/core";

import {AppUtils} from "../../../../comModule/AppUtils";
import {OrderWFCompData} from "../../wfComp/WFDataWraper";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 开单收银结算单公共组件
 */
@Component({
  selector:'order-popup',
  template:`
    <div class="mg-b-0 animation-modal" style="box-shadow:0 0 0 0;">
        <div class="disFlex align-center modal-header">
            <span class="flex mg-r-10 font-bold">结算单</span>
            <button type="button" class="close" aria-label="Close" (click)="closeModal()">
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
        
            <table class="table table-bordered text-center mg-b-0">
              <thead>
                <th style="width:8%;">序号</th>
                <th style="width:10%;">类型</th>
                <th style="width:15%;">名称</th>
                <th style="width:10%;">售价</th>
                <th style="width:8%;">数量</th>
                <th style="width:9%;">折扣</th>
                <th style="width:15%;">总价</th>
                <th style="width:15%;">应结</th>
                <th style="width:10%;">结算方式</th>
              </thead>
            </table>
            <div style="overflow-x:hidden;overflow-y:auto;max-height:340px;">
            
              <zm-table>
              <thead>
              </thead>
              <tbody>
                <tr *ngFor="let item of data.billList;let i=index;">
                  <td style="width:8%;">{{i+1}}</td>
                  <td style="width:10%;">{{item.type | orderItemTypePipeComp}}</td>
                  <td style="width:15%;">{{item.name}}</td>
                  <td style="width:10%;">&yen;{{item.price}}</td>
                  <td style="width:8%;">{{item.count}}</td>
                  <td style="width:9%;">{{item.discount|discountPipe}}</td>
                  <td style="width:15%;">&yen;{{item.totalPrice}}</td>
                  <td style="width:15%;">&yen;{{item.cost}}</td>
                  <td style="width:10%;">{{item.payType == 0?'现结':'划卡'}}</td>
                </tr>
              </tbody>
            </zm-table>
              <!--<table class="table table-bordered text-center fz-14 mg-b-0" style="margin-top:-1px;">-->
                <!--<tr *ngFor="let item of data.billList;let i=index;">-->
                <!--<td style="width:8%;">{{i+1}}</td>-->
                <!--<td style="width:10%;">{{item.type | orderItemTypePipeComp}}</td>-->
                <!--<td style="width:15%;">{{item.name}}</td>-->
                <!--<td style="width:10%;">&yen;{{item.price}}</td>-->
                <!--<td style="width:8%;">{{item.count}}</td>-->
                <!--<td style="width:9%;">{{item.discount|discountPipe}}</td>-->
                <!--<td style="width:15%;">&yen;{{item.totalPrice}}</td>-->
                <!--<td style="width:15%;">&yen;{{item.cost}}</td>-->
                <!--<td style="width:10%;">{{item.payType == 0?'现结':'划卡'}}</td>-->
                <!--</tr>-->
              <!--</table>-->
            </div>
            <p class="mg-t-20 mg-b-20 pd-r-20 text-right font-bold fz-16">应结金额<span style="margin-left:50px;">&yen; {{data.orderAmount | number:'1.2-2'}}</span></p>
            <div class="disFlex mg-t-20 fz-14">
                <div class="flex mg-r-20">
                    <zm-payType-comp [lable]=" '会员卡扣金额' "  [payType]="4"  [balance]="data.balance" [(zmValue)]="data.payData.memberCard" (callback)="changePayAmount()"></zm-payType-comp>
                    <zm-payType-comp [lable]=" '支付宝' "  [payType]="1"  [balance]="data.balance" [(zmValue)]="data.payData.alipay" (callback)="changePayAmount()"></zm-payType-comp>
                    <zm-payType-comp [lable]=" '刷卡' "  [payType]="3"  [balance]="data.balance" [(zmValue)]="data.payData.slotCard" (callback)="changePayAmount()"></zm-payType-comp>
              </div>
              <div class="flex mg-l-20">
                    <zm-payType-comp [lable]=" '现金' "  [payType]="0"  [balance]="data.balance" [(zmValue)]="data.payData.cash" (callback)="changePayAmount()"></zm-payType-comp>
                    <zm-payType-comp [lable]=" '微信' "  [payType]="2"  [balance]="data.balance" [(zmValue)]="data.payData.wechat" (callback)="changePayAmount()"></zm-payType-comp>
                    <zm-payType-comp [lable]=" '欠款' "  [payType]="5"  [balance]="data.balance" [(zmValue)]="data.payData.arrears" (callback)="changePayAmount()"></zm-payType-comp>
              </div>    
            </div>
          </div> 
          
            <div class="text-right pd-r-30 modal-footer" style="display:block;">
              <div class="disFlex  pd-t-20 align-center mg-b-10">
                <div class="text-right" style="font-size: 18px;font-weight: bold;color: #333;width: calc(85% - 20px);">
                  <p>实付</p>
                  <p style="margin-bottom: 0;">应结</p>
                </div>
                <div  style="margin-left:20px;text-align:right;width:15%;">
                  <p><i class="fa fa-yen mg-r-5"></i>{{payAmount}}</p>
                  <p style="margin-bottom: 0;"><i class="fa fa-yen mg-r-5"></i>{{data.orderAmount}}</p>
                </div>
              </div>
              
                <button class="cancel-btn mg-r-20 mg-t-20" (click)="closeModal()">取消</button>
                <button class="confirm-btn" (click)="confirm()">确定</button>
            </div>
        </div>
       
  `,
  styles:[
  `
    .form-control:focus {
      border: 2px solid #DADFE6 !important;
    }
    .btn{
      padding: 0.75rem 0.35rem;
    }
    thead th {
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
    .table-bordered thead th{
      border-bottom-width: 1px !important;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .table {
      font-size: 14px;
      margin-bottom: 0;
    }
    .mg-b-0{
      margin-bottom:0;
    }
    .mg-r-10{
      margin-right:10px;
    } 
    .mg-r-20{
      margin-right: 20px;
    }
    .mg-l-20{
      margin-left:20px;
    }  
    .mg-b-10{
      margin-bottom:10px;
    } 
    .mg-r-5{
      margin-right:5px;
    } 
    .mg-t-20{
      margin-top:20px;
    } 
    .mg-b-20{
      margin-bottom:20px;
    } 
    .pd-r-20{
      padding-top:20px;
    } 
    .pd-r-30{
      padding-right:30px;
    } 
    .pd-t-20{
      padding-top:20px;
    }
    .text-right{
      text-align: right;
    } 
    .font-bold{
      font-weight: bold;
    } 
    .fz-16{
      font-size: 16px;
    } 
    .fz-14{
      font-size: 14px;
    } 
    
    .mg-l-25{
      margin-left:25px;
    } 
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
    .cancel-btn:focus{
      outline: none;
    }
    
    .confirm-btn{
      background:#03a9f4;
      border: 2px solid#03a9f4;
      color: #fff;
      width: 168px;
      line-height: 48px;
      -moz-border-radius: 8px;
           border-radius: 8px;
      cursor: pointer;
    }
    .confirm-btn:focus{
      outline: none;
    }


    
    .hor-center {
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      -moz-box-pack: center;
      justify-content: center;
    }
    .font-bold{
      font-weight: bold;
    } 
    .text-center{
      text-align: center;
    } 
    table input{
      text-align:center;
    }
    input:focus{
      border:none;
    }

  `
  ]
})

export class OrderPopup implements OnInit,OnDestroy{

  @Input() data:OrderWFCompData;
  @Output() action:any;
  public payAmount:number = 0;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  /**
   * 页面点击事件 计算应收
   */
  changePayAmount(){
    this.payAmount = 0;
    if(this.data.payData.cash){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.cash.toString());
    }
    if(this.data.payData.alipay){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.alipay.toString());
    }
    if(this.data.payData.wechat){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.wechat.toString());
    }
    if(this.data.payData.memberCard){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.memberCard.toString());
    }
    if(this.data.payData.slotCard){
      this.payAmount  = this.payAmount + parseFloat(this.data.payData.slotCard.toString());
    }
    if(this.data.payData.arrears){
      this.payAmount  = this.payAmount + parseFloat(this.data.payData.arrears.toString());
    }
    this.payAmount = AppUtils.roundPoint(this.payAmount,2);
  }

  /**
   * 确认付款
   */
  confirm():void{
    if(this.data.payData.memberCard && !this.checkMemberCardAmount()){
      AppUtils.showWarn("提示","卡扣金额不得超过会员卡余额");
    }
    // else if(!this.checkAmount()){
    //   AppUtils.showWarn("提示","实付与应结金额不符，请检查金额输入");
    // }
    else if((this.data.orderAmount != 0) && this.checkPay()){
      AppUtils.showWarn("提示","请检查金额输入");
    }else{
      if((this.data.orderAmount == 0)
        && !this.data.payData.cash
        && !this.data.payData.alipay
        && !this.data.payData.wechat
        && !this.data.payData.memberCard
        && !this.data.payData.slotCard
        && !this.data.payData.arrears){
        this.data.payData.cash = 0;
      }
      this.action();
      this.closeModal();
    }
  }

  /**
   * 取消 关闭弹框
   */
  closeModal():void{
    this.activeModal.close();
  }

  /**
   * 检查卡扣金额是否相符
   */
  checkMemberCardAmount():boolean{
    if(parseFloat(this.data.payData.memberCard.toString()) > parseFloat(this.data.balance.toString())){
      return false;
    }else{
      return true;
    }
  }

  /**
   * 检查支付金额是否相符
   * @returns {boolean}
   */
  checkAmount():boolean{
    if(parseFloat(this.data.orderAmount.toString()) == this.payAmount){
      return true;
    }else{
      return false;
    }
  }

  /**
   * 检查是否选择支付方式 输入支付金额 true：没有选择支付方式
   * @returns {boolean}
   */
  checkPay():boolean{
    if(!this.data.payData.cash
      && !this.data.payData.alipay
      && !this.data.payData.wechat
      && !this.data.payData.memberCard
      && !this.data.payData.slotCard
      && !this.data.payData.arrears){
      return true;
    }else{
      return false;
    }
  }

}



