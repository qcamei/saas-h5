/**
 * Created by Orange on 2018/6/26.
 *
 * <zm-workFlow-title [title]="'选择客户'" [required]="true" [showBorder]="true" (zmWorkFlowClick)=""></zm-workFlow-title>
 *
 *
 */

import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector:'zm-workFlow-title',
  template: `
            
      <div (click) = "infoClick()" >
         <div w-100 style="padding:10px 10px; font-size:14px;" fxLayout="row" fxLayoutAlign="space-between center" >
             <div>{{title}}<span *ngIf="required" style="color:red;">*</span></div>
             <ion-icon ios="ios-arrow-forward" style="color:#999999;"></ion-icon>
         </div>
         <div *ngIf="showBorder" class="lineView"></div>
      </div>
              
              `,
  styles:[`

    .lineView{
      width: 95%;
      height: 1px;
      background-color: #f3f3f3;
      margin:0 auto;
    }

`]
})

export class WorkFlowTitle implements OnInit,OnDestroy {

  @Input() title: string = "";
  @Input() required: boolean = false;
  @Input() showBorder: boolean = true;
  @Output() zmWorkFlowClick:EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }

  infoClick(){
    this.zmWorkFlowClick.emit();

  }


}
