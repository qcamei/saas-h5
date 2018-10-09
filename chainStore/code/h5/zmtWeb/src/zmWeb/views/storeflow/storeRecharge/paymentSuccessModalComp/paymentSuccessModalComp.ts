

import {Component, Input, Output, Inject} from '@angular/core';

import {Router} from '@angular/router';
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 支付成功模态框
 */
@Component({
  selector:'final_comp',
  template:` 
            <div animation-modal>
               <div class="modal-header">
                    <h4 class="modal-title">结算单</h4>
                    <!--<button type="button" class="close" aria-label="Close" (click)="closeModal()">-->
                      <!--<span aria-hidden="true">&times;</span>-->
                    <!--</button>-->
                </div>
                <div class="modal-body" style="padding-top: 30px;">
                    <div class="c-modal-first text-center">
                      <img src="assets/images/account.png" alt="">
                      <h4 class="mg-t-15 font-bold" style="font-size: 30px;color: #000;" >结算成功</h4>
                    </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn cur-hand c-btn-modal c-close-btn-modal"  style="margin-right: 20px;" (click)="toOrder()">查看订单</button>
                  <button type="button" class="btn cur-hand c-btn-blue c-btn-modal" (click)="toSelf()">确定</button>
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
  .c-btn-modal{
    width: 168px;
    padding: 12px 0 !important;
    outline: none;
  }
  .font-bold{
    font-weight:bold;;
  }
  .mg-t-15{
    margin-top:15px;
  }
  .modal-title{
    font-size: 18px;
    font-weight: bold !important;
    color: #333 !important;
  }
  .text-center {
    text-align: center;
  }

  `]
})
export class paymentSuccessModalComp {
  @Input() data: UrlObj;
  @Output() action:any;

  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any,private router:Router,) {
    this.activeModal = dataInput.modalCtrl;
  }

  closeModal() {
    this.activeModal.close();
  }

  toOrder():void{
      this.closeModal();
      this.router.navigate([this.data.url1]);
  }
  toSelf():void {
    this.closeModal();
    //window.location.reload();
    //this.router.navigate([this.data.url2]);
    this.action(null);

  }
}

export class UrlObj{
  url1:string;
  url2: string;
}
