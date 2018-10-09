import { Component,Input,} from "@angular/core";

@Component({
  selector:'view-header-comp',
  template:
  `
	<div class="align-center disFlex pd-lr-30" style="height:60px;border-bottom: 1px solid #ebeef2;background-color: #fff;border-top-left-radius: 4px;border-top-right-radius: 4px;">
	  	<span class="fz-18 font-bold cur-hand" (click)="back(0)">{{headerArr[0]}}</span>
	  	<span class="mg-lr-10" *ngIf="headerArr.length>1">></span>
	  	<span class="fz-16 cur-hand" (click)="back(1)">{{headerArr[1]}}</span>
	  	<span class="mg-lr-10" *ngIf="headerArr.length>2">></span>
	  	<span class="fz-16 cur-hand">{{headerArr[2]}}</span>
	</div>
   `
})
export class ViewHeader{
    @Input() headerArr = [];

    constructor(){}
    back(index):void{
   	if(this.headerArr.length>index+1){
   		history.back();
   	}
   }
}
