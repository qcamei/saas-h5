import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";

import {Constants} from "../../../common/Util/Constants";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductCardDetail} from "../../../../bsModule/productCardDetail/data/ProductCardDetail";
import {ProductCardDetailCacheDataHolder} from "../../../../bsModule/productCardDetail/productCardDetailCacheDataHolder";
import {ProductDetailCacheDataHolder} from "../../../../bsModule/productDetail/ProductDetailCacheDataHolder";
import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreGoods} from "../../../../bsModule/storeGoods/data/StoreGoods";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {GoodsType} from "../../../../bsModule/storeGoods/data/GoodsType";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {PackageProjectType} from "../../../../bsModule/storePackageProject/data/PackageProjectType";
import {PackageProject} from "../../../../bsModule/storePackageProject/data/PackageProject";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {ProductCardItem} from "../../../../bsModule/productCardDetail/data/ProductCardItem";
import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {GoodsDetailCacheDataHolder} from "../../../../bsModule/goodsDetail/GoodsDetailCacheDataHolder";
import {PackageDetailModalComponent} from "../../../zmComp/functionsComp/packageDetailComp/PackageDetailModalComponent";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/packageProjectDetail/packageProjectDetailCacheDateHolder";
import {AppRouter} from "../../../../comModule/AppRouter";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

@Component({
  selector: 'page-storeCard-productCardDetail',
  templateUrl: 'productCardDetail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductCardDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ProductCardDetailService;
  public viewData: ProductCardDetailViewData;

  constructor(private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private productDetailCacheDataHolder: ProductDetailCacheDataHolder,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private packageProjectDetailCacheDataHolder:PackageProjectDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ProductCardDetailService(
      this.storeCardInfoViewDataMgr,
      this.productCardDetailCacheDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storePackageProjectSynDataHolder,
      this.storeCardInfoSynDataHolder
    );
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeProductCardDetailVD((viewDataP: ProductCardDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let prdCardId = params['prdCardId'];
      this.service.initViewData(prdCardId);
    });

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.paramsSub.unsubscribe();
    }
  }
  goEditPage(cardId){
    AppRouter.goEditProductCard(cardId);
  }

  /**
   * 查询选中产品详情
   * @param item
   */
  public async showDetail(item:ProductCardContentData){
    if(item.itemType == ProductCardItemEnum.PRODUCT){
      await this.openProductInfoDetail(item);
    }else if(item.itemType == ProductCardItemEnum.GOODS){
      await this.openGoodsDetail(item);
    }else if(item.itemType == ProductCardItemEnum.PACKAGE){
      await this.openPackageDetail(item);
    }

  }

  private async openProductInfoDetail(item:ProductCardContentData){
    // const activeModal = this.modalService.open(ProductInfoDetailModalComponent, {size: 'lg',backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(ProductInfoDetailModalComponent, null,null);
    let storeId = SessionUtil.getInstance().getStoreId();
    let productDetailId = storeId+"_"+item.id;
    let productDetail = await this.productDetailCacheDataHolder.getData(productDetailId);
    activeModal.componentInstance.productDetail = productDetail;
    activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  }

  private async openGoodsDetail(item:ProductCardContentData){
    // const activeModal = this.modalService.open(GoodsDetailModalComponent, {size: 'lg',backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(GoodsDetailModalComponent, null,null);
    let storeId = SessionUtil.getInstance().getStoreId();
    let goodsDetailId = storeId+"_"+item.id;
    let goodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId);
    activeModal.componentInstance.goodsDetail = goodsDetail;
    activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
  }

  private async openPackageDetail(item:ProductCardContentData){
    // const activeModal = this.modalService.open(PackageDetailModalComponent, {size: 'lg',backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(PackageDetailModalComponent, null,null);
    let storeId = SessionUtil.getInstance().getStoreId();
    // let packageDetailId = storeId+"_"+item.id;
    let packageDetail = await this.packageProjectDetailCacheDataHolder.getData(item.id);
    activeModal.componentInstance.packageDetail = packageDetail;
    activeModal.componentInstance.packageTypeMap = this.viewData.packageTypeMap;
  }
}

class ProductCardDetailService {

  constructor(private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,) {
  }

  public initViewData(prdCardId: string): void {
    this.storeCardInfoViewDataMgr.setProductCardDetailViewData(new ProductCardDetailViewData());

    this.buildViewData(prdCardId).then((viewDataTmp: ProductCardDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ProductCardDetailViewData) {
    this.storeCardInfoViewDataMgr.setProductCardDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param prdCardId:string
   * @returns Promise<ProductCardDetailViewData>
   */
  public async buildViewData(prdCardId: string): Promise<ProductCardDetailViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: ProductCardDetailViewData = new ProductCardDetailViewData();

    let storeProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    let storePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if(storeCardInfo){
      viewDataTmp.productCardTypeMap = storeCardInfo.getAllProductCardTypeMap();
    }
    if (storeProductInfo) {
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
      viewDataTmp.productInfoMap = storeProductInfo.getAllProductInfoMap();
    }
    if(storeGoods) {
      viewDataTmp.goodsTypeMap = storeGoods.getGoodsTypeMap();
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
    }
    if(storePackageProject) {
      viewDataTmp.packageTypeMap = storePackageProject.getAllPackageTypeMap();
      viewDataTmp.packageProjectMap = storePackageProject.getAllPackageProjectMap();
    }

    let target: ProductCardDetail = await this.productCardDetailCacheDataHolder.getData(prdCardId);
    if (!AppUtils.isNullObj(target)) {
      viewDataTmp.productCardDetail = target;
      viewDataTmp.productCardContentList = this.buildProductCardContentList(target,viewDataTmp);
    }

    return new Promise<ProductCardDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private buildProductCardContentList(target: ProductCardDetail,viewDataTmp: ProductCardDetailViewData){
    let packageContentList:Array<ProductCardContentData> = new Array<ProductCardContentData>();
    let productCardItems:Array<ProductCardItem> = new Array<ProductCardItem>();

    if(target.productCardItems==null){
      return;
    }
    for(let item of target.productCardItems){
      let productCardItem = new ProductCardItem();
      AppUtils.copy(productCardItem,item);
      productCardItems.push(productCardItem);
    }
    if(productCardItems){
      for(let item of productCardItems){
        let productCardContentData = new ProductCardContentData();
        productCardContentData.id = item.pgId;
        productCardContentData.count = item.count;
        productCardContentData.discountPrice = item.discountPrice;
        productCardContentData.itemType = item.itemType;
        if(parseInt(item.itemType.toString()) == ProductCardItemEnum.PRODUCT){
          if(viewDataTmp.productInfoMap){
            let productInfo:ProductInfo= viewDataTmp.productInfoMap.get(item.pgId.toString());
            if(productInfo){
              productCardContentData.name = productInfo.name;
              productCardContentData.number = productInfo.number;
              productCardContentData.price = productInfo.price;
            }
          }
        }else if(parseInt(item.itemType.toString()) == ProductCardItemEnum.GOODS){
          if(viewDataTmp.goodsMap){
            let goods:Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
            if(goods){
              productCardContentData.name = goods.name;
              productCardContentData.number = goods.number;
              productCardContentData.price = goods.price;
            }
          }
        }else if(parseInt(item.itemType.toString()) == ProductCardItemEnum.PACKAGE){
          if(viewDataTmp.packageProjectMap){
            let packageProject:PackageProject = viewDataTmp.packageProjectMap.get(item.pgId);
            if(packageProject){
              productCardContentData.name = packageProject.name;
              productCardContentData.number = packageProject.number;
              productCardContentData.price = packageProject.sellPrice;
            }
          }
        }
        packageContentList.push(productCardContentData);
      }
    }
    return packageContentList;
  }

}


export class ProductCardDetailViewData {
  storeCardInfo: StoreCardInfo = new StoreCardInfo();
  productCardDetail: ProductCardDetail = new ProductCardDetail();
  productCardContentList:Array<ProductCardContentData> = new Array<ProductCardContentData>();
  productCardTypeMap: ZmMap<PrdCardType>;

  productInfoMap: ZmMap<ProductInfo>;
  productTypeMap: ZmMap<ProductType>;

  goodsTypeMap:ZmMap<GoodsType>;
  goodsMap:ZmMap<Goods>;

  packageTypeMap:ZmMap<PackageProjectType>;
  packageProjectMap:ZmMap<PackageProject>;

  defaultImg: string = Constants.PRDCARD_DEFAULT_IMG;

}

export class ProductCardContentData{
  id:string;
  itemType:number;
  name:string;
  number:string;
  price:number;
  count:number;
  discountPrice:number;
}
