// @ 2018/3/2
// <zm-btn-small [name]="按钮" (zmbtnClick)="click()"></zm-btn-small>

import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm-btn-small',
  template: '<button  ion-button color="secondary" small (click)="btnSmallClick()">{{name}}</button>',
})
export class ZmBtnSmall implements OnInit,OnDestroy {

  @Input() name: string; //按钮名称
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnSmallClick(){
    this.zmbtnClick.emit();
  }

}
