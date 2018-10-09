import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm_btn_search',
  template: '<button type="button" class="btn-search" (click)="btnSearch_Click()">{{name}}</button>',
  styles:[`
    .btn-search{
      display: inline-block;
      color: #fff;
      background-color: #4678fa;
      border:none;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      height: 30px;
      padding: 0 15px;
      font-size: 14px;
      margin-left: -5px;
      cursor: pointer;
      outline: none;;
      line-height:1.5;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      /*文本不能被選擇*/
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      outline: none;
    }
  `]
})
export class ZmBtnSearch implements OnInit,OnDestroy {

  @Input() name: string;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnSearch_Click(){
    this.zmbtnClick.emit();
  }

}
