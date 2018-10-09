
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";


// @ 2018/3/1
// <zm-btn-icon title="按钮" imgSrc="imgSrc" (zmbtnClick)="click()"></zm-btn-new>
@Component({
  selector:'zm-btn-count',
  template: `
              
              <div class="countbtn" (click)="btnClick()">
                  <div class="title">{{title}}</div>
                  <div class="value">{{value}}</div>
              </div>
              
              `,
  styles:[`
    .countbtn{
          width:100%;
          height:25px;
          text-align: center;
          color:white;
          font-size: 10px;
    }
    
    .countbtn .title{
          height: 25px
    }
    .countbtn .value{
          height: 25px;
          padding-top:3px;
          font-size: 8px;
    }
`]
})
export class ZmBtnCount implements OnInit,OnDestroy {

  @Input() title: string = "今日预约";
  @Input() value: string = "21";
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnClick(){
    this.zmbtnClick.emit();
  }

}
