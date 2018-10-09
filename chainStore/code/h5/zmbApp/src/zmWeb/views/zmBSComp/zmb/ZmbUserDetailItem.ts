
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector:'zmb-user-detail-item',
  template: `
            
      <div (click) = "itemClick()" >
         <div w-100 style="padding:20px 16px; font-size:16px;" fxLayout="row" fxLayoutAlign="space-between center" >
             <div class="title">{{title}}</div>
              <div class="value">{{value}}</div>
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

export class ZmbUserDetailItem implements OnInit,OnDestroy {

  @Input() title: string = "";
  @Input() value: string = "";
  @Output() onItemClick:EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }

  itemClick(){
    this.onItemClick.emit();
  }


}
