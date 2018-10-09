// @ 2018/3/2
// <zm_btn_small [name]="按钮"></zm_btn_small>

import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm_btn_small',
  template: '<button type="button" class="btn-small" (click)="btnSmall_Click()">{{name}}</button>',
  styles:[`
    .btn-small{
      color: #fff;
      background: #4678fa;
      border: none;
      border-radius:6px;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      font-size: 14px;
      cursor: pointer;
      outline: none;
    }
  `]
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
  btnSmall_Click(){
    this.zmbtnClick.emit();
  }

}
