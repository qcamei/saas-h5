/**
 * Created by Orange on 2018/6/26.
 */

import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector:'zm-list-item',
  template: `
            
      <div (click) = "infoClick()" >
         <div w-100 style="padding:20px 16px; font-size:16px;" fxLayout="row" fxLayoutAlign="space-between center" >
             <div class="title">{{listTitle}}</div>
             <div class="value">{{listValue}}</div>
         </div>
         <div class="lineView"></div>
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

export class ListItem implements OnInit,OnDestroy {

  @Input() listTitle: string = "";
  @Input() listValue: string = "";
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
