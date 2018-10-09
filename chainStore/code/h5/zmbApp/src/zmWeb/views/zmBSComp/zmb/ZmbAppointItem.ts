import {Component, Input, OnInit} from "@angular/core";

//  <zmbAppoint-item [imgUrl]="" [itemName]="" [itemTag]="" [count]="number"></zmbAppoint-item>
@Component({
  selector: 'zmbAppoint-item',
  template: `

    <div *ngIf="itemList.length == 1">
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

    </div>
    <div *ngIf="itemList.length > 1" style="padding:0 10px;font-size: 12px">
      <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" style="padding:10px 0;background:#f4f4f4;">
        <div style="width:25%;" fxLayout="column" fxLayoutAlign="start center" fxLayoutGap="2px"
             *ngFor="let item of itemList">
          <div style="width:70px;height:70px;">
            <img style="width:100%;height:100%;" [src]="item.prdImg">
          </div>
          <span text-center overflow-hidden-1 w-100>{{item.prdName}}</span>
        </div>
      </div>
    </div>





  `
})

// assets/img/avatar.jpeg
export class ZmbAppointItem implements OnInit {

  @Input() itemList: Array<any>;

  constructor() {

  }

  ngOnInit() {
    if(this.itemList.length>4){
      this.itemList = this.itemList.slice(0,4);
    }
  }

}


