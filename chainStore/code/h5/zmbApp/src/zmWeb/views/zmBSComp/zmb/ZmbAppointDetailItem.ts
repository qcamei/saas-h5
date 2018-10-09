import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'zmbAppoint-detail-item',
  template: `

      <div *ngFor="let item of itemList" style="margin-top:8px;">
        <zmbItem [imgUrl]="item.prdImg | zmImgPath" [name]="item.prdName" [itemTag]="item.prdTypeName"
                 [count]="item.count"></zmbItem>
        <div style="padding:0 10px">
          <div style="padding:0 10px;background:#f4f4f4;">
               <div w-100 fxLayout="row" fxLayoutAlign="space-between center" style="padding:10px 0;border-top:1px solid #ccc;">
                  <span>服务人员</span>
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

