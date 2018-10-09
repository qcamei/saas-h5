import {Component, Input, Output, EventEmitter,} from "@angular/core";

@Component({
  selector:'zmk-goods-search-header',
  template:
    `
    <ion-header>
        <ion-navbar>
         <ion-buttons >
            <button start ion-button (click)="cancel()">
              <ion-icon name="arrow-back"></ion-icon>
              返回
            </button>
          </ion-buttons>
          <ion-title>
            <strong>{{title}}</strong>
          </ion-title>
        </ion-navbar>
      </ion-header>
   `,
  styles:[
    `


  `
  ]
})
export class ZmkGoodsSearch{
  @Input() title:string;
  @Output() back:EventEmitter<null> = new EventEmitter<null>();
  constructor(){}

  cancel(){
    this.back.emit();
  }
}
