import {Component, Input, Output, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 还款成功模态框
 */
@Component({
  selector:'pay-success-popup',
  template:` 
      <div>
            <h2 mat-dialog-title>
               还款
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                     <div class="disFlex" style="color: #333;">
                            <p style="font-size:18px;">已还款<span class="mg-lr-10 font-bold">:<i class="fa fa-yen mg-r-5 ml-8"></i>{{data.payment |number:'1.2-2'}}</span></p>
                            <p style="font-size:18px;" class="mg-l-30">当前尚欠款<span class="mg-lr-10 font-bold">:<i class="fa fa-yen mg-r-5 ml-8"></i>{{data.balanceDue |number:'1.2-2'}}</span></p>
                    </div>
                    <div class="c-modal-first text-center">
                            <img src="assets/images/account.png" alt="">
                            <h4 class="mg-t-15 font-bold" style="font-size: 30px;color: #000;" >还款成功</h4>
                    </div>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end">
                  <zm-btn-md  (click)="confirm()" name="确定"></zm-btn-md>
            </mat-dialog-actions>
      </div>
              `,
  styleUrls: ["modal.scss"]
})
export class PaySuccessPopup{

  @Input() data:PaySuccessPopupViewData;
  @Output() action:any;

  private activeModal: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }
  confirm(){
    this.action();
    this.activeModal.close();
  }

}

export class PaySuccessPopupViewData{
  public payment:number;//已还
  public balanceDue:number;//剩余

  public static newInstance(paymentP,balanceDueP):PaySuccessPopupViewData{
    let paySuccessPopupViewData = new PaySuccessPopupViewData();
    paySuccessPopupViewData.payment = paymentP;
    paySuccessPopupViewData.balanceDue = balanceDueP;
    return paySuccessPopupViewData;
  }
}
