import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";

/**
 * <zmk-address-select-item *ngFor="let item of viewData.addressList" [item]="item"
 *    (onRadioClick)="radioClick($event)" (onItemEditClick)="goAddressEditPage($event)" ></zmk-address-select-item>
 */
@Component({
  selector: 'zmk-address-select-item',
  template: `
      <ion-row >
        <div  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" w-100 style="padding:10px 10px 10px;border-bottom:1px solid #ccc">
          <zm-img-radio [trackType]="this.selected" [label]="''" (zmClick)="radioClick()"></zm-img-radio>
          <div  fxLayout="column" fxLayoutGap="5px" style="width:100%;" >
            <div  fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px"  style="width:100%;">
              <div fxLayout="row" fxLayoutAlign="space-between center" style="width:70%;">
                <span>{{item.receiver}}</span>
                <span>{{item.phone}}</span>
              </div>
              <span  *ngIf="item.defaultFlag==1" class="activeAddre">默认地址</span>
            </div>
            <div  fxLayout="row" fxLayoutAlign="space-between center" style="width:100%;">
              <div overflow-hidden-2 style="color:#666; width:80%;">{{item.addressArea}}&nbsp;{{item.addressDetail}}</div>
              <div (click)="itemEditClick()">
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


export class ZmkAddressSelectItem implements OnInit {

  selected:boolean = false;

  @Input() item: ReceiverAddress = new ReceiverAddress();

  @Output() onItemEditClick = new EventEmitter();
  @Output() onRadioClick = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    if(this.item.defaultFlag==1){
      this.selected = true;
    }
  }

  itemEditClick(){
    this.onItemEditClick.emit(this.item.id);
  }

  radioClick(){
    this.selected = true;
    this.onRadioClick.emit(this.item);
  }

}


