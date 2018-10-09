import {Component, OnInit, Input, Output, Inject} from "@angular/core";

import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {MAT_DIALOG_DATA} from "@angular/material";


/**
 * 新建次卡 选择次卡模态框
 */
@Component({
  selector: 'select-product',
  template: `
            <div class="modal-header">
              <h4 class="modal-title">选择项目</h4>
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="row modal-body">
              <img src="assets/images/direction.png" alt="" class="icon-dir"/>
              <div class="col-lg-4 col-md-12 text-center">
                <div class="disFlex">
                  <div class="c-cardlist-input mg-r-10 disFlex">
                    <input class=" c-first-input" type="text"  placeholder="请输入项目名称" name="name" [(ngModel)]="viewData.name" (keyup.enter)="queryListByName()" />
                    <button class="c-btn-blue c-cardlist-btn" (click)="queryListByName()">查询</button>
                  </div>
                  <div class="c-cardlist-select disFlex align-center">
                    <label class="mg-b-0 font-bold fz-12">分类</label>
                    <select class="c-form-select  cur-hand  form-control" [(ngModel)]="viewData.typeId" [ngModelOptions]="{standalone: true}" (ngModelChange) = "queryListByType()">
                      <option [value]="-1">全部</option>
                      <option *ngFor="let item of data.productTypeList" [value]="item.id">{{item.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="c-modal">
                  <h4>项目名称</h4>
                  <ul class="last-ul" >
                    <li *ngFor="let item of data.productDataList;let i = index" (click)="chooseProduct(item)" (mouseover)="ArtiveHover(i)" [ngClass]="{'ActiveLi':ArtiveItem == i}">
                      <img src="assets/images/selectItem.png"  style="position: absolute;left: 35px;" alt="" *ngIf="ArtiveItem == i">  
                      {{item.prdName}}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-8 col-md-12"  >
                    <table class="c-table-title table table-bordered text-center">
                      <thead >
                        <th style="width: 30%;">项目名称</th>
                        <th style="width: 25%;">使用类型</th>
                        <th style="width: 25%;">次数</th>
                        <th style="width: 20%;">操作</th>
                      </thead>
                      <tbody>
                          <tr class="c-tr" *ngFor="let item of data.choosedProductListTmp;let i =index;">
                              <td style="width: 30%">{{item.prdName}}</td>
                              <td style="width: 25%;position: relative;padding: 0;">
                                <select class="c-modal-se" [(ngModel)]="item.type" [ngModelOptions]="{standalone: true}" (ngModelChange) = "changeCount(item)">
                                  <option [value]="0">无限次</option>
                                  <option [value]="1">限次数</option>
                                </select>
                                <span class="c-trigon"></span>
                              </td>
                              <td style="width: 25%;">
                                <i class="fa fa-pencil mg-r-10 font-c1"></i>
                                <input type="number" autofocus oninput="if(value<0 || value>999)value = null"  *ngIf="item.type ==1" class="c-td-modal"value="10"  [(ngModel)]="item.count" [ngModelOptions]="{standalone: true}" required />
                               <span  *ngIf="item.type ==0" style="width: 50px; display: inline-block;text-align: left;">-</span>
                              </td>
                              <td style="width: 20%">
                                <a (click)="delChoosedPrd(i)" style="color:#03a9f4;">删除</a>
                              </td>
                          </tr>
                            <div *ngIf="data.choosedProductListTmp.length == 0" style="margin: 120px 0;"><p class="font-c2 mg-b-0">请在左边选择项目添加</p></div>
                      </tbody>
                    </table>
                </div>
              </div>
            <div class="modal-footer">
              <button type="button" class="btn c-btn-modal c-close-btn-modal" style="margin-right: 20px;" (click)="closeModal()">取消</button>
              <button type="button" class="btn c-btn-blue c-btn-modal" (click)="addPrdInCard()">确认</button>
            </div>
  `,
  styleUrls: ['CardProductPopupComp.scss'],
})

export class CardProductPopupComp implements OnInit {

  @Input() data: CardProductPopupViewData;
  @Output() callBack: any;
  private service: CardProductPopupService;
  public viewData: CardProductPopupViewData = new CardProductPopupViewData();
  public ArtiveItem: number;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new CardProductPopupService();
  }

  ngOnInit(): void {
    this.data.choosedProductList.forEach((item) => {
      if (!AppUtils.arrayContains(this.data.choosedProductListTmp, item)) {
        this.data.choosedProductListTmp.push(item);
      }
    });
  }

  changeCount(item){
    if(item.type == 0){
      item.count = 0;
    }
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
  chooseProduct(item) {
    if(AppUtils.arrayContains(this.data.choosedProductListTmp,item)){
      AppUtils.showWarn("提示", "已选择该项目");
    }else{
      this.data.choosedProductListTmp.push(item);
    }
  }

  /**
   * 提交选择项目
   */
  addPrdInCard() {
    let hasNull = this.countHasNull();

    if(hasNull){
      AppUtils.showWarn("提示", "请输入次数");
    }else{
      this.data.choosedProductList.splice(0, this.data.choosedProductList.length);
      AppUtils.copy(this.data.choosedProductList, this.data.choosedProductListTmp);
      this.callBack();
      this.activeModal.close();
    }

  }

  /**所选项目次数是否有null值*/
  private countHasNull(){
    let hasNull = false;
    this.data.choosedProductListTmp.filter((item)=>{
      if(item.type==1){//限次数
        if(item.count == null){
          hasNull = true;
        }
      }
    });
    return hasNull;
  }

  /**
   * 根据项目名称查询项目列表 点击事件
   */
  public queryListByName() {
    let queryParam = this.getQueryParam();
    let typeId = this.viewData.typeId;
    this.queryListByReq(queryParam, typeId);
  }

  /**
   * 根据项目分类查询 change事件
   */
  public queryListByType() {
    let queryParam = this.getQueryParam();
    let typeId = this.viewData.typeId;
    this.queryListByReq(queryParam, typeId);
  }

  /**获取查询参数*/
  private getQueryParam():string{
    let queryParam = "";
    if (!AppUtils.isNullOrWhiteSpace(this.viewData.name)) {
      queryParam = AppUtils.trimBlank(this.viewData.name);
    }
    return queryParam;
  }

  /**根据组合条件过滤次卡项目*/
  private queryListByReq(queryParam, typeId) {
    let productDataListTmp = this.data.productDataMap.values();
    if (queryParam!="") {
      productDataListTmp = this.filterByName(queryParam,productDataListTmp);
    }
    productDataListTmp = this.filterByType(typeId,productDataListTmp);
    this.data.productDataList = productDataListTmp;
  }

  /**根据名称过滤次卡项目*/
  private filterByName(queryParam,productDataListTmp){
    productDataListTmp = productDataListTmp.filter((item) => {
      if (item && item.prdName.indexOf(queryParam) > -1) {
        return true;
      } else {
        return false;
      }
    });
    return productDataListTmp;
  }

  /**根据类别过滤次卡项目*/
  private filterByType(typeId,productDataListTmp){
    productDataListTmp = productDataListTmp.filter((item) => {
      if(typeId == -1 || item.prdType == typeId) {
        return true;
      }else{
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

export class CardProductPopupService {
  constructor() {
  }

}

export class CardProductPopupViewData {
  //选择项目页面数据
  productInfoMap: ZmMap<ProductInfo>;
  productInfoList: Array<ProductInfo> = new Array<ProductInfo>();
  productDataMap:ZmMap<ProductData>;
  productDataList:Array<ProductData> = new Array<ProductData>();
  productTypeList: Array<ProductType> = new Array<ProductType>();
  storePrd: StoreProductInfo = new StoreProductInfo();

  choosedProductList: Array<ProductData> = new Array<ProductData>();
  choosedProductListTmp: Array<ProductData> = new Array<ProductData>();

  typeId: number = -1;
  name: string;

  public static fromParent(addProductCardViewData): CardProductPopupViewData {
    let cardProductPopupViewData = new CardProductPopupViewData();

    /*店内项目*/
    cardProductPopupViewData.productInfoMap = addProductCardViewData.productInfoMap;
    cardProductPopupViewData.productInfoList = addProductCardViewData.productInfoList;
    cardProductPopupViewData.productDataMap = addProductCardViewData.productDataMap;
    cardProductPopupViewData.productDataList = addProductCardViewData.productDataList;
    cardProductPopupViewData.productTypeList = addProductCardViewData.productTypeList;
    cardProductPopupViewData.choosedProductList = addProductCardViewData.choosedProductList;
    cardProductPopupViewData.choosedProductListTmp = addProductCardViewData.choosedProductListTmp;


    return cardProductPopupViewData;
  }
}


export class ProductData {
  prdId: number;//项目id
  prdName: string;//项目名称
  prdType:number;//项目类别
  type: number;//使用类型 0无限次 1限次数
  count: number;
}
