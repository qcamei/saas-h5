import {Component, OnInit, Input, Output, Inject} from "@angular/core";

import {AppUtils} from "../../../../comModule/AppUtils";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {ProductData} from "../../../storeCardInfo/Comp/productCardContentComp/ProductCardContentCompViewData";
import {MAT_DIALOG_DATA} from "@angular/material";
import {SelectItem} from "../../form/ZmSelect";

/**
 * 添加项目弹出框
 */
@Component({
  selector: 'add-product',
  template: `


      <div>
            <h2 mat-dialog-title>添加项目</h2>
            <mat-dialog-content fusePerfectScrollbar>
               <div fxLayout="row wrap"  fxLayoutGap="20px" >
               <zm-search-box [label]=" '项目查询'" [placeholder]="'请输入项目名称'" [(zmValue)]="viewData.name" (callBack)="queryList()"></zm-search-box>
                  <zm-select style="width: 200px;" [label]="'分类'" [selectList]="data.productTypeList" [(zmValue)]="viewData.typeId" value="id" name="name" (selectCallback)="queryList()"></zm-select>
                
               </div>
                    
               <div  fxLayout="row wrap" fxLayoutAlign="space-between start" fxLayoutGap="20px" class="zmFullWidth">
                  <div fxFlex="1 1 35%">
                      <ng-template #theadTemplate><th>项目名称</th></ng-template>
                      <ng-template #tbodyTemplate let-item="item"><td>{{item.name}}</td></ng-template>
                       <zm-table-select-single [itemList]="data.productDataList" (onSelected) = "chooseProduct($event)"  
                                                                            [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" > </zm-table-select-single>
                  </div>
                  
                  <div fxFlex="1 1 auto" fxFlexAlign="center" style="text-align: center;height:50px;"><img src="assets/images/direction.png" alt=""/></div>
                  <div fxFlex="1 1 58%">
                       <zm-table style="text-align: center">
                             <thead >
                                <th style="width: 30%;">项目名称</th>
                                <th style="width: 25%;">使用类型</th>
                                <th style="width: 25%;">次数</th>
                                <th style="width: 20%;">操作</th>
                             </thead>
                              <tbody>
                                 <tr class="c-tr" *ngFor="let item of data.choosedProductListTmp;let i =index;">
                                    <td style="width: 30%">{{item.name}}</td>
                                    <td style="width: 25%;position: relative;padding: 0;">
                                   
                                        <select style="border:none" class="c-modal-se" [(ngModel)]="item.userType" [ngModelOptions]="{standalone: true}" (ngModelChange) = "changeCount(item)">
                                             <option *ngIf="type==0" [value]="0">无限次</option>
                                             <option  [value]="1">限次数</option>
                                        </select>
                                        <span class="c-trigon"></span>
                                    </td>
                                    <td style="width: 25%;">
                                       <div fxLayout="row" fxLayoutAlign="center center" style="width:100%">
                                           <span  *ngIf="item.userType ==0" style="width: 39px;">(预估)</span>
                                           <i style="color:#03a9f4;height:12px;min-height: 12px;" class="fa fa-pencil  font-c1"></i>
                                           <input  type="number" autofocus oninput="if(value<=0 || value>999)value = null"  class="c-td-modal" style="width:35px;" value="10"  [(ngModel)]="item.count" [ngModelOptions]="{standalone: true}" required />
                                       </div>
                                    </td>
                                     <td style="width: 20%">
                                        <a class="zmCurHand" (click)="delChoosedPrd(i)" style="color:#03a9f4;">删除</a>
                                     </td>
                                 </tr>
                                 <div *ngIf="data.choosedProductListTmp.length == 0" style="margin: 120px 0;"><p class="font-c2 mg-b-0">请在左边选择项目添加</p></div>
                              </tbody>
                         </zm-table>
                  </div>
               </div>
            </mat-dialog-content>
            
            <mat-dialog-actions>
                <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
                    <zm-btn-md  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                    <zm-btn-md  (click)="addProductForCard()" name="确定"></zm-btn-md>
                </div>
            </mat-dialog-actions>
      </div>
  `,
})

export class AddProductPopup implements OnInit {

  @Input() data: any;
  @Input() type: number;//0 次卡  1套餐

  @Output() action: any;
  public viewData: AddProductPopupViewData = new AddProductPopupViewData();
  public ArtiveItem: number;
  private activeModal;

  // public selectItem = new SelectItem("无限次",0);
  // public selectItem1 = new SelectItem("限次数",1);
  // public selectList = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput: any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
    this.data.choosedProductListTmp.splice(0, this.data.choosedProductListTmp.length);
    this.data.choosedProductList.forEach((item) => {
      if (!AppUtils.arrayContains(this.data.choosedProductListTmp, item)) {
        this.data.choosedProductListTmp.push(item);
      }
    });

    // if(this.type==0){
    //   this.selectList.push(this.selectItem);
    //   this.selectList.push(this.selectItem1);
    // }else{
    //   this.selectList.push(this.selectItem1);
    // }
  }

  changeCount(item: ProductData) {
    item.count = 1;
  }

  /**
   * 页面点击事件 取消关闭弹窗
   */
  closeModal() {
    this.activeModal.close();
    this.data.choosedProductListTmp.splice(0, this.data.choosedProductListTmp.length);
  }

  /**
   * 页面hover事件
   */
  ArtiveHover(index) {
    this.ArtiveItem = index;
  }

  /**
   * 选择项目
   */
  chooseProduct(itemP: ProductData) {
    let idArr = new Array<string>();
    this.data.choosedProductListTmp.forEach(item => {
      idArr.push(item.id);
    });
    if (AppUtils.arrayContains(idArr, itemP.id)) {
      AppUtils.showWarn("提示", "已选择该项目");
    } else {
      this.data.choosedProductListTmp.push(itemP);
    }
  }

  /**
   * 提交选择项目
   */
  addProductForCard() {
    this.data.choosedProductList.splice(0, this.data.choosedProductList.length);
    AppUtils.copy(this.data.choosedProductList, this.data.choosedProductListTmp);
    for(let item of this.data.choosedProductList){
      if(item.count==null){
        AppUtils.showWarn("提示","次数不能为空");
        return;
      }
    }

    this.action();
    this.activeModal.close();
  }


  /**根据组合条件过滤项目*/
  queryList() {
    let queryParam = AppUtils.trimBlank(this.viewData.name);
    let typeId = this.viewData.typeId;

    let productDataListTmp = this.data.productDataListTmp;
    if (!AppUtils.isNullOrWhiteSpace(queryParam)) {
      productDataListTmp = this.filterByName(queryParam, productDataListTmp);
    }
    productDataListTmp = this.filterByType(typeId, productDataListTmp);
    this.data.productDataList = productDataListTmp;
  }

  /**根据名称过滤次卡项目*/
  private filterByName(queryParam, productDataListTmp: Array<ProductData>) {
    productDataListTmp = productDataListTmp.filter((item) => {
      if (item.name && item.name.toString().indexOf(queryParam) > -1) {
        return true;
      } else {
        return false;
      }
    });
    return productDataListTmp;
  }

  /**根据类别过滤次卡项目*/
  private filterByType(typeId, productDataListTmp: Array<ProductData>) {
    productDataListTmp = productDataListTmp.filter((item: ProductData) => {
      if (typeId == -1 || item.typeId == typeId) {
        return true;
      } else {
        return false;
      }
    });
    return productDataListTmp;
  }

  /**
   * 删除选中的项目
   * @param index
   */
  delChoosedPrd(index) {
    this.data.choosedProductListTmp.splice(index, 1);
  }

}

export class AddProductPopupViewData {

  productTypeList: Array<ProductType> = new Array<ProductType>();
  productDataList: Array<ProductData> = new Array<ProductData>();
  productDataListTmp: Array<ProductData> = new Array<ProductData>();

  choosedProductList: Array<ProductData> = new Array<ProductData>();
  choosedProductListTmp: Array<ProductData> = new Array<ProductData>();

  typeId: number = -1;
  name: string;

  public static fromParent(productCardContentCompViewData): AddProductPopupViewData {
    let addProductCardViewData = new AddProductPopupViewData();

    addProductCardViewData.productDataList = productCardContentCompViewData.productDataList;
    addProductCardViewData.productDataListTmp = productCardContentCompViewData.productDataListTmp;
    addProductCardViewData.productTypeList = productCardContentCompViewData.productTypeList;
    addProductCardViewData.choosedProductList = productCardContentCompViewData.choosedProductList;
    addProductCardViewData.choosedProductListTmp = productCardContentCompViewData.choosedProductListTmp;

    return addProductCardViewData;
  }
}
