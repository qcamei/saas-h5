import {Component, Input, OnInit} from "@angular/core";
//  <zmbUser-info [imgUrl]="" [name]="" [sex]="" [phone]=""></zmbUser-info>
@Component({
  selector:'zmbUser-info',
  template: `

  <div style="width:100%;padding:0 10px;">
     <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" style="padding:10px 0;border-bottom:1px solid #e0e0e0; font-size:14px;">
          <div zmk-img-circle>
            <img w-100 h-100 [src]="imgUrl">
          </div>
          <div fxLayout="column" fxLayoutAlign="space-between start" fxLayoutGap="10px" style="padding:5px 0;">
              <div  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
                  <span>{{name}}</span>
                  <span *ngIf="sex"><img src="assets/img/sex-wumen.png" ></span>
                  <span *ngIf="!sex"><img src="assets/img/sex-man.png" ></span>
              </div>
              <div style="color:#999;">
                {{phone}}
              </div>
              
          </div>
      
     </div>
  </div>
            `
})

// assets/img/avatar.jpeg
export class ZmbUserInfo implements OnInit{

  @Input() name:string;
  @Input() imgUrl:string;
  @Input() sex:boolean=true;
  @Input() phone:any;

  constructor(){ }

  ngOnInit(){

  }

}


