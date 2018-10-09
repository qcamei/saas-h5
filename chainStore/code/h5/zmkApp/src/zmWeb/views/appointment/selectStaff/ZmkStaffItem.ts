import {Component, Input,  Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {StaffItemData} from "../AppointmentViewData";

@Component({
  selector:'zmk-staff-item',
  template: `

        <!-- Nav tabs -->
          <ion-item zmk-item-sm (click)="onItemClick()">
            <div item-start>
                <img style="width:15px;" *ngIf="!item.selected"  src="assets/img/succes.png"/>
                <img style="width:15px;" *ngIf="item.selected"   src="assets/img/succes_on.png"/>
            </div>
              <!--<input type="checkbox"  [checked]="item.selected" item-start>-->
              <div item-start zmk-img-circle>
                <img style="width: 100%;height: 100%" [src]="item.headImg | zmImgPath">
              </div>
              <ion-row>           
                  <div fxLayout="column"  style="width:100%;">
                    <span item-title>{{item.name}}</span>
                    <span item-title>{{item.phone}}</span>
                 </div>  
              </ion-row>
          </ion-item>
          
            `,
  styles:[`
    `]
})
export class ZmkStaffItem{

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


