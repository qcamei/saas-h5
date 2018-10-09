import {Component, Input, Inject} from '@angular/core';

import {AppRouter} from "../../../comModule/AppRouter";
import {MAT_DIALOG_DATA} from "@angular/material";

/**导入成功模态框**/


@Component({
  selector: 'import_success_popup',
  template: `
    <div animation-modal>
            <h2 mat-dialog-title>
               导入成功
            </h2>
            <mat-dialog-content>
                        <h4 [innerHTML]="setContent"></h4>
                        <h6 [innerHTML]="tips"></h6>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md [stroked]="true" (click)="closeModal()" name="确定"></zm-btn-md>
                  <zm-btn-md  (click)="showList()" name="查看"></zm-btn-md>
            </mat-dialog-actions>
      </div>
      
      

    <!--<div animation-modal>-->
    <!--<div class="modal-header">-->
      <!--<span class="font-bold">导入成功</span>-->
      <!--<button class="close" aria-label="Close" (click)="closeModal()">-->
        <!--<span aria-hidden="true">&times;</span>-->
      <!--</button>-->
    <!--</div>-->
    <!--<div class="modal-body">-->
        <!--<h4 [innerHTML]="setContent"></h4>-->
        <!--<h6 [innerHTML]="tips"></h6>-->
      <!--</div>-->
    <!--<div class="modal-footer">-->
      <!--<button class="btn c-close-btn-modal btn c-md-btn-modal" (click)="closeModal()">确定</button>-->
      <!--<button notRepeatSubmit class="btn c-md-btn-modal c-btn-blue" (submit)="showList()">查看{{section}}</button>-->
    <!--</div>-->
    <!--</div>-->
  `,
  styleUrls:['./popup.scss']
})
export class ImportSuccessPopup{

  @Input() setContent:any;
  @Input() tips:any;
  @Input() section:string;


  private activeModal:any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }


  closeModal(){
    this.activeModal.close();
  }


  public async showList() {
    this.activeModal.close();

    if(this.section == "商品"){
      AppRouter.goStoreGoodsList();
    }else if(this.section == "项目"){
      AppRouter.goProductInfoList();
    }else if(this.section == "会员"){
      AppRouter.goFindLeaguer();
    }
  }



}
