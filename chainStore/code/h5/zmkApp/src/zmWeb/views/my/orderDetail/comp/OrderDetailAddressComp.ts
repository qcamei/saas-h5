import {Component, Input, OnInit} from "@angular/core";
@Component({
  selector:'store-address-comp',
  template: `
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" w-100 style="padding:10px 10px 10px 10px;">
           <ion-icon name="pin" style="font-size:19px;"></ion-icon>
           <div fxLayout="column" fxLayoutGap="5px" style="width:91%;">
               <div fxLayout="row" fxLayoutAlign="space-between center">
                   <div style="width:69%;" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                     <b>店铺名称:</b>
                     <span overflow-hidden-1 style="width:70%;color:#666;">{{storeName}}</span>
                   </div>
                    <span style="color:666;">{{storeTel}}</span>
               </div>
               <div  fxLayout="row" fxLayoutAlign="start">
                   <b>地址:</b>
                   <span overflow-hidden-2 style="width:87%;color:#666;margin-left:5px;">{{storeAddress}}</span>
               </div>
           </div>
        </div>
            `
})
export class OrderAddressComp implements OnInit{

  @Input() storeName;
  @Input() storeTel;
  @Input() storeArea;
  @Input() address;

  private storeAddress:string;

  ngOnInit(){
    this.storeAddress = this.storeArea;
    if(this.address){
      this.storeAddress = this.storeArea+this.address;
    }
  }

}
