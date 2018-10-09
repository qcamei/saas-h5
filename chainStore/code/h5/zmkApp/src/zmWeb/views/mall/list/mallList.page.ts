import {Component, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils} from '../../../comModule/AppUtils';
import {IonicPage} from "ionic-angular";
import {ZmkShopCart} from "../../zmBSComp/zmk/ZmkShopCart";
import {MallListService} from "./mallListService";
import {MallListViewData, PreOrderData} from "./mallListViewData";
import {MallListViewDataMgr} from "./mallListViewDataMgr";
import {MallItemEnum} from "../../../comModule/enum/MallItemEnum";
import {AddOrderService} from "../addOrder/addOrder.page";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";


@IonicPage({
  name: "mallList",
  segment: 'mallList'
})
@Component({
  template: `
            <zm-root-page-header *ngIf="!viewData.isSearch"></zm-root-page-header>
            <zmk-goods-search-header *ngIf="viewData.isSearch" [title]="'搜索'" (back)="backMallIndex()"></zmk-goods-search-header>
           
            <zm-page-content>            
            <!--分类列表-->
            <zm-search-box *ngIf="!viewData.isSearch" [placeholder]="'请输入名称'" [(zmValue)]="viewData.nameOrNumber"  (click)="goSearch()"></zm-search-box>
            <zm-tabs-custom *ngIf="!viewData.isSearch" [tabList]="viewData.tabList" [(zmValue)]="viewData.selectedTab" (onChange)="switchTab()"></zm-tabs-custom>
            
           <div>
            <ion-grid no-padding *ngIf="!viewData.isSearch">
              <ion-row no-padding>
               
                <ion-col  no-padding col-3 class="bg-gray pull-h" style="padding-bottom:10px;">
                  <div *ngFor="let item of viewData.projectTypeList;let index = index" 
                    [class.bg-white]="viewData.isActive==index"  (click)="changeType(index,item.id)" 
                    fxLayout="row" fxLayoutAlign="center center" style="height:50px;">
                    <span overflow-hidden-2  >{{item.name}}</span>
                  </div>
                </ion-col>

                <!--右边区域-->
               <ion-col   col-9 class="pull-h" style="padding-bottom:10px;">
                  <ion-list *ngFor="let item of viewData.projectListShow">
                  <zmk-goods-item zmk-item-lg  *ngIf="item"  imgSrc="{{item.defaultImg|zmImgPath}}" name="{{item.name}}" price="{{item.price}}"  promotionPrice="{{item.promotionPrice}}" typeName="{{item.typeName}}" hotSales="{{item.promotionFlag}}" [(zmCount)] = "item.count" (zmCountChange)="getTotalData()"></zmk-goods-item>
                  </ion-list>
                  <zm-no-data *ngIf="viewData.loadingFinish && viewData.projectListShow.length==0" ></zm-no-data>
                </ion-col>
                
              </ion-row>
           </ion-grid>
            <!--分类列表-->
           
           <!--搜索-->
            <zm-search-box *ngIf="viewData.isSearch" [placeholder]="'请输入名称'" [(zmValue)]="viewData.nameOrNumber"  (callBack)="getListByName()"></zm-search-box>
           <ion-grid no-padding *ngIf="viewData.isSearch">
              <ion-row no-padding>
                
                <ion-col style="padding-bottom:10px;height:70vh;  overflow-y:scroll;">
            
                  <ion-list zmk-item-lg *ngFor="let item of viewData.projectListShow">
                  <zmk-goods-item zmk-item-lg  *ngIf="item"  imgSrc="{{item.defaultImg|zmImgPath}}" name="{{item.name}}" price="{{item.price}}"  promotionPrice="{{item.promotionPrice}}" typeName="{{item.typeName}}" hotSales="{{item.promotionFlag}}" [(zmCount)] = "item.count" (zmCountChange)="getTotalData()"></zmk-goods-item>
                  </ion-list>
                  <zm-no-data *ngIf="viewData.loadingFinish && viewData.projectListShow.length==0" ></zm-no-data>
                </ion-col>
              </ion-row>
           </ion-grid>
           <!--搜索-->
          </div>
           <!--底部-->
            <ion-footer style="margin-bottom:42px;">
             <zmk-shop-cart [itemList]="viewData.buyProjectList" (callback)="goAddOrder($event)"></zmk-shop-cart>
            </ion-footer>
            <!--底部-->
            
         </zm-page-content>

    `,
  styles: [`
      .bg-white{
        background:#ffffff;
        color:#4678FA;
      }
      [bg-shopping]{
        background:#4C4C4C;
      }
      `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MallListPage {
  private service: MallListService;
  public viewData: MallListViewData;

  @ViewChild(ZmkShopCart) loadRef: ZmkShopCart;

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new MallListService();

    let initData = new MallListViewData();
    MallListViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MallListViewData) => {
      this.viewData = viewDataP;
      this.doForAnimate();
      this.cdRef.markForCheck();
    });
  }

  ionViewWillEnter() {
    this.animateItems = [];
  }

  ionViewDidEnter() {
    this.service.initViewData();
  }

  public animateItems = [];

  doForAnimate() {
    let target = this;
    for (let i = 0; i < target.viewData.projectListShow.length; i++) {
      setTimeout(function () {
        target.animateItems.push(target.viewData.projectListShow[i]);
      }, 200 * i + 500);
    }
  }

  //搜索页面
  public goSearch() {
    this.viewData.isSearch = true;
    this.viewData.projectListShow = this.service.filterByNameOrNumber(this.viewData.projectList, "");
    this.animateItems = [];
    this.doForAnimate();
  }

  //回商城首页
  public backMallIndex() {
    this.viewData.isSearch = false;
    this.service.initViewData();
    this.animateItems = [];
    this.doForAnimate();
  }


  /**
   * 切换产品类型
   */
  switchTab() {
    if (!AppUtils.isNullObj(this.viewData.selectedTab)) {
      this.getTabList();
      this.animateItems = [];
      this.doForAnimate();
    }
  }

  getTabList() {
    let itemType = this.viewData.selectedTab.value;
    this.viewData.itemType = itemType;
    let typeId = "";
    if (itemType == MallItemEnum.Product) {
      typeId = this.viewData.productFirstTypeId;
      this.viewData.projectTypeList = this.viewData.validProductTypeList;
    } else if (itemType == MallItemEnum.Package) {
      typeId = this.viewData.packageFirstTypeId;
      this.viewData.projectTypeList = this.viewData.validPackageTypeList;
    } else if (itemType == MallItemEnum.ProductCard) {
      typeId = this.viewData.productCardFirstTypeId;
      this.viewData.projectTypeList = this.viewData.validProductCardTypeList;
    } else {
      typeId = this.viewData.goodsFirstTypeId;
      this.viewData.projectTypeList = this.viewData.validGoodsTypeList;
    }
    this.viewData.projectListShow = this.service.filterByType(this.viewData.projectList, typeId, itemType);
  }

  /**
   * 切换产品分类
   */
  public changeType(index: number,typeId:string) {
    this.viewData.isActive = index;
    this.viewData.projectListShow = this.service.filterByType(this.viewData.projectList,typeId,this.viewData.itemType);
    this.animateItems = [];
    this.doForAnimate();
  }

 /**
  * 按产品名称查询*/
  public getListByName() {
    let nameOrNumber = AppUtils.trimBlank(this.viewData.nameOrNumber);
    this.viewData.projectListShow = this.service.filterByNameOrNumber(this.viewData.projectList, nameOrNumber);
    this.animateItems = [];
    this.doForAnimate();
  }


  public getTotalData() {
    this.viewData.buyProjectList = this.viewData.projectList.filter((item) => {
      if (item.count > 0) {
        return item;
      }
    });
    this.loadRef.reSumPrice();
  }

  public goAddOrder(totalPrice: number){
    let preOrderData = new PreOrderData();
    preOrderData.totalPrice = totalPrice;
    preOrderData.buyProjectList = this.viewData.buyProjectList.filter((item)=>{return item.count>0});
    this.viewData.buyProjectList.forEach((item)=>{
      if(item.promotionFlag == PromotionFlagEnum.No){//非促销产品
        let sellPrice = item.price*item.count*(item.discount/10);
        preOrderData.totalDisCountPrice += parseInt((sellPrice*100).toString())/100;
      }
    });
    this.viewData.buyProjectList.forEach((item)=>{//促销产品不参与打折
      if(item.promotionFlag == PromotionFlagEnum.No){
        let sellPrice = item.price*item.count;
        preOrderData.totalDisCountPrice += parseInt((sellPrice*100).toString())/100;
      }
    });
    AppRouter.getInstance().goAddOrderPage();
    AddOrderService.setPreOrderData(preOrderData);
  }

}





