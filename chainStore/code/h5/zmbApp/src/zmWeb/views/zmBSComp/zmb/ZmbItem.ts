import {Component, Input, OnInit} from "@angular/core";
//  <zmbItem [imgUrl]="" [name]="" [itemTag]="" [count]="number"></zmbItem>
@Component({
  selector:'zmbItem',
  template: `

  <div style="width:100%;padding:0 10px;">
     <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px" style="padding:10px 10px;background:#f4f4f4; font-size:12px;">
          <div zmk-img-rect-small>
            <img w-100 h-100 [src]="imgUrl">
          </div>
          <div fxLayout="column" fxLayoutAlign="space-between start" style="width:79%;height:100%;" fxLayoutGap="5px">
              
              <div fxLayout="column" w-100 fxLayoutAlign="start start" fxLayoutGap="2px">
                <span style="width:50%;" overflow-hidden-1>{{name}}</span>
                <span *ngIf="price" theme-border theme-color >{{itemTag}}</span>
              </div>
              <div w-100 fxLayout="row" fxLayoutAlign="space-between center" >
               <span style="width:50%;" *ngIf="price">￥{{price}}</span>
               <span theme-border theme-color *ngIf="!price" >{{itemTag}}</span>
                <div style="color:#999">x{{count}}</div>
              </div>
              
          </div>
      
     </div>
  </div>
            `
})

// assets/img/avatar.jpeg
export class ZmbItem implements OnInit{

  @Input() name:string;
  @Input() imgUrl:string;
  @Input() itemTag:string;
  @Input() count:any=1;
  @Input() price:number;
  constructor(){ }

  ngOnInit(){

  }

}


