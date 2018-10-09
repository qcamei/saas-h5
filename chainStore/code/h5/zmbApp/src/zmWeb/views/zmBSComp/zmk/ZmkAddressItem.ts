import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

/**
 * <zmk-address-item *ngFor="let item of viewData.addressList" [item]="item"
 *    (onItemClick)="goAddressEditPage($event)" ></zmk-address-item>
 */
@Component({
  selector: 'zmk-address-item',
  template: `    
      <ion-row >
        <div  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" w-100 style="padding:10px 15px 10px;border-bottom:1px solid #ccc">
          <div  fxLayout="column" fxLayoutGap="5px"style="width:100%;" >
            <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px">
              <div fxLayout="row" fxLayoutAlign="space-between center" style="width:70%;">
                <span>{{item.receiver}}</span>
                <span>{{item.phone}}</span>
              </div>
              <span *ngIf="item.defaultFlag==1" class="activeAddre">默认地址</span>
            </div>
            <div  fxLayout="row" fxLayoutAlign="space-between center" style="width:100%;">
               <div overflow-hidden-2 style="color:#666; width:80%;">{{item.addressArea}}&nbsp;{{item.addressDetail}}</div>
               <div  (click)="itemClick()">
                  <ion-icon ios="ios-create-outline" style="font-size:26px;" ></ion-icon>
               </div>
            </div>
          </div>
          
        </div>
      </ion-row>
          
            `,
  styles: [`
    .activeAddre{
      font-size:10px !important;
      background:#666;
      border-radius:10px;
      color:#fff;
      padding:2px 8px 0 8px;
      line-height:19px;
    }
    `]
})


export class ZmkAddressItem implements OnInit {

  // @Input() item: ReceiverAddress = new ReceiverAddress();
  @Input() item: any = {};
  @Output() onItemClick = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  itemClick(){
    // this.onItemClick.emit(this.item.id);
  }

}


