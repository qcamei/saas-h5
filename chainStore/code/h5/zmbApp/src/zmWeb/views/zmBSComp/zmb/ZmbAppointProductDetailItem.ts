import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'zmb-appoint-product-detail-item',
  template: `

      <div *ngFor="let item of itemList">
        <zmbItem [imgUrl]="item.prdImg" [name]="item.prdName" [itemTag]="item.prdTypeName"
                 [count]="item.count"></zmbItem>
        <div style="padding:0 10px">
          <div fxLayout="row" fxLayoutAlign="space-between center"
               style="border-top:1px solid #ccc;padding:10px;background:#f4f4f4;">
            <span>服务人员</span>
            <div>
              <span style="color:#999;">{{item.buserName}}</span>
            </div>
          </div>
        </div>
      </div>
    
  `
})

// assets/img/avatar.jpeg
export class ZmbAppointDetailItem implements OnInit {

  @Input() itemList: Array<any>;

  constructor() {

  }

  ngOnInit() {
    // if(this.itemList.length>4){
    //   this.itemList = this.itemList.slice(0,4);
    // }
  }

}

