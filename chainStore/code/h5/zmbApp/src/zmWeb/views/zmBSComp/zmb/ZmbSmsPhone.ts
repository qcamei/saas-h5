import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
//  <zmbSms-phone [startActive]="true" [showStar]="true" (zmbtnClick)="zmClick()"></zmbSms-phone>
@Component({
  selector:'zmbSms-phone',
  template: `

   <div style="width:100%;padding:10px;font-size:14px;">
     <div fxLayout="row" fxLayoutAlign="start center" >
           <div (click)="zmClick(0)" fxFlex="1 1" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="5px"><img src="assets/img/duanxin.png"><span>短信</span></div>
           <div (click)="zmClick(1)" fxFlex="1 1" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="5px"><img src="assets/img/phone.png"><span>电话</span></div>
           <div *ngIf="showStar" (click)="zmClick(2)"  fxFlex="1 1" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="5px">
               <img *ngIf="startActive" src="assets/img/ic_vip.png">
               <img *ngIf="!startActive" src="assets/img/ic_vip2.png">
               <span *ngIf="startActive" >已标星</span>
               <span *ngIf="!startActive">标星</span>
           </div>
      
     </div>
  </div>
            `
})

// assets/img/avatar.jpeg
export class ZmbSmsPhone implements OnInit{

  @Input() startActive:boolean=true;
  @Input() showStar:boolean=false;

  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();
  constructor(){ }

  zmClick(n){

    this.zmbtnClick.emit(n);
  }

  ngOnInit(){

  }

}


