import {Component, OnInit,Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'paySucceed-comp',
  template: `
    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-weight-bold">会员过期</div>
      </div>
      <div mat-dialog-content>
        
         <div class="w-100-p mb-20" fxLayout="row" fxLayoutAlign="center center">
            <img style="width:100px;" src="assets/images/aution.png">
         </div>
         <p class="text-center mb-0">
          会员服务已过期，请续费
         </p>
       
        
      </div>
      <mat-dialog-actions class="mt-8" fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <zm-btn  [stroked]="true" (click)="succeed()" name="续费"></zm-btn>
      
     </mat-dialog-actions>

    </div>
`,
  styles: [`

  `]
})
export class MembersExpired implements OnInit {

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