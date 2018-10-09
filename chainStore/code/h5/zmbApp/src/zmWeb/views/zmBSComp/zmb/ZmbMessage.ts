import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MessageVD} from "../../message/messageList/messageList.page";

//  <zmbMessage-info ></zmbMessage-info>
@Component({
  selector:'zmbMessage-info',
  template: `
      <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px" style="border-bottom:1px solid #f4f4f4;padding:10px 15px;" (click)="itemClick()">
        <span><img src="{{item.imgUrl}}"></span>
        <div  fxLayout="column" fxLayoutAlign="space-between start">
          <div w-100  fxLayout="row" fxLayoutAlign="space-between center"><b>{{item.title}}</b><span style="color:#999">{{item.message.createdTime | times}}</span></div>
          <div overflow-hidden-2 style="color:#999;"><span style="margin-right:5px;">[{{item.message.storeName}}]</span><span>{{item.message.messageBody}}</span></div>
        </div>
      </div>
      <div ></div>
            `
})

// assets/img/avatar.jpeg
export class ZmbMessage implements OnInit{

  @Input() item: MessageVD = new MessageVD();

  @Output() onItemClick = new EventEmitter();

  constructor(){

  }

  ngOnInit(){

  }

  itemClick(){
    this.onItemClick.emit(this.item.message);
  }

}


