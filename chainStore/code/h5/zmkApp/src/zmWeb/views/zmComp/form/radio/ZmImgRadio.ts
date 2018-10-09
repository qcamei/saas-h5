import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 *
 <zm-img-radio [trackType]="true" [label]="label" (zmClick)="zmClick()"] ></zm-img-radio>
 */

@Component({
  selector: 'zm-img-radio',
  template: `
   <div  w-100 style="padding:10px 10px;" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
        <img (click)="radioClick()" *ngIf="trackType" style="width:15px;" src="assets/img/succes_on.png" >
        <img (click)="radioClick()" *ngIf="!trackType" style="width:15px;"  src="assets/img/succes.png">
        <div (click)="radioClick()">{{label}}</div>
   </div>
            `,

})

export class ZmImgRadio {
  constructor() {
  }

  /**
   * zmValue 双向绑定
   */
  @Output() zmClick = new EventEmitter();

  @Input() label: string;
  @Input() trackType: boolean = false;//OrderTrackTypeEnum

  radioClick() {
    this.zmClick.emit();
  }

}


