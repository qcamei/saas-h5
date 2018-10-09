import {Component, Input, OnInit} from "@angular/core";
import {ProductItemData} from "../productSelectList/productSelectList.page";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {ZmMap} from "../../../comModule/AppUtils";

@Component({
  selector: 'selected-product-list',
  template: `

      <div *ngFor="let item of itemList">
        <zmbItem [imgUrl]="item.defaultImg | zmImgPath" [name]="item.name" [itemTag]="item.typeId | productTypePipe:productTypeMap"
                 [count]="item.count"></zmbItem>
        <!--<div style="padding:0 10px">-->
          <!--<div fxLayout="row" fxLayoutAlign="space-between center"-->
               <!--style="border-top:1px solid #ccc;padding:10px;background:#f4f4f4;">-->
            <!--<span>服务人员</span>-->
            <!--<div>-->
              <!--<span style="color:#999;" *ngFor="let staff of staffList">{{staff.name}}</span>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div border-gray></div>-->
        <div style="padding:0 10px;border-bottom:8px solid #fff;">
           <zmb-select-staff  [Background]="true" [placeHolder]="'请选择服务人员'" [label]="'服务人员'"  [(idArr)]="item.staffIds"></zmb-select-staff>
        </div>  
      </div>
    
  `
})

export class SelectedProductListComp implements OnInit {

  @Input() itemList:Array<ProductItemData> = new Array<ProductItemData>(); //选中的项目数据

  @Input() productTypeMap:ZmMap<ProductType>;

  constructor() {

  }

  ngOnInit() {
  }

}

