import {Component, Input,  Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {StaffItemData} from "./StaffItemData";

@Component({
  selector:'zmb-staff-item',
  template: `

        <!-- Nav tabs -->
          <ion-item zmk-item-sm (click)="onItemClick()">
            <div item-start>
                <img style="width:15px;" *ngIf="!item.selected"  src="assets/img/succes.png"/>
                <img style="width:15px;" *ngIf="item.selected"   src="assets/img/succes_on.png"/>
            </div>
            <zmbUser-info [imgUrl]="item.headImg | zmImgPath" [name]="item.name" [sex]="item.gender == 2" [phone]="item.phone"></zmbUser-info>
              <!--&lt;!&ndash;<input type="checkbox"  [checked]="item.selected" item-start>&ndash;&gt;-->
              <!--<div item-start zmk-img-circle>-->
                <!--<img style="width: 100%;height: 100%" [src]="item.headImg | zmImgPath">-->
              <!--</div>-->
              <!--<ion-row>           -->
                  <!--<div fxLayout="column"  style="width:100%;">-->
                    <!--<span item-title>{{item.name}}</span>-->
                    <!--<span item-title>{{item.phone}}</span>-->
                 <!--</div>  -->
              <!--</ion-row>-->
          </ion-item>
          
            `,
  styles:[`
    `]
})
export class ZmbStaffItem{

  @Input() item:StaffItemData;
  @Output() onItemChange = new EventEmitter();

  ngOnInit(){
    if(AppUtils.isNullObj(this.item)){
      this.item = new StaffItemData();
    }
  }

  onItemClick(){
    this.item.selected = !this.item.selected;
    this.onItemChange.emit(this.item);
  }

}


