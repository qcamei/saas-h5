
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";


// @ 2018/3/1
// <zm-btn-new [name]="按钮" (zmbtnClick)="click()"></zm-btn-new>
@Component({
  selector:'zm-btn-new',
  template: `
      <ion-item no-lines>
          <button  ion-button color="new" block (click)="btnNewClick()">{{name}}</button>
      </ion-item>
  `,
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
  btnNewClick(){
    this.zmbtnClick.emit();
  }

}
