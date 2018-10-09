import {Output, Component, EventEmitter, OnInit} from "@angular/core";
// import {GoodsItemData} from "../../storeGoods/list/goodsList.page";
// import {AppUtils} from "../../../comModule/AppUtils";


// @ 2018/3/1
// <zm-btn-img (zmbtnClick)="click()"></zm-btn-img>
@Component({
  selector: 'zm-btn-img',
  template: `
    <div style="display:inline-block">
    
     <div style="display:inline-block" *ngIf="item.count != 0">
       <ion-icon text-theme ios="ios-remove-circle-outline" md="md-remove-circle" (click)="btnReduClick()"></ion-icon>
       <span px-1 >{{item.count}}</span>
    </div>
     
     <ion-icon text-theme name="add-circle" (click)="btnAddClick()"></ion-icon>
    </div>
  `,
})
export class ZmBtnImg implements OnInit{

  // @Input() item:GoodsItemData;
  @Output() itemChange = new EventEmitter();

  constructor() {
  }

  ngOnInit(){
    // if(AppUtils.isNullObj(this.item)){
      // this.item = new GoodsItemData();
    // }
  }

//   btnAddClick() {
//     this.item.count++;
//     this.itemChange.emit(this.item);
//   }

//   btnReduClick() {
//     if(this.item.count>0) {
//       this.item.count--;
//     }else if(this.item.count == 0){
//       this.item.count = 0;
//     }
//     this.itemChange.emit(this.item);
//   }
}

