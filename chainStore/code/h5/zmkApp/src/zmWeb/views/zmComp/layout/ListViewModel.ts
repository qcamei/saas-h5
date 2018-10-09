/**
 * Created by Orange on 2018/6/26.
 */

import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector:'zm-list-item',
  template: `
            
<div class="listItem" (click) = "infoClick()">
            <div class="title">{{listTitle}}</div>
            
            <div class="value">{{listValue}}</div>
            
            <div class="state" *ngIf="listState !=8 && listState == 1" style="color: darkred">未支付</div>
            <div class="state" *ngIf="listState !=8 && listState == 2">已支付</div>
            
            <div class="lineView"></div>
</div>
              
              `,
  styles:[`

.listItem{
top: 100px;
width: 100%;
height: 60px;
background-color: white;
color:#414141;
font-size: 16px;

}

.listItem .title{
width: 200px;
height: 60px;
padding-top: 20px;
padding-left: 20px;
float: left;
}

.listItem .value{
width: 120px;
height: 60px;
float: right;
text-align:right;
padding-top: 20px;
margin-right: 20px;
/*left: 120px;*/
}

.listItem .state{
width: 60px;
height: 60px;
float: right;
font-size: 12px;
color: #a8a8a8;
/*margin-right: 0px;*/
 padding-top: 22px;
/*background-color:#f3f3f3;*/

}

.listItem .lineView{
width: 95%;
height: 1px;
float: right;
/*margin-top: 1px;*/
background-color: #f3f3f3;
}



`]
})

export class ListViewModel implements OnInit,OnDestroy {

  @Input() listTitle: string = "姓名";
  @Input() listValue: string = "一星辰一";
  @Input() listState: number = 8;
  @Output() infoListItemClick:EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }

  infoClick(){

    this.infoListItemClick.emit();

  }


}
