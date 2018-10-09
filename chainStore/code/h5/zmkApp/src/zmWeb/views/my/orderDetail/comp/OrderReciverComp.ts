import {Component, Input} from "@angular/core";
@Component({
  selector:'order-reciver-comp',
  template: `
       <div  fxLayout="row" fxLayoutGap="5px" fxLayoutAlign="start center" w-100 style="padding:10px 10px 10px 10px;">
          <ion-icon name="pin" style="font-size:19px;"></ion-icon>
          <div fxLayout="column" fxLayoutGap="5px"  style="width:91%;"> 
             <div fxLayout="row" fxLayoutAlign="space-between center">
                 <div style="width:69%;" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                   <b>收货人:</b>
                   <span overflow-hidden-1 style="width:76%;color:#666;">{{receiver}}</span>
                 </div>
                 <span style="color:666;"> {{phone}}</span>
             </div>
             <div  fxLayout="row" fxLayoutAlign="start">
                 <b>收货地址:</b>
                 <span overflow-hidden-2 style="width:79%;color:#666;margin-left:5px;">{{address}}</span>
             </div>
          </div>
       </div>
            `
})
export class OrderReciverComp{

  @Input() receiver;
  @Input() phone;
  @Input() address;

}
