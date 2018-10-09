import {Component, OnInit, Input} from "@angular/core";
import {ProductCardDetailVD} from "../my/productCardDetail/productCardDetail.page";

@Component({
  selector: 'zm-prd-card-info',
  template: `

           <div>
            <zm-card-img [img]="prdCard.imgPath" [name]="prdCard.cardName" [number]="prdCard.cardNumber"></zm-card-img>
            </div>
           

            <ion-card style="margin-top:20px;">
            <ion-card-content >
                <h3 style="color:gray;padding-left: 10px">{{title}}</h3>
                 <zm-col [title]=" '项目名称' " [value]="'剩余次数'"></zm-col>
                 <div style="padding:0 15px;">
                   <div  *ngFor="let item of prdCard.prdCardItems">
                    <zm-col style="color:gray;" [title]=" item.pgName " [value]="item.restCount +'/'+ item.count"></zm-col>
                   </div>
                 </div>

                  <zm-col [title]=" '当前状态' " [value]="prdCard.state|zmCardStatePipe"></zm-col>
                  <ion-col style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center">
                      <span>有效日期</span>
                      <span>{{prdCard.purchaseTime|zmDatePipe:'yyyy/MM/dd'}} - {{prdCard.endTime|zmDatePipe:'yyyy/MM/dd'}}</span>
                     
                 </ion-col>
               
            </ion-card-content>
          </ion-card>
            `
})


export class ZmPrdCardInfo implements OnInit {
  @Input() title:string;
  @Input() prdCard: ProductCardDetailVD;

  constructor() {
  }

  ngOnInit(): void {
  }

}



