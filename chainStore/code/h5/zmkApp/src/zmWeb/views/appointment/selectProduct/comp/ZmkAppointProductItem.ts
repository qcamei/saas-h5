import {Component, Input,  Output, EventEmitter} from "@angular/core";
import {ProductItemData} from "../../AppointmentViewData";
import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";

@Component({
  selector:'zmk-appoint-product-item',
  template: `

        <!-- Nav tabs -->
          <ion-item zmk-item-sm>
              <div item-start>
                <img style="width:15px;" *ngIf="!item.selected" (click)="onItemClick()"   src="assets/img/succes.png"/>
                <img style="width:15px;" *ngIf="item.selected" (click)="onItemClick()"   src="assets/img/succes_on.png"/>
              </div>
              <!--<input type="checkbox" (click)="onItemClick()" [checked]="item.selected" item-start>-->

              <div item-start style="width:56px;height:56px;">
                    <img style="width: 100%;height: 100%" [src]="item.defaultImg | zmImgPath">
              </div>
              
              <ion-row>           
                  <div fxLayout="column" style="width:100%;">
                      <div  fxLayout="column">
                           <span item-title>{{item.name}}</span>
                           <span item-subtitle>{{item.typeId| productTypePipe:typeMap}}</span>
                      </div>   
                    
                       <div  fxLayout="row" fxLayoutAlign="space-between center" >
                              <div><span item-subtitle>{{item.price}}</span></div>
                              <div style="width:90px;"  fxLayout="row" fxLayoutAlign="end center">
                                   <ion-icon color="primary" ios="ios-remove-circle-outline" md="md-remove-circle" (click)="countDownClick()"></ion-icon>
                                   <span px-1 >{{item.count}}</span>
                                   <ion-icon color="primary" name="add-circle" (click)="countUpClick()"></ion-icon>
                              </div>
                       </div>
                 </div>  
              </ion-row>

          </ion-item>
          
            `,
  styles:[`
    `]
})


export class ZmkAppointProductItem{

  @Input() item:ProductItemData;
  @Input() typeMap: ZmMap<ProductType>;
  @Output() onItemChange = new EventEmitter();

  constructor() {
  }

  ngOnInit(){
    if(AppUtils.isNullObj(this.item)){
      this.item = new ProductItemData();
    }
  }

  countUpClick() {
    this.item.count++;
    if(!this.item.selected) {
      this.item.selected = true;
    }
    this.onItemChange.emit(this.item);
  }

  countDownClick() {
    if(this.item.count > 0) {
      this.item.count--;
    }
    if(this.item.count == 0){
      this.item.selected = false;
    }
    this.onItemChange.emit(this.item);
  }

  onItemClick(){
    this.item.selected = !this.item.selected;
    if(this.item.selected) {
      this.item.count = 1;
    }else{
      this.item.count = 0;
    }
    this.onItemChange.emit(this.item);
  }

}


