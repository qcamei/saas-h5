import {Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {
  AddProductPopup, AddProductPopupViewData,
} from "../../../zmComp/functionsComp/addProductPopup/AddProductPopup";
import {ChainGoodsSynDataHolder} from "../../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {AddGoodsPopup, AddGoodsPopupViewData} from "../../../zmComp/functionsComp/addGoodPopup/AddGoodsPopup";
import {ProductData, PackageContentCompViewData} from "./PackageContentCompViewData";
import {PackageContentCompService} from "./PackageContentCompService";
import {PackageContentViewDataMgr} from "./PackageContentCompViewDataMgr";
import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {Popup} from "../../../common/popup/popup";
import {GoodsDetailCacheDataHolder} from "../../../../bsModule/chainGoods/goodsDetailCacheSynHolder";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProductDetailCacheSynHolder} from "../../../../bsModule/chainProduct/chainProductDetailCacheSynHolder";
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
                
                 
            <zm_table_detail style="text-align: center;margin-top: 20px;">
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
                </zm_table_detail>
        </div>
      
       
  `,
  styles: [`
    thead th {
      font-weight: bold;
      background-color: #f4f6fa !important;
      border-bottom-width: 1px !important;
    }
    tbody tr{
      margin-top: -1px;
    }
    tbody tr:nth-of-type(odd){
      background-color: #ffffff;
    }
    tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
      background-color:#f9fafc;
    }
    tbody .c-tr:hover{
      background-color: #e7f3fd;
    }
    tbody a{cursor:pointer;}
    tbody a:hover{text-decoration: none;color: #4678fa !important;}
    
    th, td{
      vertical-align: middle !important;
      font-size: 14px;
      word-wrap:break-word;
      word-break: break-all;
    }
    .table-bordered thead th{
      border-bottom-width: 1px !important;
    }
    
    select::-ms-expand { display: none; }
    input[type=number] {
      -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    button:focus{
      box-shadow: none;
    }

    .scrollTable{
      border:none;
    }
    .scrollTable tbody {
      display: block;
      height: 400px;
      overflow-y: auto;
    }
    thead {
      display: table;
      width: -moz-calc(100% - 10px);
      width: calc(100% - 10px);
      width: 100%;
      table-layout: fixed;
    }
    tr{
      display: table;
      width: 100%;
    }
    .pos-r {
      position: relative
    }
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    }
    .cur-hand{
      cursor: pointer;
    }
    .text-center {
      text-align: center;
    }
    .color-theme {
      color: #4678fa;
    }
    .fz-14{
      font-size: 14px;
    } 
    tbody .c-tr:hover{
      background-color: #e7f3fd;
    }
    .mg-t-20{
      margin-top:20px;
    } 
    .mg-b-40{
      margin-bottom:40px;
    }
    .pd-l-20{
      padding-left:20px;
    } 
    .pd-r-10{
      padding-right: 10px;
    } 
    .pd-l-5{
      padding-left:5px;
    }
    .tables {
      font-size: 14px;
    }
    .tables thead th {
    white-space: nowrap;
    height:46px; 
    box-sizing:border-box;
    }
    .tables tbody tr td{
    padding:9px; 
    font-size: 14px;
    box-sizing:border-box;
    }
    .scroll-table tr td:nth-child(1){
      width: 30%;
    }
    .scroll-table tr td:nth-child(2){
      width: 40%;
    }
   
    .scrollTable{
 
    }
    .scrollTable tbody{
    height:auto;
    }
    .scrollTable tbody tr{
    border: 1px solid #e9ecef;
    }
    .scrollTable tbody tr:last-child{
    border-bottom:none ;
    }
   .c-arrow-down img{
    transform-origin:50% 50%;  
    transform: rotate(180deg);
    transition: all 0.5s;
  }

  .pd-l-5{
    padding-left:5px;
  }
  .my_color tr:hover{
    background:#e7f3fd;
  }
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

  constructor(private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainProductDetailCacheSynHolder: ChainProductDetailCacheSynHolder,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new PackageContentCompService(
      this.chainProductSynDataHolder,
      this.chainGoodsSynDataHolder);
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
    const activeModal = ZmModalMgr.getInstance().newModal(AddProductPopup, null,null);
    //设置弹窗数据
    activeModal.componentInstance.data = AddProductPopupViewData.fromParent(this.viewData);
    activeModal.componentInstance.type = 1;//套餐
    activeModal.componentInstance.action = this.selectContentCallback.bind(this);
  }

  /**
   * 弹出添加商品popup
   */
  selectGoods(): void {
    const activeModal = ZmModalMgr.getInstance().newModal(AddGoodsPopup, null,null);
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

    AppUtils.showSuccess("提示", "选择套餐内容成功");
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
    const activeModal = ZmModalMgr.getInstance().newModal(ProductInfoDetailModalComponent, null,null);
    let productDetail = await this.chainProductDetailCacheSynHolder.getData(item.id);
    activeModal.componentInstance.productDetail = productDetail;
    activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  }

  private async openGoodsDetail(item: ProductData) {
    const activeModal = ZmModalMgr.getInstance().newModal(GoodsDetailModalComponent, null,null);
    let goodsDetail = await this.goodsDetailCacheDataHolder.getData(item.id);
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








