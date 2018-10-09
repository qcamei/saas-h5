import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {ActivatedRoute} from "@angular/router";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainGoodsSynDataHolder} from "../../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {GoodsType} from "../../../../bsModule/chainGoods/data/GoodsType";
import {PackageItemEnum} from "../../../../bsModule/chainPackageProject/data/PackageItemEnum";
import {PackageProjectDetail} from "../../../../bsModule/chainPackageProject/data/PackageProjectDetail";
import {PackageItem} from "../../../../bsModule/chainPackageProject/data/PackageItem";
import {ChainPackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectDetailCacheSynHolder";
import {GoodsDetailCacheDataHolder} from "../../../../bsModule/chainGoods/goodsDetailCacheSynHolder";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {Product} from "../../../../bsModule/chainProduct/data/Product";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {ChainProductDetailCacheSynHolder} from "../../../../bsModule/chainProduct/chainProductDetailCacheSynHolder";
import {Store} from "../../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {Constants} from "../../../common/Util/Constants";

@Component({
  selector: 'package-detail',
  templateUrl: 'packageDetail.html',
})
export class PackageDetailComp implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: PackageDetailService;
  public viewData: PackageDetailViewData;

  constructor(private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private chainProductDetailCacheSynHolder: ChainProductDetailCacheSynHolder,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new PackageDetailService(
      this.chainPackageProjectSynDataHolder,
      this.chainPackageProjectViewDataMgr,
      this.packageDetailCacheDataHolder,
      this.chainProductSynDataHolder,
      this.chainGoodsSynDataHolder,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainPackageProjectViewDataMgr.subscribePackageDetailVD((viewDataP: PackageDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let packageDetailId = params['id'];
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
  public async showDetail(item: PackageContentData) {
    if (item.itemType == PackageItemEnum.PRODUCT) {
      await this.openProductInfoDetail(item);
    } else if (item.itemType == PackageItemEnum.GOODS) {
      await this.openGoodsDetail(item);
    }
  }

  private async openProductInfoDetail(item: PackageContentData) {
    const activeModal = ZmModalMgr.getInstance().newModal(ProductInfoDetailModalComponent,null,null);

    let productDetail = await this.chainProductDetailCacheSynHolder.getData(item.id);
    activeModal.componentInstance.productDetail = productDetail;
    activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  }

  private async openGoodsDetail(item: PackageContentData) {
    const activeModal = ZmModalMgr.getInstance().newModal(GoodsDetailModalComponent,null,null);

    let goodsDetail = await this.goodsDetailCacheDataHolder.getData(item.id);
    activeModal.componentInstance.goodsDetail = goodsDetail;
    activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
  }


}

export class PackageDetailService {
  constructor(private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(packageDetailId: string): void {
    this.chainPackageProjectViewDataMgr.setPackageDetailViewData(new PackageDetailViewData());

    this.buildViewData(packageDetailId).then((viewDataTmp: PackageDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: PackageDetailViewData) {
    this.chainPackageProjectViewDataMgr.setPackageDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param prdId:number
   * @returns Promise<StorePrdInfoDetailViewData>
   */
  public async buildViewData(packageDetailId: string): Promise<PackageDetailViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: PackageDetailViewData = new PackageDetailViewData();
    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    let chainGoods: ChainGoods = await this.chainGoodsSynDataHolder.getData(chainId);

    if (chainProduct) {
      viewDataTmp.productTypeMap = chainProduct.getAllProductTypeMap();
      viewDataTmp.productInfoMap = chainProduct.getAllProductMap();
    }
    if (chainGoods) {
      viewDataTmp.goodsTypeMap = chainGoods.getAllGoodsTypeMap();
      viewDataTmp.goodsMap = chainGoods.getAllGoodsMap();
    }

    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    let target: PackageProjectDetail = await this.packageDetailCacheDataHolder.getData(packageDetailId);
    if (chainPackageProject) {
      viewDataTmp.packageTypeMap = chainPackageProject.getAllPackageTypeMap();
    }
    if (!AppUtils.isNullObj(target)) {
      viewDataTmp.packageDetail = target;
      viewDataTmp.packageContentList = this.buildPackageContentList(target, viewDataTmp);
      viewDataTmp.applyStoreName = await this.getApplyStoreNames(viewDataTmp.packageDetail.applyStoreIds);
    }

    return new Promise<PackageDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private async getApplyStoreNames(applyStoreIds:Array<string>){
    let chainId = SessionUtil.getInstance().getChainId();
    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    let storeList: Array<Store> = new Array<Store>();
    if (pageResp) {
      storeList = pageResp.list;
    }
    let storeListTmp = new Array<Store>();
    if (applyStoreIds) {
      for (let id of applyStoreIds) {
        storeList.forEach((item) => {
          if (item.id == id) {
            storeListTmp.push(item);
          }
        });
      }
    }
    let arr = new Array<string>();
    arr = storeListTmp.map((item) => {
      return item.name;
    });
    return arr.join("、");
  }

  private buildPackageContentList(target: PackageProjectDetail, viewDataTmp: PackageDetailViewData) {
    let packageContentList: Array<PackageContentData> = new Array<PackageContentData>();
    let packageItems: Array<PackageItem> = new Array<PackageItem>();
    for (let item of target.packageItems) {
      let packageItem = new PackageItem();
      AppUtils.copy(packageItem, item);
      packageItems.push(packageItem);
    }
    if (packageItems) {
      for (let item of packageItems) {
        let packageContentData = new PackageContentData();
        packageContentData.id = item.pgId;
        packageContentData.count = item.count;
        packageContentData.discountPrice = item.discountPrice;
        packageContentData.itemType = item.itemType;
        if (parseInt(item.itemType.toString()) == PackageItemEnum.PRODUCT) {
          if (viewDataTmp.productInfoMap) {
            let product: Product = viewDataTmp.productInfoMap.get(item.pgId.toString());
            if (product) {
              packageContentData.name = product.name;
              packageContentData.number = product.number;
              packageContentData.price = product.sellPrice;
            }
          }
        } else if (parseInt(item.itemType.toString()) == PackageItemEnum.GOODS) {
          if (viewDataTmp.goodsMap) {
            let goods: Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
            if (goods) {
              packageContentData.name = goods.name;
              packageContentData.number = goods.number;
              packageContentData.price = goods.sellPrice;
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
  packageContentList: Array<PackageContentData> = new Array<PackageContentData>();

  chainPackageProject: ChainPackageProject = new ChainPackageProject();
  packageTypeMap: ZmMap<PackageProjectType>;

  productTypeMap: ZmMap<ProductType>;
  productInfoMap: ZmMap<Product>;

  goodsTypeMap: ZmMap<GoodsType>;
  goodsMap: ZmMap<Goods>;

  applyStoreName:string;

  defaultImg:string = Constants.PACKAGE_DEFAULT_IMG;


}

export class PackageContentData {
  id: string;
  itemType: number;
  name: string;
  number: string;
  price: number;
  count: number;
  discountPrice: number;
}
