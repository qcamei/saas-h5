import {Component, Input, OnChanges} from "@angular/core";
import {AppointDataWraper, ProductCompData, ProductData} from "../../addAppointWraper/AddAppointDataWraper";
import {AppointDataWraperMgr} from "../../addAppointWraper/AddAppointDataWraperMgr";
import {ProductPopupViewData, ProductPopup} from "./ProductPopupComp/productPopupComp";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {LeaguerProductCard} from "../../../../bsModule/storeLeaguerInfo/data/LeaguerProductCard";
import {ProductCard} from "../../../../bsModule/storeCardInfo/data/ProductCard";
import {PrdInCardEnum} from "../../../../bsModule/storeCardInfo/data/PrdInCardEnum";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {ProductCardPopup, ProductCardPopupViewData} from "./productCardComp/productCardComp";
import {LeaguerDetailSynDataHolder} from "../../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {LeaguerDetail} from "../../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {Popup} from "../../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";


/**
 * 选择项目组件
 */
@Component({
  selector: 'product-comp',
  template: `
      <zm-card-box [withCollapse]="true" [expanded]="contentExpanded">
         <header>
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
              <div class="fz-18 text-bold" style="width:120px;">选择项目</div>
              <div class="cur-hand" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"(click)="selectProduct($event)">
                <img src="assets/images/icon/icon_Add.png" alt="">
                <span class="color-theme fz-14 " style="font-weight:normal;margin-left: 12px;" >项目</span>
              </div>
              <!--<div class="cur-hand" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectCard($event)">-->
                <!--<img src="assets/images/icon/icon_Add.png" alt="">-->
                <!--<span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >划卡</span>-->
              <!--</div>-->
            </div>
         </header>
         <content>
            <table class="scrollTable table table-bordered text-center  mg-t-20" *ngIf="productCompData.productList.length">
              <thead >
                  <th style="width:10%;">序号</th>
                  <th style="width:10%;">类型</th>
                  <th style="width:10%;">名称</th>
                  <th style="width:10%;">数量</th>
                  <th style="width:10%;">结算方式</th>
                  <th style="width:10%;">操作</th>
              </thead>
              <tbody class="mg-b-20">
                  <tr *ngFor="let item of productCompData.productList;let i=index;">
                      <td style="width:10%;">{{i+1}}</td>
                      <td style="width:10%;">{{item.type | orderItemTypePipeComp}}</td>
                      <td style="width:10%;">{{item.name}}</td>
                      <td style="width:10%;">
                          <div class="pos-r align-center disFlex">
                            <i class="fa fa-pencil pos-a" style="color:#4678fa;left:5px;"></i>
                            <input type="number"  oninput="if(value<=0){value=null} else if(value>999){value=value.slice(0,3)}" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="setCount(item)">
                          </div>
                      </td>
                      <td style="width:10%;">{{item.payType == 0?'现结':'划卡'}}</td>
                      <td style="width:10%;color:#4678fa;"><span class="cur-hand" (click)="deleteItem(item,i)">删除</span></td>
                  </tr>
              </tbody>
          </table>
          <div  class="noData-tips text-center mt-3 mb-3" *ngIf="!productCompData.productList.length">
              <p class="mg-b-0" style="color:#999;">请点击上方进行添加项目</p>
          </div>
         </content>
      </zm-card-box>
  `,
  styles: [`
    thead th {
      font-weight: bold;
      background-color: #f4f6fa !important;
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
    tbody a:hover{text-decoration: none;color:#03a9f4 !important;}
    
    th, td{
      vertical-align: middle !important;
      font-size: 14px;
      word-wrap:break-word;
      word-break: break-all;
    }
    thead th{
      border-bottom-width: 1px !important;
    }
    select.form-control:not([size]):not([multiple]){
      -moz-appearance: none;
      -webkit-appearance: none;
      background-image:url(./assets/images/arrow.png);
      background-repeat: no-repeat;
      background-position:95% 50%;
      font-size: 14px;
      padding-right: 25px;
    }
    select.c-form-select:not([size]):not([multiple]){
      -moz-appearance: none;
      -webkit-appearance: none;
      background-image:url(./assets/images/arrow.png);
      background-repeat: no-repeat;
      background-position:95% 50%;
      font-size: 14px;
      padding-right: 25px;
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
    
    .table {
      font-size: 14px;
    }
    .table thead th {
    white-space: nowrap;
    padding:5px 2px;  
    box-sizing:border-box;
    }
    .table tbody tr td{
    padding:8px; 
    font-size: 14px;
    box-sizing:border-box;
    }
    .scroll-table tr td:nth-child(1){
      width: 30%;
    }
    .scroll-table tr td:nth-child(2){
      width: 40%;
    }
    .fa-pencil{
    top:2px;
    }
    .scrollTable{
    border-bottom: 1px solid #e9ecef;
    }
    .scrollTable tbody{
    max-height:200px;
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
    .mg-t-20{
    margin-top:20px;
    } 
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .flex {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      -webkit-flex: 1;
         -moz-box-flex: 1;
              flex: 1;
    } 
    .align-center{
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    } 
    .pd-l-30{
      padding-left: 30px;
    } 
    .font-bold{
      font-weight: bold;
    } 
    .fz-18{
      font-size:18px;
    } 
    .cur-hand{
    cursor: pointer;
    }
    .color-theme{
      color:#03a9f4;
    } 
    .fz-14{
      font-size:14px;
    } 
    .pd-l-20{
      padding-left: 20px;
    } 
  
    .mg-b-20{
      margin-bottom: 20px;
    }
    .pos-r{
      position: relative;
    } 
    .pos-a{
      position: absolute;
    } 
    .pd-r-10{
      padding-right:10px;
    } 
    .text-center{
      text-align: center;
    } 
    .mg-b-0{
      margin-bottom: 0;
    }
  `]
})

export class ProductComp implements OnChanges {

  private service: ProductCompService;
  public viewData: ProductCompViewData = new ProductCompViewData();
  public contentExpanded = false;

  @Input() appointWraper: AppointDataWraper;
  public leaguerId: string = "";
  public productCompData: ProductCompData;


  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              public matDialog: MatDialog,
              private appointDataWraperMgr: AppointDataWraperMgr,) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new ProductCompService(
      this.storeProductInfoSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.leaguerDetailSynDataHolder);
  }

  ngOnChanges() {
    if (this.appointWraper && this.appointWraper.getLeaguerCompData().selectLeaguer) {
      this.productCompData = this.appointWraper.getProductCompData();
      let leaguerId = this.productCompData.leaguerId;
      if (this.leaguerId != leaguerId && this.viewData) {
        this.leaguerId = this.appointWraper.getLeaguerCompData().selectLeaguer.id;
        if (this.leaguerId) {
          this.service.initViewData(this.leaguerId, (viewDataTmp: ProductCompViewData) => {
            if (viewDataTmp) {
              this.viewData = viewDataTmp;
            }
          });
        }
      }
    }
  }

  /**
   * 弹出选择项目popup
   */
  selectProduct(event): void {
    event.stopPropagation();
    let modalData = ProductPopupViewData.fromComp(this.viewData);
    let callBack = this.selectProductCallback.bind(this);

    ZmModalMgr.getInstance().newLgModal(ProductPopup, modalData, callBack);
  }

  /**
   * 弹出选择划卡popup
   */
  selectCard(event): void {
    event.stopPropagation();
    let modalData = ProductCardPopupViewData.fromComp(this.viewData);
    let callBack = this.selectProductCallback.bind(this);

    ZmModalMgr.getInstance().newLgModal(ProductCardPopup, modalData, callBack);
  }

  /**
   * 选择项目、划卡回调
   */
  selectProductCallback(): void {
    //项目
    this.contentExpanded = true;
    let productList = this.viewData.choosedProductList.map((item) => {
      return ProductData.fromProduct(item);
    });

    //划卡项目
    let cardProductList = this.viewData.choosedCardProductList.map((item) => {
      return ProductData.fromCardProduct(item);
    });

    this.productCompData.productList = AppUtils.addAll(productList, cardProductList);
    AppUtils.showSuccess("提示", "选择项目成功");
    this.appointDataWraperMgr.refreshWraper(this.appointWraper);
  }

  /**
   * 删除选中项目
   * @param item
   */
  deleteItem(itemP: ProductData, index) {
    Popup.getInstance().open("提示", "确定删除吗?", () => {
      this.productCompData.productList.forEach((item, index) => {
        if (item == itemP) {
          this.productCompData.productList.splice(index, 1);
        }
      });

      if (itemP.payType == 0) {
        this.viewData.choosedProductList.forEach((item, index) => {
          if (item.id == itemP.id) {
            this.viewData.choosedProductList.splice(index, 1);
          }
        });
      }

      if (itemP.payType == 1) {
        this.viewData.choosedCardProductList.forEach((item, index) => {
          if (item.productId == itemP.id) {
            this.viewData.choosedCardProductList.splice(index, 1);
          }
        });
      }
      AppUtils.showSuccess("提示", "删除成功");
      this.appointDataWraperMgr.refreshWraper(this.appointWraper);
    });
  }

  /**
   * 修改选中项目的数量
   * @param item
   */
  setCount(itemP: ProductData) {
    if (itemP.payType == 1) {//划卡项目 检查剩余次数
      this.viewData.productWithCardList.forEach((itemTmp) => {
        if (itemTmp.productId == itemP.id && itemTmp.productCardId == itemP.productCardId) {
          if (itemP.userType == PrdInCardEnum.LIMITTIME) {
            if (itemP.count > itemTmp.count) {//大于剩余次数
              AppUtils.showWarn("提示", "划卡次数不能大于剩余次数");
              itemP.count = 1;
            }
          }
        }
      });

    }
    this.productCompData.productList.forEach((item) => {
      if (item.id == itemP.id) {
        item = itemP;
      }
    });

  }

}

export class ProductCompService {

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder) {
  }

  /**
   * @param leaguerId
   * @param callback
   */
  public async initViewData(leaguerId, callback: (viewDataP: ProductCompViewData) => void) {

    let viewDataTmp = new ProductCompViewData();

    //请求storeProductInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    if (storeProductInfo) {
      //店铺项目
      viewDataTmp.productMap = storeProductInfo.getProductInfoMap();//会员已购买次卡的项目
      viewDataTmp.openProductMap = storeProductInfo.getOpenProductInfoMap();//只显示上架项目
      viewDataTmp.productList = viewDataTmp.openProductMap.values();//只显示上架项目
      viewDataTmp.productTypeMap = storeProductInfo.getProductTypeMap();
      viewDataTmp.productTypeList = viewDataTmp.productTypeMap.values();
    }

    //请求storeCardInfo
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if (storeCardInfo) {
      viewDataTmp.productCardMap = storeCardInfo.getOpenProductCardMap();//店铺上架次卡
    }

    viewDataTmp.leaguer = await this.leaguerDetailSynDataHolder.getData(leaguerId);
    if (viewDataTmp.leaguer) {
      viewDataTmp.leaguerPrdCardMap = viewDataTmp.leaguer.getValidLeaguerProductCardMap();
    }

    viewDataTmp.flag = true;
    callback(viewDataTmp);
  }

}


export class ProductCompViewData {
  /********项目数据*************/
  public storeProductInfo: StoreProductInfo = new StoreProductInfo();
  public productMap: ZmMap<ProductInfo>;
  public openProductMap: ZmMap<ProductInfo>;
  public productTypeMap: ZmMap<ProductType>;

  public productTypeList: Array<ProductType>;
  public productList: Array<ProductInfo> = new Array();

  //选中的项目列表
  public choosedProductList: Array<ProductInfo> = new Array();
  public choosedProductListTmp: Array<ProductInfo> = new Array();

  /********会员划卡数据*************/
  public productCardMap: ZmMap<ProductCard>;

  //已选中的会员
  public leaguer: LeaguerDetail;
  //选中会员的次卡map
  public leaguerPrdCardMap: ZmMap<LeaguerProductCard>;


  public productWithCardList: Array<ProductWithCardData> = new Array();
  public productWithCardListTmp: Array<ProductWithCardData> = new Array();
  //选中的次卡项目
  public choosedCardProductList: Array<ProductWithCardData> = new Array();
  public choosedCardProductListTmp: Array<ProductWithCardData> = new Array();

  /*********页面展示数据********/
  public flag: boolean = false;//是否已初始化数据

}

//页面显示的列表项组装数据bean
export class ProductWithCardData {
  public productCardType: number;//次卡类型
  public productId: string = "0";//项目id
  public productNumber: string;//项目编号
  public productName: string = "";//项目名称
  public productTypeId: string = "0";//项目类型id
  public productCardId: string = "";//所属次卡id
  public productCardName: string;//所属次卡名称
  public totalCount: number = 0;//总次数
  public count: number = 0;//剩余次数
  public userType: number;//次卡使用类型  永久、限次数
  public endTime: string;//到期时间
  public isNew: boolean = false;//是否新购

  public productPrice: number = 0;//项目价格 用于结算列表显示
}

