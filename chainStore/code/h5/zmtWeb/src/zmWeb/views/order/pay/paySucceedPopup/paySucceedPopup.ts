import {Component, OnInit, Output, Inject, Input} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";
import {Popup} from "../../../common/popup/popup";


@Component({
  selector: 'pay-succeed-popup',
  template:
    `
    <div animation-modal>
          <div mat-dialog-title>
            <span class="flex align-center">交易结果</span>
            <i></i>
          </div>
          <div mat-dialog-content>
              <div class="w-100-p" fxLayout="row" fxLayoutAlign="center center">
                <img  src="assets/images/face.png">
              </div>
              <div class="w-100-p  py-8" fxLayout="row" fxLayoutAlign="center center">
               <span class="font-bold font-size-16">交易成功</span>
              </div>
              <div class="w-100-p py-8" fxLayout="row" fxLayoutAlign="center center">
              <span>请于订单列表中查看</span>
              </div>
          </div>
          <div mat-dialog-actions class="mt-20">
              <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
                  
              <zm-btn-md  [stroked] = "true"(click)="goApopoint()" name="预约下次到店"></zm-btn-md>
              <zm-btn-md  [stroked] = "!true"(click)="confirm()" name="确定"></zm-btn-md>
                  
                
              </div>
           </div>
    </div>
    `,
  styleUrls: [],
})

export class PaySucceedPopup implements OnInit {
  @Input() action:any;
  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any){
    this.activeModal = dataInput.modalCtrl;
  }
  ngOnInit(): void {

  }

  /**
   * 取消
   */
  closeModal() {
    this.activeModal.close();
  }
  /**
   * 去预约
   */
  goApopoint(){
    this.action(PaySucceedPopupActionIndex.APPOINT);
    this.closeModal();
  }

  /**
   * 确定离开
   */
  confirm() {
    this.action(PaySucceedPopupActionIndex.EXIT);
    this.closeModal();
  }
}


export enum PaySucceedPopupActionIndex {
  APPOINT = 0,  //去预约
  EXIT = 1,   //退出
}
