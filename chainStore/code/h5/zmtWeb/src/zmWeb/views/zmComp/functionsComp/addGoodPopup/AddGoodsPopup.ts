import {Component, OnInit, Input, Output, Inject} from "@angular/core";

import {AppUtils} from "../../../../comModule/AppUtils";
import {GoodsType} from "../../../../bsModule/storeGoods/data/GoodsType";
import {ProductData} from "../../../storeCardInfo/Comp/productCardContentComp/ProductCardContentCompViewData";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 添加商品弹出框
 */
@Component({
  selector: 'add-goods',
  template: `

    
    <div animation-modal >
            <h2 mat-dialog-title>
               添加商品
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                    
                    <div fxLayout="row wrap"  fxLayoutGap="20px" >
                    <zm-search-box [label]=" '商品查询'" [placeholder]="'请输入商品名称'" [(zmValue)]="data.name" (callBack)="queryList()"></zm-search-box>

                       <zm-select style="width: 200px;" [label]="'分类'" [selectList]="data.goodsTypeList" [(zmValue)]="data.typeId" value="id" name="name" (selectCallback)="queryList()"></zm-select>
                     <!--<mat-form-field style="width:150px;">-->
                         <!--<mat-select [placeholder]="label" [(ngModel)]="data.typeId" (selectionChange)="queryList()">-->
                            <!--<mat-option [value]="-1">全部</mat-option>-->
                            <!--<mat-option *ngFor="let item of data.goodsTypeList" [value]="item.id">{{item.name}}</mat-option>-->
                         <!--</mat-select>-->
                      <!--</mat-form-field>  -->
                    </div>
                    
                    <div  fxLayout="row wrap" fxLayoutAlign="space-between start" fxLayoutGap="20px" class="zmFullWidth">
                                   
                                    <div fxFlex="1 1 35%">
                                            <ng-template #theadTemplate>
                                                <th>商品名称</th>
                                           </ng-template>
                                          
                                           <ng-template #tbodyTemplate let-item="item">
                                               <td>{{item.name}}</td>
                                           </ng-template>
                                          
                                           <zm-table-select-single [itemList]="data.goodsDataList" (onSelected) = "chooseGoods($event)"  
                                                                            [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" > </zm-table-select-single>
                                           
                                          
                                    </div>
                                    <div fxFlex="1 1 auto" fxFlexAlign="center" style="text-align: center;height:50px;"><img src="assets/images/direction.png" alt=""/></div>
                                    <div fxFlex="1 1 58%">
                                    
                                        <zm-table style="text-align: center">
                                          <thead >
                                            <th style="width: 30%;">商品名称</th>
                                            <th style="width: 25%;">使用类型</th>
                                            <th style="width: 25%;">次数</th>
                                            <th style="width: 20%;">操作</th>
                                          </thead>
                                          <tbody>
                                              <tr class="c-tr" *ngFor="let item of data.choosedGoodsListTmp;let i =index;">
                                                  <td style="width: 30%">{{item.name}}</td>
                                                  <td style="width: 25%;position: relative;padding: 0;">
                                                    <select style="border:none" [(ngModel)]="item.userType" [ngModelOptions]="{standalone: true}" (ngModelChange) = "changeCount(item)">
                                                      <option *ngIf="type==0" [value]="0">无限次</option>
                                                      <option [value]="1">限次数</option>
                                                    </select>
                                                    <span class="c-trigon"></span>
                                                  </td>
                                                  <td style="width: 25%;">
                                                       <div fxLayout="row" fxLayoutAlign="center center" style="width:100%">
                                                              <span  *ngIf="item.userType ==0" style="width: 38px;">(预估)</span>
                                                              <i style="color:#03a9f4;height:12px;min-height: 12px;" class="fa fa-pencil"></i>
                                                              <input style="width:35px;" type="number" autofocus oninput="if(value<=0 || value>999)value = null" class="c-td-modal"value="10"  [(ngModel)]="item.count" [ngModelOptions]="{standalone: true}" required />
                                                       </div>
                                                  </td>
                                                  <td style="width: 20%">
                                                    <a class="zmCurHand" (click)="delChoosedPrd(i)" style="color:#03a9f4;">删除</a>
                                                  </td>
                                              </tr>
                                               <div *ngIf="data.choosedGoodsListTmp.length == 0" style="margin: 120px 0;"><p class="font-c2 mg-b-0">请在左边选择商品添加</p></div> 
                                          </tbody>
                                        </zm-table>
                                    </div>
                    </div>
                
            
            </mat-dialog-content>
            <mat-dialog-actions>
                <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
                    <zm-btn-md  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                   <zm-btn-md  (click)="addGoodsForCard()" name="确定"></zm-btn-md>
                </div>
            </mat-dialog-actions>
    </div>


  `,
})

export class AddGoodsPopup implements OnInit {

  @Input() data: AddGoodsPopupViewData;
  @Input() type: number;
  @Output() action: any;
  // public viewData: AddGoodsPopupViewData;
  public ArtiveItem: number;

  private activeModal;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }


  ngOnInit(): void {

    this.data.choosedGoodsListTmp.splice(0, this.data.choosedGoodsListTmp.length);
    this.data.choosedGoodsList.forEach((item) => {
      if (!AppUtils.arrayContains(this.data.choosedGoodsListTmp, item)) {
        this.data.choosedGoodsListTmp.push(item);
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
    this.data.choosedGoodsListTmp.splice(0, this.data.choosedGoodsListTmp.length);
  }

  /**
   * 页面hover事件
   */
  ArtiveHover(index) {
    this.ArtiveItem = index;
  }

  /**
   * 选择商品
   */
  chooseGoods(itemP:ProductData) {

    let idArr = new Array<string>();
    this.data.choosedGoodsListTmp.forEach(item=>{
      idArr.push(item.id);
    });
    if(AppUtils.arrayContains(idArr, itemP.id)){
      AppUtils.showWarn("提示", "已选择该项目");
    }else{
      this.data.choosedGoodsListTmp.push(itemP);
    }
  }

  /**
   * 提交选择商品
   */
  addGoodsForCard() {
    this.data.choosedGoodsList.splice(0, this.data.choosedGoodsList.length);
    AppUtils.copy(this.data.choosedGoodsList, this.data.choosedGoodsListTmp);
    for(let item of this.data.choosedGoodsList){
      if(item.count==null){
        AppUtils.showWarn("提示","次数不能为空");
        return;
      }
    }
    this.action();
    this.activeModal.close();
  }


  /**根据组合条件过滤商品*/
  queryList() {
    let queryParam = AppUtils.trimBlank(this.data.name);
    let typeId = this.data.typeId;

    let goodsDataListTmp = this.data.goodsDataListTmp;
    if (!AppUtils.isNullOrWhiteSpace(queryParam)) {
      goodsDataListTmp = this.filterByName(queryParam, goodsDataListTmp);
    }
    goodsDataListTmp = this.filterByType(typeId, goodsDataListTmp);
    this.data.goodsDataList = goodsDataListTmp;
  }

  /**根据名称过滤商品*/
  private filterByName(queryParam, goodsDataListTmp: Array<ProductData>) {
    goodsDataListTmp = goodsDataListTmp.filter((item) => {
      if (item.name && item.name.toString().indexOf(queryParam) > -1) {
        return true;
      } else {
        return false;
      }
    });
    return goodsDataListTmp;
  }

  /**根据类别过滤商品*/
  private filterByType(typeId, goodsDataListTmp: Array<ProductData>) {
    goodsDataListTmp = goodsDataListTmp.filter((item) => {
      if (typeId == -1 || item.typeId == typeId) {
        return true;
      } else {
        return false;
      }
    });
    return goodsDataListTmp;
  }

  /**
   * 删除选中的商品
   * @param index
   */
  delChoosedPrd(index) {
    this.data.choosedGoodsListTmp.splice(index, 1);
  }

}

export class AddGoodsPopupViewData {

  goodsTypeList: Array<GoodsType> = new Array<GoodsType>();
  goodsDataList: Array<ProductData> = new Array<ProductData>();
  goodsDataListTmp: Array<ProductData> = new Array<ProductData>();

  choosedGoodsList: Array<ProductData> = new Array<ProductData>();
  choosedGoodsListTmp: Array<ProductData> = new Array<ProductData>();

  typeId: number = -1;
  name: string;

  public static fromParent(productCardContentCompViewData): AddGoodsPopupViewData {
    let addGoodsCardViewData = new AddGoodsPopupViewData();

    addGoodsCardViewData.goodsDataList = productCardContentCompViewData.goodsDataList;
    addGoodsCardViewData.goodsDataListTmp = productCardContentCompViewData.goodsDataListTmp;
    addGoodsCardViewData.goodsTypeList = productCardContentCompViewData.goodsTypeList;
    addGoodsCardViewData.choosedGoodsList = productCardContentCompViewData.choosedGoodsList;
    addGoodsCardViewData.choosedGoodsListTmp = productCardContentCompViewData.choosedGoodsListTmp;

    return addGoodsCardViewData;
  }
}
