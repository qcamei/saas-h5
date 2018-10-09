import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {MallListViewData, MallItemData} from "./mallListViewData";
import {MallListViewDataMgr} from "./mallListViewDataMgr";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {MallItemEnum} from "../../../comModule/enum/MallItemEnum";

export class MallListService {

  constructor() {
  }

  public initViewData() {

    this.buildViewData((viewDataP: MallListViewData) => {
      this.handleViewData(viewDataP);
    }).catch(error => {
      AppUtils.showRestError(error);
    });

  }

  public handleViewData(viewDataP: MallListViewData) {
    MallListViewDataMgr.getInstance().setData(viewDataP);
  }

  /**
   * 组装StoreMallListViewData
   * @param storeId
   * @param status
   * @returns goodsmise<StoreMallListViewData>
   */

  public async buildViewData(callback: (viewDataP: MallListViewData) => void) {

    let storeId = SessionUtil.getInstance().getCurStoreId();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let viewDataTmp: MallListViewData = new MallListViewData();

    let leaguerId = AppUtils.format("{0}_{1}", storeId, cuserId);
    let leaguerDetail: LeaguerDetail = await LeaguerDetailMgr.getInstance().get(storeId, leaguerId);
    let storeCardInfo: StoreCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(storeId);

    if (leaguerDetail && leaguerDetail.leaguerMemberCard) {
      let memCardId = leaguerDetail.leaguerMemberCard.cardId;
      if (storeCardInfo) {
        viewDataTmp.memCard = storeCardInfo.getMemberCardMap().get(memCardId);
        viewDataTmp.allProductCardTypeMap = storeCardInfo.getAllProductCardTypeMap();
        viewDataTmp.validProductCardTypeList = storeCardInfo.getValidProductCardTypeMap().values();
        viewDataTmp.openProductCardMap = storeCardInfo.getOpenProductCardMap();
      }
    }

    let storeGoods: StoreGoods = await StoreGoodsSynDataHolder.getInstance().getData(storeId);
    if (storeGoods) {
      viewDataTmp.allGoodsTypeMap = storeGoods.getAllGoodsTypeMap();
      viewDataTmp.validGoodsTypeList = storeGoods.getValidGoodsTypeList();
      viewDataTmp.openGoodsMap = storeGoods.getOpenGoodsMap();
    }

    let storeProductInfo: StoreProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(storeId);
    if (storeProductInfo) {
      viewDataTmp.allProductTypeMap = storeProductInfo.getAllProductTypeMap();
      viewDataTmp.validProductTypeList = storeProductInfo.getValidProductTypeList();
      viewDataTmp.openProductMap = storeProductInfo.getOpenProductInfoMap();
    }

    let storePackageProject: StorePackageProject = await StorePackageProjectSynDataHolder.getInstance().getData(storeId);
    if (storePackageProject) {
      viewDataTmp.allPackageTypeMap = storePackageProject.getAllPackageTypeMap();
      viewDataTmp.validPackageTypeList = storePackageProject.getValidPackageTypeMap().values();
      viewDataTmp.openPackageMap = storePackageProject.getOpenPackageProjectMap();
    }

    let mallListTmp: Array<MallItemData> = new Array<MallItemData>();

    let openGoodsList = viewDataTmp.openGoodsMap.values();
    let goodsListTmp: Array<MallItemData> = this.buildGoodsList(openGoodsList, viewDataTmp.allGoodsTypeMap, viewDataTmp.memCard);

    let openProductList = viewDataTmp.openProductMap.values();
    let productListTmp: Array<MallItemData> = this.buildProductList(openProductList, viewDataTmp.allProductTypeMap, viewDataTmp.memCard);
    if (viewDataTmp.validProductTypeList.length > 0) {
      viewDataTmp.productFirstTypeId = viewDataTmp.validProductTypeList[0].id;
    }

    let openPackageList = viewDataTmp.openPackageMap.values();
    let packageListTmp: Array<MallItemData> = this.buildPackageList(openPackageList, viewDataTmp.allPackageTypeMap, viewDataTmp.memCard);
    if (viewDataTmp.validPackageTypeList.length > 0) {
      viewDataTmp.packageFirstTypeId = viewDataTmp.validPackageTypeList[0].id;
    }

    let openProductCardList = viewDataTmp.openProductCardMap.values();
    let productCardListTmp: Array<MallItemData> = this.buildProductCardList(openProductCardList, viewDataTmp.allProductCardTypeMap, viewDataTmp.memCard);
    if (viewDataTmp.validProductCardTypeList.length > 0) {
      viewDataTmp.productCardFirstTypeId = viewDataTmp.validProductCardTypeList[0].id;
    }

    viewDataTmp.projectList = mallListTmp.concat(goodsListTmp, productListTmp, packageListTmp, productCardListTmp);

    viewDataTmp.projectTypeList = viewDataTmp.validGoodsTypeList;
    if (viewDataTmp.validGoodsTypeList.length > 0) {
      let typeId = viewDataTmp.validGoodsTypeList[0].id;
      viewDataTmp.goodsFirstTypeId = typeId;
      let targetList = this.filterByType(viewDataTmp.projectList, typeId, MallItemEnum.Goods);
      viewDataTmp.projectListShow = targetList;
    }
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  private buildGoodsList(openGoodsListTmp: Array<Goods>, goodsTypeMap: ZmMap<GoodsType>, memCard: MembershipCard) {
    let goodsList = new Array<MallItemData>();
    if (openGoodsListTmp.length > 0) {
      for (let goods of openGoodsListTmp) {
        let itemData = MallItemData.fromGoods(goods, memCard);
        let type = goodsTypeMap.get(goods.typeId);
        if (type) {
          itemData.typeName = type.name;
        }
        goodsList.push(itemData);
      }
    }
    goodsList.sort(function (item1, item2) {
      let a = item1.topFlag;
      let b = item2.topFlag;
      return b-a;
    });
    return goodsList;
  }

  private buildProductList(openProductListTmp: Array<ProductInfo>, productTypeMap: ZmMap<ProductType>, memCard: MembershipCard) {
    let productList = new Array<MallItemData>();
    if (openProductListTmp.length > 0){
      for (let product of openProductListTmp) {
        let itemData = MallItemData.fromProduct(product, memCard);
        let type = productTypeMap.get(product.typeId);
        if (type) {
          itemData.typeName = type.name;
        }
        productList.push(itemData);
      }
    }
    //排序 置顶
    productList.sort(function (item1, item2) {
      let a = item1.topFlag;
      let b = item2.topFlag;
      return b-a;
    });
    return productList;
  }

  private buildPackageList(openPackageListTmp: Array<PackageProject>, packageTypeMap: ZmMap<PackageProjectType>, memCard: MembershipCard): Array<MallItemData> {
    let packageList = new Array<MallItemData>();
    if (openPackageListTmp.length > 0) {
      for (let packageItem of openPackageListTmp) {
        let itemData = MallItemData.fromPackage(packageItem, memCard);
        let type = packageTypeMap.get(packageItem.typeId);
        if (type) {
          itemData.typeName = type.name;
        }
        packageList.push(itemData);
      }
    }
    packageList.sort(function (item1, item2) {
      let a = item1.topFlag;
      let b = item2.topFlag;
      return b-a;
    });
    return packageList;
  }

  private buildProductCardList(openProductCardListTmp: Array<ProductCard>, productCardTypeMap: ZmMap<PrdCardType>, memCard: MembershipCard) {
    let productCardList = new Array<MallItemData>();
    if (openProductCardListTmp.length > 0) {
      for (let productCard of openProductCardListTmp) {
        let itemData = MallItemData.fromProductCard(productCard, memCard);
        let type = productCardTypeMap.get(productCard.typeId);
        if (type) {
          itemData.typeName = type.name;
        }
        productCardList.push(itemData);
      }
    }
    productCardList.sort(function (item1, item2) {
      let a = item1.topFlag;
      let b = item2.topFlag;
      return b-a;
    });
    return productCardList;
  }

  public filterByType(projectList: Array<MallItemData>, typeId: string, itemType: number) {
    let projectListTmp: Array<MallItemData> = new Array<MallItemData>();
    projectList.forEach((item) => {
      if ((itemType == item.itemType) && (typeId == item.typeId)) {
        projectListTmp.push(item);
      }
    });
    return projectListTmp;
  }

  public filterByNameOrNumber(projectList: Array<MallItemData>, nameOrNumber: string) {
    if (nameOrNumber == "") {
      return projectList;
    }
    let projectListTmp: Array<MallItemData> = new Array<MallItemData>();
    projectListTmp = projectList.filter((item) => {
      if (item && item.name && (nameOrNumber == item.name || item.name.indexOf(nameOrNumber) > -1)) {
        return item;
      }
    });
    return projectListTmp;
  }

}
