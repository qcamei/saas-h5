import {Component, OnInit, Input, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'chargeback_reason',
  template: `
    <div animation-modal>
      <div mat-dialog-title>
        <div class="font-bold">退单原因</div>
      </div>
      <div mat-dialog-content>
          <div style="padding:2px;max-height:200px;min-height:100px;border:1px solid #e9ecef;border-radius:5px;">{{reason}}</div>
      </div>
      <div mat-dialog-actions fxLayout="row" fxLayoutAlign="end">
        <zm-btn-md name="返回" (zmbtnClick)="closeModal()"></zm-btn-md>
      </div>
    </div>
`,
  styles: [`
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
  `]
})
export class ChargebackReasonComp implements OnInit {

  @Input() reason;


  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
    if(!this.reason){
      this.reason ="";
    }
  }

  // 关闭模态框
  closeModal(){
    this.activeModal.close();
  }



}

