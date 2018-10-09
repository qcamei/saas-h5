import {Component, Input, OnInit,} from "@angular/core";

@Component({
  selector:'view-header-comp',
  template:
  `
	  	<span class="fz-18 font-bold cur-hand" (click)="back(0)" style="color:#03a9f4">{{headerArr[0]}}</span>
	  	<span class="mg-lr-10" *ngIf="headerArr.length>1">></span>
	  	<span class="fz-16" [style.cursor]="curHand" (click)="back(1)"  style="color:#03a9f4">{{headerArr[1]}}</span>
	  	<span class="mg-lr-10" *ngIf="headerArr.length>2">></span>
	  	<span class="fz-16">{{headerArr[2]}}</span>
   `,
  styles:[`
    .align-center{
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    } 
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .pd-lr-30{
      padding-left:30px;
      padding-right:30px;
    } 
    .fz-18{
      font-size:18px;
    } 
    .font-bold{
      font-weight: bold;
    } 
    .cur-hand{
      cursor: pointer;
    } 
    .mg-lr-10{
      margin-left:10px;
      margin-right:10px;
    } 
    .fz-16{
      font-size: 16px;
    }
  `]
})
export class ViewHeader implements OnInit{
    public curHand = "Default";
    @Input() headerArr = [];
    constructor(){}

    ngOnInit(){
      if(this.headerArr.length>2){
        this.curHand = "pointer";
      }else{
        this.curHand = "Default";
      }
    }

    back(index):void{
      if(this.headerArr.length>index+1){
        history.back();
      }
    };

}
