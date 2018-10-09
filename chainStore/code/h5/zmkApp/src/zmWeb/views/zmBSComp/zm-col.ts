import {Component, OnInit, Input} from "@angular/core";

@Component({
  selector: 'zm-col',
  template: `
                <ion-col style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center">
                      <span>{{title}}</span>
                      <span *ngIf="isMoney">￥{{value}}</span>
                      <span *ngIf="!isMoney">{{value}}</span>
                </ion-col>
               
            `
})


export class ZmCol implements OnInit {
  @Input() title:string;
  @Input() value:string;
  @Input() isMoney:boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}



