import {Component, Input, OnInit, Inject} from '@angular/core';

import {GoodsDetail} from "../../../../bsModule/goodsDetail/data/GoodsDetail";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {GoodsType} from "../../../../bsModule/storeGoods/data/GoodsType";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: '',
  template: `
<div animation-modal>
      <h2 mat-dialog-title>
         商品详情
      </h2>
      <mat-dialog-content>
            <zm-table-detail>
              <tbody style="text-align: center">
              <tr>
                <th width="20%">商品名称</th>
                <td>{{goodsDetail && goodsDetail.name?goodsDetail.name:"-"}}</td>
              </tr>
              <tr>
                <th >商品编号</th>
                <td>{{goodsDetail && goodsDetail.number?goodsDetail.number:"-"}}</td>
              </tr>
              <tr>
                <th >商品分类</th>
                <td>{{goodsDetail && goodsDetail.typeId?(goodsDetail.typeId|goodsTypePipe:goodsTypeMap):"-"}}</td>
              </tr>
              <tr>
                <th >售价</th>
                <td><span class="fa fa-yen mg-r-5 fz-12" ></span>{{goodsDetail && goodsDetail.price?goodsDetail.price:"-"}}</td>
              </tr>
              <tr>
                <th >成本</th>
                <td><span class="fa fa-yen mg-r-5 fz-12" ></span>{{goodsDetail && goodsDetail.cost?goodsDetail.cost:"-"}}</td>
              </tr>
              <tr>
                <th>状态</th>
                <td>{{goodsDetail && goodsDetail.state?(goodsDetail.state|goodsStatePipe):"-"}}</td>
              </tr>
              <tr>
                <th class="c-spd-td">商品介绍</th>
                <td class="c-spd-td">{{goodsDetail && goodsDetail.descript?goodsDetail.descript:"-"}}</td>
              </tr>
              </tbody>
            </zm-table-detail>
      
      </mat-dialog-content>
      <mat-dialog-actions fxLayout="row" fxLayoutAlign="end">
            <zm-btn-md  (click)="closeModal()" name="确定"></zm-btn-md>
      </mat-dialog-actions>
</div>

  `,
  styles: [`
  `],
})
export class GoodsDetailModalComponent implements OnInit {

  @Input() goodsDetail:GoodsDetail;
  @Input() goodsTypeMap:ZmMap<GoodsType>;

  private activeModal: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
    if (AppUtils.isNullObj(this.goodsDetail)) {
      this.goodsDetail = new GoodsDetail();
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}

