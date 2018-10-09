import {Component, OnInit, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'shipMents-comp',
  template: `

    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-weight-bold">填写发货信息</div>
      </div>
      <div mat-dialog-content>
        <!---->
        <div class="form-group " fxLayout="row wrap" fxLayoutGap="20px" fxLayoutAlign="start center">
          <label style="margin-bottom: 0;"><span class="font-c3"> *</span>快递公司</label>
          <input type="text" placeholder="请输入分类名称" [ngClass]="{'form-valid-error':company.invalid && (company.touched)}"
                 name="company" class="mg-l-10 form-control " required #company
                 pattern="^\\s*([\u4E00-\u9FA5A-Za-z0-9-_ ]{1,10})\\s*$" maxlength="10">
        </div>
        <div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">
          <div class="font-c3 fz-12" *ngIf="company.invalid && (company.touched)">
            <div *ngIf="company.errors.required">
              快递名称不能为空
            </div>
            <div *ngIf="company.errors.pattern">
              仅限文字/字母或数字
            </div>
          </div>
        </div>

        <div class="form-group " fxLayout="row wrap" fxLayoutGap="20px" fxLayoutAlign="start center">
          <label style="margin-bottom: 0;"><span class="font-c3"> *</span>快递单号</label>
          <input type="text" placeholder="请输入分类名称"
                 [ngClass]="{'form-valid-error':courierNum.invalid && (courierNum.touched)}" name="courierNum"
                 class="mg-l-10 form-control " required #courierNum
                 pattern="^\\s*([Za-z0-9-_ ]{1,20})\\s*$" maxlength="20">
        </div>
        <div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">
          <div class="font-c3 fz-12" *ngIf="courierNum.invalid && (courierNum.touched)">
            <div *ngIf="courierNum.errors.required">
              快递单号不能为空
            </div>
            <div *ngIf="courierNum.errors.pattern">
              仅限数字/字母
            </div>
          </div>
        </div>
        <!---->


      </div>
      <mat-dialog-actions class="mt-8" fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <zm-btn [stroked]="true" (click)="doCancel()" name="取消"></zm-btn>
        <zm-btn (click)="doOk(company,courierNum)" name="确定"></zm-btn>
        <!---->
      </mat-dialog-actions>

    </div>
  `,
  styles: [`
    .form-valid-error {
      border: 2px solid #FF4c6a !important;
    }

    .form-control {
      padding: 0.75rem 0.75rem;
      border: 2px solid #ced4da;
    }

    .font-c3 {
      color: #FF4c6a;
    }

    .mg-l-10 {
      margin-left: 10px;
    }

    .fz-12 {
      font-size: 12px;
    }

    .form-control:focus {
      box-shadow: none;
    }
  `]
})
export class ShipmentsComp implements OnInit {

  private activeModal: any;
  private orderId: string;//订单id
  @Output() action: (orderId: string, company: string, courierNum: string) => void;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput: any) {
    this.activeModal = dataInput.modalCtrl;
    this.orderId = this.dataInput.modalData.orderId
    this.action = dataInput.callBack;
  }

  ngOnInit() {

  }

  /**
   * 确定
   * @param {HTMLInputElement} company 公司名称
   * @param {HTMLInputElement} courierNum 快递单号
   */
  doOk(company: HTMLInputElement, courierNum: HTMLInputElement) {
    this.activeModal.close();
    this.action(this.orderId, company.value, courierNum.value);//回调
  }

  /**
   * 取消
   */
  doCancel() {
    this.activeModal.close();
  }

}
