import {Component, Input, Inject} from '@angular/core';

import {MAT_DIALOG_DATA} from "@angular/material";



@Component({
  selector: 'pay_record_popup',
  template: `
    <div animation-modal>
            <h2 mat-dialog-title>
               {{title}}
            </h2>
            <mat-dialog-content>
                     <h4 [innerHTML]="setContent"></h4>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md [stroked]="true" *ngIf="btnText" (click)="closeModal()" [name]="btnText"></zm-btn-md>
                 <zm-btn-md  (click)="closeModal()" [name]="confirmBtn"></zm-btn-md>
            </mat-dialog-actions>
      </div>
      

    <!--<div animation-modal>-->
      <!--<div class="modal-header">-->
        <!--<span class="font-bold">{{title}}</span>-->
        <!--<button class="close" aria-label="Close" (click)="closeModal()">-->
          <!--<span aria-hidden="true">&times;</span>-->
        <!--</button>-->
      <!--</div>-->
      <!--<div class="modal-body">-->
          <!--<h4 [innerHTML]="setContent"></h4>-->
        <!--</div>-->
      <!--<div class="modal-footer">-->
        <!--<button class="btn c-close-btn-modal btn c-md-btn-modal" *ngIf="btnText" (click)="closeModal()">{{btnText}}</button>-->
        <!--<button class="btn c-md-btn-modal c-btn-blue" (click)="closeModal()">{{confirmBtn}}</button>-->
      <!--</div>-->
    <!--</div>-->
  `,
  styleUrls:['./popup.scss']
})
export class setPopup{

  @Input() btnText:string;
  @Input() confirmBtn:string;
  @Input() title:string;
  @Input() setContent:any;

  private activeModal:any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }


  closeModal() {
    this.activeModal.close();
  }



}
