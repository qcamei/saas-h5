// @ 2018/3/1
// <zm_btn_Date [values]="['按钮','按钮']"></zm_btn_Date>
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm_btn_Date',
  template: '<div><button *ngFor="let item of values; let i = index" type="button" class="btn-Date" [class.itemActiveClass]="itemActiveIndex===i"  (click)="btnDate_Click($event,i)">{{values[i]}}</button></div>',
  styles:[`    
    .btn-Date{
      display: inline-block;
      color: #999;
      background-color: #ddd;
      border: none;
      border-right: 1px solid #cccaca;
      height: 30px;
      padding: 0 10px;
      font-size: 14px;
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
    .btn-Date:first-child{
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    .btn-Date:last-child{
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      border-right:none;
    }
    .itemActiveClass{
      color: #fff;
      background-color: #4678fa;
    }
  `]
})
export class ZmBtnDate implements OnInit,OnDestroy {

  itemActiveIndex:number = -1;
  @Input() values = [];
  @Input() name: string;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnDate_Click(e,index){
    this.itemActiveIndex = index;
    this.zmbtnClick.emit();
  }

}
