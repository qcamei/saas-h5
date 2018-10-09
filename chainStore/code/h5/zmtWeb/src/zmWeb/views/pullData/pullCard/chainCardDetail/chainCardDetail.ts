import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {Constants} from "../../../common/Util/Constants";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PullDataViewDataMgr} from "../../pullViewDataMgr";
import {ChainProductMgr} from "../../../../bsModule/chainProduct/ChainProductMgr";
import {ChainGoodsMgr} from "../../../../bsModule/chainGoods/ChainGoodsMgr";
import {ChainPackageProjectMgr} from "../../../../bsModule/chainPackageProject/ChainPackageProjectMgr";
import {ChainCardMgr} from "../../../../bsModule/chainCard/ChainCardMgr";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {Product} from "../../../../bsModule/chainProduct/data/Product";
import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {GoodsType} from "../../../../bsModule/chainGoods/data/GoodsType";
import {PackageProject} from "../../../../bsModule/chainPackageProject/data/PackageProject";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {ProductCardDetail} from "../../../../bsModule/chainCard/data/ProductCardDetail";
import {ProductCardItemEnum} from "../../../../bsModule/chainCard/data/ProductCardItemEnum";

@Component({
  selector: 'chain-card-detail',
  templateUrl: 'chainCardDetail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChainCardDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ChainCardDetailService;
  public viewData: ChainCardDetailViewData;

  constructor(private chainProductMgr: ChainProductMgr,
              private chainGoodsMgr: ChainGoodsMgr,
              private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainCardMgr:ChainCardMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ChainCardDetailService(
      this.chainProductMgr,
      this.chainGoodsMgr,
      this.chainPackageProjectMgr,
      this.chainCardMgr,
      this.pullDataViewDataMgr
    );
  }

  ngOnInit() {
    this.viewDataSub = this.pullDataViewDataMgr.subscribeCardDetailVD((viewDataP: ChainCardDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.service.initViewData(id);
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
  // public async showDetail(item:ProductCardContentData){
  //   if(item.itemType == ProductCardItemEnum.PRODUCT){
  //     await this.openProductInfoDetail(item);
  //   }else if(item.itemType == ProductCardItemEnum.GOODS){
  //     await this.openGoodsDetail(item);
  //   }else if(item.itemType == ProductCardItemEnum.PACKAGE){
  //     await this.openPackageDetail(item);
  //   }
  //
  // }
  //
  // private async openProductInfoDetail(item:ProductCardContentData){
  //   const activeModal = this.modalService.open(ProductInfoDetailModalComponent, {size: 'lg',backdrop:'static'});
  //   let storeId = SessionUtil.getInstance().getStoreId();
  //   let productDetailId = storeId+"_"+item.id;
  //   let productDetail = await this.productDetailCacheDataHolder.getData(productDetailId);
  //   activeModal.componentInstance.productDetail = productDetail;
  //   activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  // }
  //
  // private async openGoodsDetail(item:ProductCardContentData){
  //   const activeModal = this.modalService.open(GoodsDetailModalComponent, {size: 'lg',backdrop:'static'});
  //   let storeId = SessionUtil.getInstance().getStoreId();
  //   let goodsDetailId = storeId+"_"+item.id;
  //   let goodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId);
  //   activeModal.componentInstance.goodsDetail = goodsDetail;
  //   activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
  // }
  //
  // private async openPackageDetail(item:ProductCardContentData){
  //   const activeModal = this.modalService.open(PackageDetailModalComponent, {size: 'lg',backdrop:'static'});
  //   let storeId = SessionUtil.getInstance().getStoreId();
  //   // let packageDetailId = storeId+"_"+item.id;
  //   let packageDetail = await this.packageProjectDetailCacheDataHolder.getData(item.id);
  //   activeModal.componentInstance.packageDetail = packageDetail;
  //   activeModal.componentInstance.packageTypeMap = this.viewData.packageTypeMap;
  // }

}

class ChainCardDetailService {

  constructor(private chainProductMgr: ChainProductMgr,
              private chainGoodsMgr: ChainGoodsMgr,
              private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainCardMgr:ChainCardMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,) {
  }

  public initViewData(prdCardId: string): void {
    this.pullDataViewDataMgr.setCardDetailViewData(new ChainCardDetailViewData());

    this.buildViewData(prdCardId).then((viewDataTmp: ChainCardDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ChainCardDetailViewData) {
    this.pullDataViewDataMgr.setCardDetailViewData(viewDataP);
  }

  public async buildViewData(prdCardId: string): Promise<ChainCardDetailViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: ChainCardDetailViewData = new ChainCardDetailViewData();

    let chainProduct: ChainProduct = await this.chainProductMgr.get(chainId);
    let chainGoods: ChainGoods = await this.chainGoodsMgr.get(chainId);
    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectMgr.get(chainId);
    let chainCard: ChainCard = await this.chainCardMgr.get(chainId);
    if(chainCard){
      viewDataTmp.productCardTypeMap = ZmMap.fromMap(PrdCardType,"id",chainCard.prdCardTypeMap);
    }
    if (chainProduct) {
      viewDataTmp.productTypeMap = ZmMap.fromMap(ProductType,"id",chainProduct.productTypeMap);
      viewDataTmp.productInfoMap = ZmMap.fromMap(Product,"id",chainProduct.productInfoMap);
    }
    if(chainGoods) {
      viewDataTmp.goodsTypeMap = ZmMap.fromMap(GoodsType,"id",chainGoods.goodsTypeMap);
      viewDataTmp.goodsMap = ZmMap.fromMap(Goods,"id",chainGoods.goodsMap);
    }
    if(chainPackageProject) {
      viewDataTmp.packageTypeMap = ZmMap.fromMap(PackageProjectType,"id",chainPackageProject.packageProjectTypeMap);
      viewDataTmp.packageProjectMap = ZmMap.fromMap(PackageProject,"id",chainPackageProject.packageProjectMap);
    }

    let target: ProductCardDetail = await this.chainCardMgr.findProductCardDetail(prdCardId,chainId);
    if (!AppUtils.isNullObj(target)) {
      viewDataTmp.productCardDetail = target;
      viewDataTmp.productCardContentList = this.buildProductCardContentList(target,viewDataTmp);
    }

    return new Promise<ChainCardDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private buildProductCardContentList(target: ProductCardDetail,viewDataTmp: ChainCardDetailViewData){
    let packageContentList:Array<ProductCardContentData> = new Array<ProductCardContentData>();

    if(target.productCardItems){
      for(let item of target.productCardItems){
        let productCardContentData = new ProductCardContentData();
        productCardContentData.id = item.pgId;
        productCardContentData.count = item.count;
        productCardContentData.discountPrice = item.discountPrice;
        productCardContentData.itemType = item.itemType;
        if(parseInt(item.itemType.toString()) == ProductCardItemEnum.PRODUCT){
          if(viewDataTmp.productInfoMap){
            let productInfo:Product= viewDataTmp.productInfoMap.get(item.pgId.toString());
            if(productInfo){
              productCardContentData.name = productInfo.name;
              productCardContentData.number = productInfo.number;
              productCardContentData.price = productInfo.sellPrice;
            }
          }
        }else if(parseInt(item.itemType.toString()) == ProductCardItemEnum.GOODS){
          if(viewDataTmp.goodsMap){
            let goods:Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
            if(goods){
              productCardContentData.name = goods.name;
              productCardContentData.number = goods.number;
              productCardContentData.price = goods.sellPrice;
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


export class ChainCardDetailViewData {
  productCardDetail: ProductCardDetail = new ProductCardDetail();
  productCardContentList:Array<ProductCardContentData> = new Array<ProductCardContentData>();
  productCardTypeMap: ZmMap<PrdCardType>;

  productInfoMap: ZmMap<Product>;
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
