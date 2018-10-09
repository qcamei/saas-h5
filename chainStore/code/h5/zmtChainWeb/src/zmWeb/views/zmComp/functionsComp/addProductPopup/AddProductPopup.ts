import {Component, OnInit, Input, Output, Inject} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";
import {ProductData} from "../../../chainPackageProject/comp/packageContentComp/PackageContentCompViewData";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";

/**
 * 添加项目弹出框
 */
@Component({
  selector: 'add-product',
  template: `
<div animation-modal>
            <h2 mat-dialog-title>添加项目</h2>
            <mat-dialog-content>
               <div fxLayout="row wrap"  fxLayoutGap="20px" >
                  <zm_select style="width: 200px;" [label]="'分类'" [selectList]="data.productTypeList" [(zmValue)]="viewData.typeId" value="id" name="name" (selectCallback)="queryList()"></zm_select>
                  <zm_search_box [label]=" '项目查询'" [placeholder]="'请输入项目名称'" [(zmValue)]="viewData.name" (callBack)="queryList()"></zm_search_box>
               </div>
                    
               <div  fxLayout="row wrap" fxLayoutAlign="space-between start" fxLayoutGap="20px" class="zmFullWidth">
                  <div fxFlex="1 1 35%">
                      <ng-template #theadTemplate><th>项目名称</th></ng-template>
                      <ng-template #tbodyTemplate let-item="item"><td>{{item.name}}</td></ng-template>
                       <zm_table_detail_select_single [itemList]="data.productDataList" (onSelected) = "chooseProduct($event)"  
                                                                            [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" > </zm_table_detail_select_single>
                  </div>
                  
                  <div fxFlex="1 1 auto" fxFlexAlign="center" style="text-align: center;height:50px;"><img src="assets/images/direction.png" alt=""/></div>
                  <div fxFlex="1 1 58%">
                       <zm_table style="text-align: center">
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
                                   
                                        <select class="c-modal-se" [(ngModel)]="item.userType" [ngModelOptions]="{standalone: true}" (ngModelChange) = "changeCount(item)">
                                             <option *ngIf="type==0" [value]="0">无限次</option>
                                             <option  [value]="1">限次数</option>
                                        </select>
                                        <span class="c-trigon"></span>
                                    </td>
                                    <td style="width: 25%;">
                                       <div fxLayout="row" fxLayoutAlign="center center" style="width:100%">
                                           <span  *ngIf="item.userType ==0" style="width: 39px;">(预估)</span>
                                           <i style="color:#03a9f4;height:12px;min-height: 12px;" class="fa fa-pencil  font-c1"></i>
                                           <input  type="number" autofocus oninput="if(value<=0 || value>999)value = 1"  class="c-td-modal" style="width:35px;" value="10"  [(ngModel)]="item.count" [ngModelOptions]="{standalone: true}" required />
                                       </div>
                                    </td>
                                     <td style="width: 20%">
                                        <a class="zmCurHand" (click)="delChoosedPrd(i)" style="color:#03a9f4;">删除</a>
                                     </td>
                                 </tr>
                                 <div *ngIf="data.choosedProductListTmp.length == 0" style="margin: 120px 0;"><p class="font-c2 mg-b-0">请在左边选择项目添加</p></div>
                              </tbody>
                         </zm_table>
                  </div>
               </div>
            </mat-dialog-content>
            
            <mat-dialog-actions>
                <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
                    <zm_btn_md  [stroked]="true" (click)="closeModal()" name="取消"></zm_btn_md>
                    <zm_btn_md  (click)="addProductForCard()" name="确定"></zm_btn_md>
                </div>
            </mat-dialog-actions>
      </div>

  `,
})

export class AddProductPopup implements OnInit {

  @Input() data: any;
  @Input() type: number;

  @Output() action: any;
  public viewData: AddProductPopupViewData = new AddProductPopupViewData();
  public ArtiveItem: number;

  private activeModal;

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
