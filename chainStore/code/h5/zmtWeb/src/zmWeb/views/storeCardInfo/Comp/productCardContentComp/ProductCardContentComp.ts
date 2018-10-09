import {Component, OnInit, ChangeDetectorRef, Output, Input, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {
  AddProductPopup, AddProductPopupViewData,
} from "../../../zmComp/functionsComp/addProductPopup/AddProductPopup";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {ProductCardContentViewDataMgr} from "./ProductCardContentViewDataMgr";
import {ProductDetailCacheDataHolder} from "../../../../bsModule/productDetail/ProductDetailCacheDataHolder";
import {GoodsDetailCacheDataHolder} from "../../../../bsModule/goodsDetail/GoodsDetailCacheDataHolder";
import {AddGoodsPopup, AddGoodsPopupViewData} from "../../../zmComp/functionsComp/addGoodPopup/AddGoodsPopup";
import {ProductData, ProductCardContentCompViewData} from "./ProductCardContentCompViewData";
import {ProductCardContentCompService} from "./ProductCardContentCompService";
import {AddPackagePopup, AddPackagePopupViewData} from "../../../zmComp/functionsComp/addPackagePopup/AddPackagePopup";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/packageProjectDetail/packageProjectDetailCacheDateHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {PackageDetailModalComponent} from "../../../zmComp/functionsComp/packageDetailComp/PackageDetailModalComponent";
import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {Popup} from "../../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";


/**
 * 次卡内容组件
 */
@Component({
  selector: 'productCard-content-comp',
  template: `
        <div>
             <div  fxLayout="row" fxLayoutAlign="start" fxLayoutGap="20px" style="margin-bottom: 20px">
                  <span  style="font-size:16px;">次卡内容</span>
                  <div class="zmCurHand" (click)="selectProduct()" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                    <img src="assets/images/icon/icon_Add.png" alt="">
                    <a >添加项目</a>
                  </div>
                  <div class="zmCurHand" (click)="selectGoods()" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"  >
                    <img src="assets/images/icon/icon_Add.png" alt="">
                    <a >添加商品</a>
                  </div> 
                  <div class="zmCurHand" (click)="selectPackage()" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"  >
                    <img src="assets/images/icon/icon_Add.png" alt="">
                    <a >添加套餐</a>
                  </div>
            </div>
             <zm-table-detail class="scrollTable tables table-bordered text-center  mg-t-20" >
                    <thead  style="background:#f4f6fa;">
                        <th style="width:10%;">产品名称</th>
                        <th style="width:10%;">产品分类</th>
                        <th style="width:10%;">售价</th>
                        <th style="width:10%;">卡内次数/数量</th>
                        <th style="width:10%;">单次平均价格</th>
                        <th style="width:10%;">操作</th>
                    </thead>
                    <tbody class="my_color mg-b-20">
                        <tr *ngFor="let item of productCardContentList;let i=index;">
                            <td style="width:10%;">{{item.name}}</td>
                            <td style="width:10%;">{{item.type|itemTypePipe}}</td>
                            <td style="width:10%;">{{item.price|number:'1.2-2'}}</td>
                            <td style="width:10%;">
               
                                  <span *ngIf="item.userType==1">{{item.count}}</span>
                                  <span *ngIf="item.userType==0">无限<span style="color:grey;">(预估{{item.count}})</span></span>
                                  <span *ngIf="item.type==0" style="padding-left:5px;">次</span>
                                  <span *ngIf="item.type==1 || item.type==2" style="padding-left:5px;">个</span>
                            </td>
                            <td style="width:10%;">{{item.discountPrice|number:'1.2-2'}}</td>
                            <td style="width:10%;color:#4678fa;">
                              <span class="zmCurHand" (click)="deleteItem(item,i)">删除</span><span></span>
                              <span class="pl-8 zmCurHand" (click)="showDetail(item)">查看</span>
                            </td>
                        </tr>
                    </tbody>
                </zm-table-detail>
        </div>
  `,
  styles: [`
   
  `]
})

export class ProductCardContentComp implements OnInit,OnInit {

  private totalPriceTmp: number;
  @Output() totalPriceChange = new EventEmitter();

  @Input()
  get totalPrice() {
    return this.totalPriceTmp;
  }

  set totalPrice(val) {
    this.totalPriceTmp = val;
    this.totalPriceChange.emit(this.totalPriceTmp);
  }

  private sellPriceTmp: number;
  @Output() sellPriceChange = new EventEmitter();

  @Input()
  get sellPrice() {
    return this.sellPriceTmp;
  }

  set sellPrice(val) {
    this.sellPriceTmp = val;
    this.sellPriceChange.emit(this.sellPriceTmp);
  }

  public productCardContentListTmp: Array<ProductData> = new Array<ProductData>();
  @Output() productCardContentListChange = new EventEmitter();

  @Input()
  get productCardContentList() {
    return this.productCardContentListTmp;
  }

  set productCardContentList(val) {
    this.productCardContentListTmp = val;
    if (this.viewData.flag) {
      this.buildChoosedList(this.productCardContentListTmp);
    }
    this.productCardContentListChange.emit(this.productCardContentListTmp);
  }

  private service: ProductCardContentCompService;
  public viewData: ProductCardContentCompViewData = new ProductCardContentCompViewData();
  public contentExpanded = true;

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private productDetailCacheDataHolder: ProductDetailCacheDataHolder,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private packageProjectDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ProductCardContentCompService(
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storePackageProjectSynDataHolder);
  }

  ngOnInit() {

    ProductCardContentViewDataMgr.getInstance().onDataChanged(new ProductCardContentCompViewData(), (viewDataTmp: ProductCardContentCompViewData) => {
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });

    this.service.initViewData();
  }

  ngOnDestroy(): void {
    ProductCardContentViewDataMgr.getInstance().onViewDestroy();
  }

  public buildChoosedList(productCardContentList: Array<ProductData>) {
    for (let item of productCardContentList) {
      if (item.type == ProductCardItemEnum.PRODUCT) {
        this.viewData.choosedProductList.push(item);
      } else if (item.type == ProductCardItemEnum.GOODS) {
        this.viewData.choosedGoodsList.push(item);
      } else if (item.type == ProductCardItemEnum.PACKAGE) {
        this.viewData.choosedPackageList.push(item);
      }
    }
    this.viewData.flag = false;
  }

  setCount(itemP: ProductData) {
    let totalPrice = 0;
    this.productCardContentList.forEach((item) => {
      if (item.id == itemP.id && item.type == itemP.type){//避免不同类型id相等的情况
        item = itemP;
      }
      totalPrice += parseFloat(item.price.toString()) * item.count;
    });
    this.totalPrice = totalPrice;
    this.autoSetDiscount();
  }



  /**
   * 弹出添加项目popup
   */
  selectProduct(): void {

    const activeModal = ZmModalMgr.getInstance().newLgModal(AddProductPopup, null,null);
    //设置弹窗数据
    activeModal.componentInstance.data = AddProductPopupViewData.fromParent(this.viewData);
    activeModal.componentInstance.type = 0;
    activeModal.componentInstance.action = this.selectContentCallback.bind(this);
  }

  /**
   * 弹出添加商品popup
   */
  selectGoods(): void {
    const activeModal = ZmModalMgr.getInstance().newLgModal(AddGoodsPopup, null,null);

    //设置弹窗数据
    activeModal.componentInstance.data = AddGoodsPopupViewData.fromParent(this.viewData);
    activeModal.componentInstance.type = 0;
    activeModal.componentInstance.action = this.selectContentCallback.bind(this);
  }

  /**
   * 弹出添加套餐popup
   */
  selectPackage(): void {
    const activeModal = ZmModalMgr.getInstance().newLgModal(AddPackagePopup, null,null);
    //设置弹窗数据
    activeModal.componentInstance.data = AddPackagePopupViewData.fromParent(this.viewData);
    activeModal.componentInstance.action = this.selectContentCallback.bind(this);
  }

  /**
   * 选择产品回调
   */
  selectContentCallback(): void {
    this.productCardContentList = new Array();

    this.productCardContentList = AppUtils.addAll(this.productCardContentList, this.viewData.choosedProductList);

    this.productCardContentList = AppUtils.addAll(this.productCardContentList, this.viewData.choosedGoodsList);

    this.productCardContentList = AppUtils.addAll(this.productCardContentList, this.viewData.choosedPackageList);

    this.totalPrice = 0;
    for (let item of this.productCardContentList) {
      this.totalPrice += parseFloat(item.price.toString()) * item.count;
    }

    this.autoSetDiscount();

    if(this.productCardContentList.length>0){
      AppUtils.showSuccess("提示", "选择次卡内容成功");
    }
  }

  /**
   * 删除选中产品
   * @param item
   */
  deleteItem(itemP: ProductData, index) {
    Popup.getInstance().open("提示", "确定删除吗?", () => {
      this.productCardContentList.forEach((item, index) => {
        if (item == itemP) {
          this.productCardContentList.splice(index, 1);
          this.totalPrice -= parseFloat(item.price.toString()) * item.count;
        }
      });
      this.autoSetDiscount();

      if (itemP.type == ProductCardItemEnum.PRODUCT) {
        this.viewData.choosedProductList.forEach((item, index) => {
          if (item.id == itemP.id) {
            item.count = 1;
            this.viewData.choosedProductList.splice(index, 1);
          }
        });
      }

      if (itemP.type == ProductCardItemEnum.GOODS) {
        this.viewData.choosedGoodsList.forEach((item, index) => {
          if (item.id == itemP.id) {
            item.count = 1;
            this.viewData.choosedGoodsList.splice(index, 1);
          }
        });
      }

      if (itemP.type == ProductCardItemEnum.PACKAGE) {
        this.viewData.choosedPackageList.forEach((item, index) => {
          if (item.id == itemP.id) {
            item.count = 1;
            this.viewData.choosedPackageList.splice(index, 1);
          }
        });
      }

      AppUtils.showSuccess("提示", "删除成功");
      this.service.handleViewData(this.viewData);
    });
  }

  /**
   * 查询选中产品详情
   * @param item
   */
  public async showDetail(item: ProductData) {
    if (item.type == ProductCardItemEnum.PRODUCT) {
      await this.openProductInfoDetail(item);
    } else if (item.type == ProductCardItemEnum.GOODS) {
      await this.openGoodsDetail(item);
    }
    else if (item.type == ProductCardItemEnum.PACKAGE) {
      await this.openPackageDetail(item);
    }
  }

  private async openProductInfoDetail(item: ProductData) {
    const activeModal = ZmModalMgr.getInstance().newModal(ProductInfoDetailModalComponent, null,null);
    let storeId = SessionUtil.getInstance().getStoreId();
    let productDetailId = storeId + "_" + item.id;
    let productDetail = await this.productDetailCacheDataHolder.getData(productDetailId);
    activeModal.componentInstance.productDetail = productDetail;
    activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  }

  private async openGoodsDetail(item: ProductData) {
    const activeModal = ZmModalMgr.getInstance().newModal(GoodsDetailModalComponent, null,null);
    let storeId = SessionUtil.getInstance().getStoreId();
    let goodsDetailId = storeId + "_" + item.id;
    let goodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId);
    activeModal.componentInstance.goodsDetail = goodsDetail;
    activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
  }

  private async openPackageDetail(item: ProductData) {
    const activeModal = ZmModalMgr.getInstance().newModal(PackageDetailModalComponent, null,null);
    let packageDetail = await this.packageProjectDetailCacheDataHolder.getData(item.id);
    activeModal.componentInstance.packageDetail = packageDetail;
    activeModal.componentInstance.packageTypeMap = this.viewData.packageProjectTypeMap;
  }


  private autoSetDiscount() {
    if(!this.sellPrice){
      return;
    }

    let totalPrice = 0;
    let price = this.sellPrice;
    this.productCardContentList.forEach(item => {
      totalPrice += parseFloat(item.price.toString()) * item.count;
      totalPrice = AppUtils.twoDecimal(totalPrice);
    });

    let rate: number = price/totalPrice;
    for (let item of this.productCardContentList) {
        item.discountPrice = item.price * rate;
        item.discountPrice = AppUtils.twoDecimal(item.discountPrice);
        if (item.discountPrice > item.price) {
          item.discountPrice = item.price;
        }
    }
  }

}








