import {Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {
  AddProductPopup, AddProductPopupViewData,
} from "../../../zmComp/functionsComp/addProductPopup/AddProductPopup";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {ProductDetailCacheDataHolder} from "../../../../bsModule/productDetail/ProductDetailCacheDataHolder";
import {GoodsDetailCacheDataHolder} from "../../../../bsModule/goodsDetail/GoodsDetailCacheDataHolder";
import {AddGoodsPopup, AddGoodsPopupViewData} from "../../../zmComp/functionsComp/addGoodPopup/AddGoodsPopup";
import {ProductData, PackageContentCompViewData} from "./PackageContentCompViewData";
import {PackageContentCompService} from "./PackageContentCompService";
import {PackageContentViewDataMgr} from "./PackageContentCompViewDataMgr";
import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {Popup} from "../../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";


/**
 * 套餐内容组件
 */
@Component({
  selector: 'package-content-comp',
  template: `
 
        <div>
            <div  fxLayout="row" fxLayoutAlign="start" fxLayoutGap="20px" style="margin-bottom: 20px">
              <span  style="font-size:16px;">套餐内容</span>
              <div class="zmCurHand" (click)="selectProduct()" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                <img src="assets/images/icon/icon_Add.png" alt="">
                <a >添加项目</a>
              </div>
              <div class="zmCurHand" (click)="selectGoods()" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"  >
                <img src="assets/images/icon/icon_Add.png" alt="">
                <a >添加商品</a>
              </div>
            </div>
                
                 
            <zm-table-detail style="text-align: center;margin-top: 20px;">
                    <thead style="background:#f4f6fa;">
                        <th style="width:10%;">产品名称</th>
                        <th style="width:10%;">产品分类</th>
                        <th style="width:10%;">售价</th>
                        <th style="width:10%;">数量</th>
                        <th style="width:10%;">单次平均价格</th>
                        <th style="width:10%;">操作</th>
                    </thead>
                    <tbody >
                        <tr class="c-tr"  *ngFor="let item of packageContentList;let i=index;">
                            <td style="width:10%;">{{item.name}}</td>
                            <td style="width:10%;">{{item.type|itemTypePipe}}</td>
                            <td style="width:10%;">{{item.price|number:'1.2-2'}}</td>
                            <td style="width:10%;">
                                <div class="pos-r align-center" style="display:flex;">
                                  
                                  <input *ngIf="item.count!=0" type="number" style="width:80%;border:1px solid rgb(236, 233, 233);" oninput="if(value<=0 ||value>999){value=null}" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="setCount(item)">
                                  <span *ngIf="item.type==0" style="padding-left:5px;">次</span>
                                  <span *ngIf="item.type==1" style="padding-left:5px;">个</span>
                                  
                               
                                </div>
                            </td>
                             <td style="width:10%;">{{item.discountPrice|number:'1.2-2'}}</td>
                             
                            <td  style="width:10%;">
                              <a style="cursor: hand" (click)="deleteItem(item,i)">删除</a>
                              <a style="cursor: hand;margin-left: 5px"  (click)="showDetail(item)">查看</a>
                            </td>
                        </tr>
                    </tbody>
                </zm-table-detail>
        </div>
       
  `,
  styles: [`
  `]
})

export class PackageContentComp implements OnInit,OnInit {

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

  public packageContentListTmp: Array<ProductData> = new Array<ProductData>();
  @Output() packageContentListChange = new EventEmitter();

  @Input()
  get packageContentList() {
    return this.packageContentListTmp;
  }

  set packageContentList(val) {
    this.packageContentListTmp = val;
    if (this.viewData.flag) {
      this.buildChoosedList(this.packageContentListTmp);
    }
    this.packageContentListChange.emit(this.packageContentListTmp);
  }

  private service: PackageContentCompService;
  public viewData: PackageContentCompViewData = new PackageContentCompViewData();
  public contentExpanded = true;

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private productDetailCacheDataHolder: ProductDetailCacheDataHolder,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new PackageContentCompService(
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder);
  }

  ngOnInit() {

    PackageContentViewDataMgr.getInstance().onDataChanged(new PackageContentCompViewData(), (viewDataTmp: PackageContentCompViewData) => {
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });

    this.service.initViewData();
  }

  ngOnDestroy(): void {
    PackageContentViewDataMgr.getInstance().onViewDestroy();
  }

  public buildChoosedList(productCardContentList: Array<ProductData>) {
    for (let item of productCardContentList) {
      if (item.type == ItemTypeEnum.PRODUCT) {
        this.viewData.choosedProductList.push(item);
      } else if (item.type == ItemTypeEnum.GOODS) {
        this.viewData.choosedGoodsList.push(item);
      }
    }
    this.viewData.flag = false;
  }

  /**
   * 修改产品数量，同步总价
   */
  setCount(itemP: ProductData) {
    if(itemP.count ==null){
      itemP.count = 1;
    }
    let totalPrice = 0;
    this.packageContentList.forEach((item) => {
      if (item.id == itemP.id && item.type == itemP.type) {
        item = itemP;
      }
      totalPrice += parseFloat(item.price.toString()) * item.count;
      this.totalPrice = totalPrice;
    });
    this.autoSetDiscount();
  }


  /**
   * 弹出添加项目popup
   */
  selectProduct(): void {
    // const activeModal = this.modalService.open(AddProductPopup, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newLgModal(AddProductPopup, null,null);

    //设置弹窗数据
    activeModal.componentInstance.data = AddProductPopupViewData.fromParent(this.viewData);
    activeModal.componentInstance.type = 1;//套餐
    activeModal.componentInstance.action = this.selectContentCallback.bind(this);
  }

  /**
   * 弹出添加商品popup
   */
  selectGoods(): void {
    // const activeModal = this.modalService.open(AddGoodsPopup, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newLgModal(AddGoodsPopup, null,null);

    //设置弹窗数据
    activeModal.componentInstance.data = AddGoodsPopupViewData.fromParent(this.viewData);
    activeModal.componentInstance.type = 1;//套餐
    activeModal.componentInstance.action = this.selectContentCallback.bind(this);
  }


  /**
   * 选择产品回调
   */
  selectContentCallback(): void {

    this.contentExpanded = true;

    this.packageContentList = new Array();

    this.packageContentList = AppUtils.addAll(this.packageContentList, this.viewData.choosedProductList);

    this.packageContentList = AppUtils.addAll(this.packageContentList, this.viewData.choosedGoodsList);

    this.totalPrice = 0;
    for (let item of this.packageContentList) {
      this.totalPrice += parseFloat(item.price.toString()) * item.count;
    }

    this.autoSetDiscount();
    if(this.packageContentList.length>0){
      AppUtils.showSuccess("提示", "选择套餐内容成功");
    }
  }

  /**
   * 删除选中产品
   * @param item
   */
  deleteItem(itemP: ProductData, index) {
    //删除显示列表
    Popup.getInstance().open("提示", "确定删除吗?", () => {
      this.packageContentList.forEach((item, index) => {
        if (item == itemP) {
          this.packageContentList.splice(index, 1);
          this.totalPrice -= parseFloat(item.price.toString()) * item.count;
        }
      });
      this.autoSetDiscount();

      //同步删除选中列表
      this.deleteChoosedProductList(itemP);
      this.deleteChoosedGoodsList(itemP);

      AppUtils.showSuccess("提示", "删除成功");
      this.service.handleViewData(this.viewData);
    });
  }


  private deleteChoosedProductList(itemP:ProductData){
    if (itemP.type == ItemTypeEnum.PRODUCT) {
      this.viewData.choosedProductList.forEach((item, index) => {
        if (item.id == itemP.id) {
          item.count = 1;
          this.viewData.choosedProductList.splice(index, 1);
        }
      });
    }
  }

  private deleteChoosedGoodsList(itemP:ProductData){
    if (itemP.type == ItemTypeEnum.GOODS) {
      this.viewData.choosedGoodsList.forEach((item, index) => {
        if (item.id == itemP.id) {
          item.count = 1;
          this.viewData.choosedGoodsList.splice(index, 1);
        }
      });
    }
  }

  /**
   * 查询选中产品详情
   * @param item
   */
  public async showDetail(item: ProductData) {
    if (item.type == ItemTypeEnum.PRODUCT) {
      await this.openProductInfoDetail(item);
    } else if (item.type == ItemTypeEnum.GOODS) {
      await this.openGoodsDetail(item);
    }
  }

  private async openProductInfoDetail(item: ProductData) {
    // const activeModal = this.modalService.open(ProductInfoDetailModalComponent, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(ProductInfoDetailModalComponent, null,null);


    let storeId = SessionUtil.getInstance().getStoreId();
    let productDetailId = storeId + "_" + item.id;
    let productDetail = await this.productDetailCacheDataHolder.getData(productDetailId);
    activeModal.componentInstance.productDetail = productDetail;
    activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  }

  private async openGoodsDetail(item: ProductData) {
    // const activeModal = this.modalService.open(GoodsDetailModalComponent, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(GoodsDetailModalComponent, null,null);

    let storeId = SessionUtil.getInstance().getStoreId();
    let goodsDetailId = storeId + "_" + item.id;
    let goodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId);
    activeModal.componentInstance.goodsDetail = goodsDetail;
    activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
  }


  private autoSetDiscount() {
    if(!this.sellPrice){
      return;
    }
    let totalPrice = 0;
    let price = this.sellPrice;
      this.packageContentList.forEach(item => {
        totalPrice += item.price * item.count;
        totalPrice = AppUtils.twoDecimal(totalPrice);
      });

    let rate: number = price / totalPrice;
    for (let item of this.packageContentList) {
        item.discountPrice = item.price * rate;
        item.discountPrice = AppUtils.twoDecimal(item.discountPrice);
        if (item.discountPrice > item.price) {
          item.discountPrice = item.price;
          return;
        }
    }


  }

}








