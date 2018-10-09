
import {Output, Component, EventEmitter, Input} from "@angular/core";


// @ 2018/3/1
// <zm-btn-sub [name]="按钮" (zmbtnClick)="click()"></zm-btn-sub>
@Component({
  selector:'zm-btn-sub',
  template: `
      <div style="background:#fff;padding:5px 15px 0 15px;">
        <button *ngIf="!outline" ion-button block (click)="btnClick()">{{name}}</button>
        <button *ngIf="outline" ion-button block outline (click)="btnClick()">{{name}}</button>
      </div>
  `,
})
export class ZmBtnSubmit{

  @Input() name: string;
  @Input() outline: boolean=false;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }

  btnClick(){
    this.zmbtnClick.emit();
  }

}
