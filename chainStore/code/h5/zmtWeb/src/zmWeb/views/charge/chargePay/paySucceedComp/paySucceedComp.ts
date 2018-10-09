import {Component, OnInit,Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'paySucceed-comp',
  template: `
    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-weight-bold">支付成功</div>
      </div>
      <div mat-dialog-content>
        
         <div class="w-100-p mb-20" fxLayout="row" fxLayoutAlign="center center">
         <img  src="assets/images/face.png">
       </div>
         <p class="text-center mb-0">
          到期时间 ：2020/12/10
         </p>
         <p class="text-center text-bold mb-0">
          实付款 ：￥20000.20
         </p>
        
      </div>
      <mat-dialog-actions class="mt-8" fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <zm-btn  [stroked]="true" (click)="succeed()" name="确定"></zm-btn>
      
     </mat-dialog-actions>

    </div>
`,
  styles: [`

  `]
})
export class PaySucceedComp implements OnInit {

  private activeModal: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
  
}

// 确定
succeed() {
    this.activeModal.close();
  }


}