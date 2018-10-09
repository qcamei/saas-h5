
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";


// @ 2018/3/1
// <zm-btn-icon title="按钮" imgSrc="imgSrc" (zmbtnClick)="click()"></zm-btn-new>
@Component({
  selector:'zm-btn-item-push',
  template: `
              <button ion-item (click)="btnClick()" style="border-bottom:1px solid #F7F5F5;">
                  <ion-icon style="transform: scale(0.6);" item-left color="primary" [name]="icon" ></ion-icon>
                   <span>{{title}}</span>
              </button>
              
              `,
  styles:[`

`]
})
export class ZmBtnItemPush implements OnInit,OnDestroy {

  @Input() title: string = "我的预约";
  @Input() icon: string;
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
