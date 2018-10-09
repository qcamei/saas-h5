import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
//  <zmk-address [storeName]="" [phone]="" [address]=""></zmk-address>
@Component({
  selector:'zmk-address',
  template: `

 
   <ion-row > 
      <div  fxLayout="row" fxLayoutAlign="start center" w-100 style="padding:0 10px 10px 10px;">
      <!--  <ion-icon name="pin" style="font-size:24px;"></ion-icon>-->
        <div  fxLayout="column" fxLayoutGap="5px"style="width:100%;" >
          <div fxLayout="row">
            <div fxLayout="row" fxLayoutAlign="space-between center" fxFlex="1 1">
              <span>{{storeName}}</span>
              <span> {{phone}}</span>
            </div>
          </div>
          <div  fxLayout="row" fxLayoutAlign="space-between center">
            <div  fxFlex="1 1 90%" overflow-hidden-2 >{{area}}</div>
          </div>
         <!--   <div *ngIf="showArrows" (click)="goAddress()" fxLayout="row" fxLayoutAlign="space-between center">
            <div *ngIf="area" fxFlex="1 1 90%">{{area}}</div>
            <div *ngIf="!area" fxFlex="1 1 90%">请选择地址</div>
            <ion-icon name="arrow-forward"></ion-icon>
          </div>
        <span *ngIf="address">{{area+address}}</span>-->
        </div>
      </div>
   </ion-row>


            `
})


export class ZmkAddress implements OnInit{

  @Input() storeName:string;
  @Input() phone:string;
  @Input() address:string;
  @Input() area:string;
  // @Input() showArrows:boolean=false;
  
  @Output() zmClick = new EventEmitter();

  goAddress(){
   
    this.zmClick.emit();
  }

  constructor(){ }

  ngOnInit(){

  }

}


