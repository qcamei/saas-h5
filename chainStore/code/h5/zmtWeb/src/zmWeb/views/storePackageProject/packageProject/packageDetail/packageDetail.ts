import {Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/packageProjectDetail/packageProjectDetailCacheDateHolder";
import {ActivatedRoute} from "@angular/router";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PackageProjectDetail} from "../../../../bsModule/packageProjectDetail/data/PackageProjectDetail";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {PackageItem} from "../../../../bsModule/packageProjectDetail/data/PackageItem";
import {PackageItemEnum} from "../../../../bsModule/packageProjectDetail/data/PackageItemEnum";
import {ProductDetailCacheDataHolder} from "../../../../bsModule/productDetail/ProductDetailCacheDataHolder";
import {GoodsDetailCacheDataHolder} from "../../../../bsModule/goodsDetail/GoodsDetailCacheDataHolder";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreGoods} from "../../../../bsModule/storeGoods/data/StoreGoods";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";

import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {PackageProjectType} from "../../../../bsModule/storePackageProject/data/PackageProjectType";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {GoodsType} from "../../../../bsModule/storeGoods/data/GoodsType";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {Constants} from "../../../common/Util/Constants";

@Component({
  selector: 'package-detail',
  templateUrl: 'packageDetail.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PackageDetailComp implements OnInit,OnDestroy{
  private viewDataSub: any;
  private paramsSub: any;
  private service: PackageDetailService;
  public viewData: PackageDetailViewData;

  constructor(private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private productDetailCacheDataHolder:ProductDetailCacheDataHolder,
              private goodsDetailCacheDataHolder:GoodsDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new PackageDetailService(
      this.storePackageProjectSynDataHolder,
      this.storePackageProjectViewDataMgr,
      this.packageDetailCacheDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storePackageProjectViewDataMgr.subscribePackageDetailVD((viewDataP: PackageDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let packageDetailId = params['id'];
      console.log("packageDetailId  " + packageDetailId);
      this.service.initViewData(packageDetailId);
    });

  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  public goEditPage(packageDetailId) {
    AppRouter.goEditPackageProject(packageDetailId);
  }

  /**
   * 查询选中产品详情
   * @param item
   */
  public async showDetail(item:PackageContentData){
    if(item.itemType == PackageItemEnum.PRODUCT){
      await this.openProductInfoDetail(item);
    }else if(item.itemType == PackageItemEnum.GOODS){
      await this.openGoodsDetail(item);
    }
  }

  private async openProductInfoDetail(item:PackageContentData){
    // const activeModal = this.modalService.open(ProductInfoDetailModalComponent, {size: 'lg',backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(ProductInfoDetailModalComponent, null,null);
    let storeId = SessionUtil.getInstance().getStoreId();
    let productDetailId = storeId+"_"+item.id;
    let productDetail = await this.productDetailCacheDataHolder.getData(productDetailId);
    activeModal.componentInstance.productDetail = productDetail;
    activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  }

  private async openGoodsDetail(item:PackageContentData){
    // const activeModal = this.modalService.open(GoodsDetailModalComponent, {size: 'lg',backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(GoodsDetailModalComponent, null,null);
    let storeId = SessionUtil.getInstance().getStoreId();
    let goodsDetailId = storeId+"_"+item.id;
    let goodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId);
    activeModal.componentInstance.goodsDetail = goodsDetail;
    activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
  }


}

export class PackageDetailService {
  constructor(private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,) {
  }

  public initViewData(packageDetailId: string): void {
    this.storePackageProjectViewDataMgr.setPackageDetailViewData(new PackageDetailViewData());

    this.buildViewData(packageDetailId).then((viewDataTmp: PackageDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: PackageDetailViewData) {
    this.storePackageProjectViewDataMgr.setPackageDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param prdId:number
   * @returns Promise<StorePrdInfoDetailViewData>
   */
  public async buildViewData(packageDetailId: string): Promise<PackageDetailViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: PackageDetailViewData = new PackageDetailViewData();
    let storeProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);

    if(storeProductInfo){
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
      viewDataTmp.productInfoMap = storeProductInfo.getAllProductInfoMap();
    }
    if(storeGoods){
      viewDataTmp.goodsTypeMap = storeGoods.getGoodsTypeMap();
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
    }

    let storePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    let target: PackageProjectDetail = await this.packageDetailCacheDataHolder.getData(packageDetailId);
    if (!AppUtils.isNullObj(target)) {
      viewDataTmp.packageDetail = target;
      viewDataTmp.packageContentList = this.buildPackageContentList(target,viewDataTmp);
    }
    if(storePackageProject){
      viewDataTmp.packageTypeMap = storePackageProject.getAllPackageTypeMap();
    }
    return new Promise<PackageDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private buildPackageContentList(target: PackageProjectDetail,viewDataTmp: PackageDetailViewData){
    let packageContentList:Array<PackageContentData> = new Array<PackageContentData>();
    let packageItems:Array<PackageItem> = new Array<PackageItem>();
    for(let item of target.packageItems){
      let packageItem = new PackageItem();
      AppUtils.copy(packageItem,item);
      packageItems.push(packageItem);
    }
    if(packageItems){
        for(let item of packageItems){
          let packageContentData = new PackageContentData();
          packageContentData.id = item.pgId;
          packageContentData.count = item.count;
          packageContentData.discountPrice = item.discountPrice;
          packageContentData.itemType = item.itemType;
          if(parseInt(item.itemType.toString()) == PackageItemEnum.PRODUCT){
            if(viewDataTmp.productInfoMap){
              let productInfo:ProductInfo= viewDataTmp.productInfoMap.get(item.pgId.toString());
              if(productInfo){
                packageContentData.name = productInfo.name;
                packageContentData.number = productInfo.number;
                packageContentData.price = productInfo.price;
              }
            }
          }else if(parseInt(item.itemType.toString()) == PackageItemEnum.GOODS){
            if(viewDataTmp.goodsMap){
              let goods:Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
              if(goods){
                packageContentData.name = goods.name;
                packageContentData.number = goods.number;
                packageContentData.price = goods.price;
              }
            }
          }
          packageContentList.push(packageContentData);
        }
    }
    return packageContentList;
  }

}

export class PackageDetailViewData {
  packageDetail: PackageProjectDetail = new PackageProjectDetail();
  packageContentList:Array<PackageContentData> = new Array<PackageContentData>();

  storePackageProject: StorePackageProject = new StorePackageProject();
  packageTypeMap:ZmMap<PackageProjectType>;

  productTypeMap:ZmMap<ProductType>;
  productInfoMap:ZmMap<ProductInfo>;

  goodsTypeMap:ZmMap<GoodsType>;
  goodsMap:ZmMap<Goods>;

  defaultImg:string = Constants.PACKAGE_DEFAULT_IMG;

}

export class PackageContentData{
  id:string;
  itemType:number;
  name:string;
  number:string;
  price:number;
  count:number;
  discountPrice:number;
}
