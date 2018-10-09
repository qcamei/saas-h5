import {Component, OnInit, Input} from "@angular/core";
import {MemCardDetail} from "../my/memCardDetail/memCardDetailViewData";

@Component({
  selector: 'zm-mem-card-info',
  template: `

        
          <zm-card-img [img]="memCard.imgPath" [name]="memCard.name" [number]="memCard.number"></zm-card-img>
       
          <ion-card  style="margin-top:20px;">
            <ion-card-content>
                <h3 style="border-bottom:1px solid #F3F3F3;padding:5px 0;color:gray;">{{title}}</h3>
                <zm-col [title]=" '卡内余额' " [value]="memCard.balance" [isMoney] = "true"></zm-col>
                <zm-col [title]=" '赠送余额' " [value]="memCard.freeMoney" [isMoney] = "true"></zm-col>
                <zm-col [title]=" '当前状态' " [value]="memCard.state|zmCardStatePipe"></zm-col>
                <zm-col [title]=" '项目折扣' " [value]="memCard.prodDiscount|zmDiscountPipe"></zm-col>
                <zm-col [title]=" '商品折扣' " [value]="memCard.goodsDiscount|zmDiscountPipe"></zm-col>
                <zm-col [title]=" '次卡折扣' " [value]="memCard.prdCardDiscount|zmDiscountPipe"></zm-col>
                <zm-col [title]=" '套餐折扣' " [value]="memCard.packagePrjDiscount|zmDiscountPipe"></zm-col>
                <zm-col *ngIf="memCard.limitUnit != 0 " [title]=" '有效日期' " [value]="memCard.endTime|zmDatePipe:'yyyy/MM/dd'"></zm-col>
                <zm-col *ngIf="memCard.limitUnit == 0 " [title]=" '有效日期' " [value]=" '永久' "></zm-col>
            </ion-card-content>
          </ion-card>
            `
})


export class ZmMemCardInfo implements OnInit {
  @Input() title:string;
  @Input() memCard: MemCardDetail;

  constructor() {
  }

  ngOnInit(): void {
  }

}



