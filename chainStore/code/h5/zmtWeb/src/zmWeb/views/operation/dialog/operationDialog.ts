import {Component, Inject} from "@angular/core";

import {AppRouter} from "../../../comModule/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MAT_DIALOG_DATA} from "@angular/material";
/**
 * 新建流程组件
 */
@Component({
  selector:'operationDialog',
template:`
    <div animation-modal>
      <div class="modal-header pd-lr-15 pd-tb-10">
        <h4 class="modal-title"> 新建流程</h4>
        <button class="close" aria-label="Close" (click)="closeModal()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  
      <!--<div class="modal-header pd-lr-15 pd-tb-10">-->
          <!--新建流程-->
      <!--</div>-->
      <div class="modal-body">
        <div *ngIf="buserPermData.isPurchaseAdmin == true" class="operationDialog-btn text-center fz-16 disFlex align-center hor-center" style="background:#4678fa;" (click)="goConsume()">
            <img src="assets/images/operation/icon-operation-1.png" alt="" class="mg-r-10"/>
            开单收银
        </div>
        <div *ngIf="buserPermData.isRechargeAdmin == true" [ngStyle]="{'margin-top':buserPermData.isPurchaseAdmin == true?'20px':'0px'}" class="operationDialog-btn text-center fz-16 disFlex align-center mg-t-20 hor-center"  style="background:#21d9b6;margin-top:20px;" (click)="goRecharge()">
            <img src="assets/images/operation/icon-operation-2.png" alt="" class="mg-r-10"/>
            会员充值
        </div>
    </div>
    </div>
  `,
  styles:[`
    .text-center{
      text-align: center;
    } 
    .fz-16{
      font-size: 16px;
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
    
    .hor-center {
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      -moz-box-pack: center;
      justify-content: center;
    }
    .mg-t-20{
      margin-top:20px;
    } 
    .mg-r-10{
      margin-right:10px;
    }
    .operationDialog-btn{
        width:200px;
        height:45px;
        line-height:45px;
        color:#fff;
        border-radius:6px;
        cursor:pointer;
        margin:0 auto;
    }
  `],
})

export class OperationDialog{
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  public buserPermData = SessionUtil.getInstance().getUserPermData();


  goRecharge(){
    this.closeModal();
    AppRouter.goRecharge(0);
  }

  goConsume(){
    this.closeModal();
    AppRouter.goConsume(0);
  }

  closeModal(){
    this.activeModal.close();
  }

}
