// @ 2018/3/1
// <zm_btn_new [name]="按钮"></zm_btn_new>
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm_btn_new',
  template: '<button type="button" class="btn-new" (click)="btnNew_Click()">{{name}}</button>',
  styles:[`
    .btn-new{
      color: #fff;
      background: #73ca6d;
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
export class ZmBtnNew implements OnInit,OnDestroy {

  @Input() name: string;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnNew_Click(){
    this.zmbtnClick.emit();
  }

}
