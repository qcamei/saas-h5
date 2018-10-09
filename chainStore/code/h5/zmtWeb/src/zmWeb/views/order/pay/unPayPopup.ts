import {Component, OnInit, OnDestroy, Output, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'unpay-popup',
  template: `
    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-weight-bold">提示</div>
      </div>
      <div mat-dialog-content>
        <p class="text-center text-bold">确定要离开收款页面？</p>
        <p class="text-center">离开后可在【开单列表】或【订单列表】<br>中继续完成收款。</p>
      </div>
      <div mat-dialog-actions fxLayout="row" fxLayoutAlign="end" class="mt-20" fxLayoutGap="20px">

        <zm-btn-md  [stroked] = "true"(click)="cancel()" name="继续收款"></zm-btn-md>
        <zm-btn-md  [stroked] = "!true"(click)="confirm()" name="确定"></zm-btn-md>
      
      </div>
    </div>
`,
  styles: [`
 
  `]
})
export class UnPayPopup implements OnInit ,OnDestroy{

  @Output() action:any;
  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {

  }

  ngOnDestroy(){

  }

  /**
   * 关闭
   */
  closeModal(){
    this.action(false);
    this.activeModal.close();
  }

  /**
   * 取消
   */
  cancel(){
    this.action(false);
    this.activeModal.close();
  }

  /**
   * 确定
   */
  confirm(){
    this.action(true);
    this.activeModal.close();
  }

}

