import {Component, OnInit, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {AppUtils} from "../../../comModule/AppUtils";


@Component({
  selector: 'shop-model',
  template: `
    <div>
      <h2 mat-dialog-title>
        请选择店铺
      </h2>
      <mat-dialog-content>
        <div fxLayout="column" fxLayoutGap="60px;">
          <div fxLayout="row" fxLayoutAlign="space-between center">
            <zm_search_box [label]="''" [placeholder]="'请输入门店名称'" [(zmValue)]="queryName"
                           (callBack)="findProduct()"></zm_search_box>
            <div>
              <zm_btn class="mr-8" [stroked]="true" (zmbtnClick)="cleanChoose()" name="清空"></zm_btn>
              <zm_btn [stroked]="false" (zmbtnClick)="checkAll()" name="全选"></zm_btn>
            </div>
          </div>


          <zm_table_detail>
            <thead class="char_th">
            <th>选择</th>
            <th>店铺名称</th>
            <th>数据权限</th>


            </thead>
            <tbody style="height:370px;overflow:auto;text-align: center">

            <tr *ngFor="let item of displayStoreList;let i = index"
                [class.itemDisable]="!item.dataPermission"
                [class.itemActiveClass]="item.checked && item.dataPermission"
                (click)="itemClick(item)"
                style="cursor: pointer;">
              <td style="position:relative">
                  <span style="display:inline-block;width:30px;">
                    <input *ngIf="false" type="checkbox" [disabled]="item.checked"> 
                    <img src="assets/images/selectItem.png" *ngIf="!false">
                  </span>
              </td>
              <td>{{item.name}}</td>
              <td *ngIf="item.dataPermission">共享</td>
              <td *ngIf="!item.dataPermission">不共享</td>
            </tr>

            <!--<tr [class.itemDisable]="true" [class.itemActiveClass]="true" (click)="itemClick(item)">-->
            <!--<td style="position:relative">-->
            <!--<span style="display:inline-block;width:30px;">-->
            <!--<input *ngIf="false" type="checkbox" [disabled]="false"> -->
            <!--<img src="assets/images/selectItem.png" *ngIf="!false">-->
            <!--</span>-->
            <!--</td>-->
            <!--<td>广分</td>-->
            <!--<td>不共享</td>-->
            <!--</tr>-->
            </tbody>
          </zm_table_detail>

        </div>


      </mat-dialog-content>
      <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <zm_btn_md [stroked]="true" (click)="cancel()" name="取消"></zm_btn_md>
        <zm_btn_md (click)="submit()" name="确定"></zm_btn_md>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .itemActiveClass {
      background: #03a9f4 !important;
      color: #fff;
      cursor: pointer;
    }

    .itemActiveClass td {
      border: 1px solid transparent;
      border-bottom-color: #fff;
    }

    .itemDisable {
      background: rgba(221, 221, 221, 1) !important;
      border-bottom: 1px solid  #fff;
    }

    .itemDisable td {
    / / border-color: rgba(221, 221, 221, 1);
      border: 1px solid  #ffffff;
      /*border-bottom-color: rgba(221, 221, 221, 1) !important;*/
      border-bottom-color: #fff !important;
    }

  `],
})

export class ShopModelComponent implements OnInit {

  queryName: string = "";
  private activeModal: any;
  @Input()
  public storeList: Array<StoreVD>;

  public displayStoreList: Array<StoreVD>;

  callback: (storeList) => void;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput: any) {
    this.activeModal = dataInput.modalCtrl;
    this.storeList = dataInput.modalData.storeList;
    this.displayStoreList = this.storeList;
    this.callback = dataInput.callBack;
  }

  itemClick(item) {
    item.checked = !item.checked;
  }


  findProduct() {
    if (AppUtils.isNullOrWhiteSpace(this.queryName)) {
      this.displayStoreList = this.storeList;
    } else {
      if (this.storeList) {
        this.displayStoreList = this.storeList.filter((storeVD: StoreVD) => {
          return storeVD.name.includes(this.queryName);
        });
      }
    }

  }

// 取消
  closeModal() {
    this.activeModal.close();
  }


  /**
   * 清空
   */
  cleanChoose() {
    this.storeList.map((storeVD: StoreVD) => {
      storeVD.checked = false;
    });
  }

  /**
   * 全选
   */
  checkAll() {
    this.displayStoreList.map((storeVD: StoreVD) => {
      storeVD.checked = true;
    });
  }

  /**
   * 取消
   */
  cancel() {
    this.activeModal.close();
  }

  /**
   * 确认
   */
  submit() {
    this.callback(this.displayStoreList.filter((storeVD: StoreVD) => {
      return storeVD.checked == true;
    }));
    this.activeModal.close();

  }


  ngOnInit(): void {
  }


}


