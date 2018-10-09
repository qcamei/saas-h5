import {Component, Output, Inject} from '@angular/core';

import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'cancel-bill-popup',
  template: `
  <!--选择产品-->


<div animation-modal>
    <div mat-dialog-title>
      <div class="text-bold">流程作废</div>
    </div>

    <div mat-dialog-content>
         <div class="message-box warning" style="margin-bottom: 20px;">该流程作废后将无法继续进行相关操作。</div>
          <zm-input-text label="作废原因" [placeholder]="'请填写作废原因(选填)'"  
                              [maxlength]="50"  [(zmValue)]="reason" ></zm-input-text>
    </div>

    <div mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <zm-btn-md stroked="true" name="取消" (zmbtnClick)="cancel()"></zm-btn-md>
        <zm-btn-md name="确认作废" (zmbtnClick)="confirm()"></zm-btn-md>
    </div>
</div>



`,
  styles: [`

  .title{
    margin-left: 5px;
  }

  .image{
    display: inline-block;
    width:20px;
    height:20px;
    background:url(../../../../assets/images/aution.png) no-repeat;
    background-size: contain;
    margin-left:22px; 
  }

  .font-bold{
    font-weight:bold;
  }
  .confirm_btn{

    background:#03a9f4;
    border: 2px solid#03a9f4;
    color: #fff;
    width: 168px;
    line-height: 48px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    cursor: pointer;

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
  .text-left{
      text-align:left;
  }
  .font-bold{
      font-weight:bold;
  }
  button:focus{
    box-shadow: none;
  }
  `],


})
export class CancelBillPopup {

  @Output() action:any;
  public reason:string;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) dataInput:any,) {
    this.activeModal = dataInput.modalCtrl;
  }

  /**
   * 取消
   */
  cancel(){
    this.activeModal.close();
  }

  /**
   * 确定
   */
  confirm(){
    this.action(this.reason);
    this.activeModal.close();
  }

}




