import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MyViewData} from "../MyViewData";

@Component({
  selector:'my-simple-info-comp',
  template:
  `
    <div style="border-bottom:8px solid #F3F3F3;" w-100>
      <ion-list no-lines style="margin:0;">
        <button ion-item (click)="onZmClick()">
          <div zmk-img-rect-small item-start>
            <img  :src="{{myVD.imgUrl}}">
          </div>
          <h2>{{myVD.cuser.name}}</h2>
          <div *ngIf="myVD.membershipCard!=null && myVD.leaguerMemberCardBalance>=0" 
            class="tally" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
            <span>{{myVD.membershipCard.name}}</span>
            <span>余额:￥{{myVD.leaguerMemberCardBalance}}</span>
          </div>
        </button>
      </ion-list>
    </div>
   `,
  styles: [`
    .tally{
      font-size:10px;
      padding-top:5px;
    }
    .tally>span{
      padding:0 5px;
      border-radius:10px;
      border:1px solid #4678FA;
      color:#4678FA;
    }
    `]
})
export class MySimpleInfoComp{

    @Input() myVD:MyViewData = new MyViewData();

    @Output() zmClick = new EventEmitter();

    constructor(){
    }

    onZmClick(){
      this.zmClick.emit();
    }

}
