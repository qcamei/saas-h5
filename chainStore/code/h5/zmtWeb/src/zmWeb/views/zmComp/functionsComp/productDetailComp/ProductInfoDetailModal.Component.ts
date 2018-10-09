import {Component, Input, OnInit, Inject} from '@angular/core';
import {ProductDetail} from "../../../../bsModule/productDetail/data/ProductDetail";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {MAT_DIALOG_DATA} from "@angular/material";
@Component({
  selector: 'ngxx-modal',
  template: `

      <div animation-modal>
            <h2 mat-dialog-title>
               项目详情
            </h2>
            <mat-dialog-content>
                  <zm-table-detail>
                    <tbody style="text-align: center">
                          <tr>
                            <th width="20%">项目名称</th>
                            <td>{{productDetail&&productDetail.name?productDetail.name:"-"}}</td>
                          </tr>
                          <tr>
                            <th>项目编号</th>
                            <td>{{productDetail&&productDetail.number?productDetail.number:"-"}}</td>
                          </tr>
                          <tr>
                            <th >项目分类</th>
                            <td>{{productDetail&&productDetail.typeId?(productDetail.typeId|productTypePipe:productTypeMap):"-"}}</td>
                          </tr>
                          <tr>
                            <th >售价</th>
                            <td>{{productDetail&&productDetail.price?productDetail.price:"-"}}</td>
                          </tr>
                          <tr>
                            <th >成本</th>
                            <td>{{productDetail&&productDetail.cost?productDetail.cost:"-"}}</td>
                          </tr>
                          <tr>
                            <th>状态</th>
                            <td>{{productDetail&&productDetail.state?(productDetail.state|productStatePipe):"-"}}</td>
                          </tr>
                          <tr>
                            <th>项目介绍</th>
                            <td>{{productDetail&&productDetail.descript?productDetail.descript:"-"}}</td>
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
export class ProductInfoDetailModalComponent implements OnInit {

  @Input() productDetail: ProductDetail;
  @Input() productTypeMap: ZmMap<ProductType>;

  private activeModal: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
    if (AppUtils.isNullObj(this.productDetail)) {
      this.productDetail = new ProductDetail();
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}

