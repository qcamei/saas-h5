import {MgrPool} from "../../comModule/MgrPool";
import {WorkFlowDataQueryForm} from "../../bsModule/workFlow/apiData/WorkFlowDataQueryForm";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {WorkFlowDataMgr} from "../../bsModule/workFlow/WorkFlowDataMgr";
import {WFListVD} from "./list/WFListVD";
import {WFWrap} from "../../bsModule/workFlow/data/WFWrap";
import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {PreStoreCardRecord} from "../../bsModule/workFlow/data/PreStoreCardRecord";
import {OpenWFItem} from "../zmBSComp/zmb/workFlow/openWFItem/OpenWFItem";
import {App} from "ionic-angular";
import {OpenWFItemEnum} from "../zmBSComp/zmb/workFlow/openWFItem/OpenWFItemEnum";
import {DelimitCardRecord} from "../../bsModule/workFlow/data/DelimitCardRecord";
import {ProdRecord} from "../../bsModule/workFlow/data/ProdRecord";
import {RecordTypeEnum} from "../../bsModule/workFlow/data/RecordTypeEnum";
import {PrdCardRecord} from "../../bsModule/workFlow/data/PrdCardRecord";
import {GoodsRecord} from "../../bsModule/workFlow/data/GoodsRecord";
import {PackagePrjRecord} from "../../bsModule/workFlow/data/PackagePrjRecord";
import {StoreLeaguerInfoSynDataHolder} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {WFDataTypeEnum} from "../zmBSComp/zmb/workFlow/openWFItem/WFDataTypeEnum";
import {StoreCardInfo} from "../../bsModule/storeCardInfo/data/StoreCardInfo";
import {StoreProductInfo} from "../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreGoods} from "../../bsModule/storeGoods/data/StoreGoods";
import {StorePackageProject} from "../../bsModule/storePackageProject/data/StorePackageProject";
import {StoreProductInfoSynDataHolder} from "../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoHelper} from "../../bsModule/StoreProductInfo/StoreProductInfoHelper";
import {StoreGoodsHelper} from "../../bsModule/storeGoods/StoreGoodsHelper";
import {StorePackageProjectHelper} from "../../bsModule/storePackageProject/StorePackageProjectHelper";
import {StoreCardInfoHelper} from "../../bsModule/storeCardInfo/StoreCardInfoHelper";
import {StoreCardInfoSynDataHolder} from "../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {BUserSynDataHolder} from "../../bsModule/buser/BUserSynDataHolder";

export class WFService {

  public static getInstance(): WFService {
    return MgrPool.getInstance().get("WFService", WFService);
  }

  /**
   * 获取开单列表
   * @param {WFListVD} viewData
   * @returns {Promise<PageResp>}
   */
  public async getWFList(viewData: WFListVD): Promise<boolean> {
    let queryForm: WorkFlowDataQueryForm = new WorkFlowDataQueryForm();
    queryForm.maxTime = viewData.timeSlot.getMaxTime();
    queryForm.minTime = viewData.timeSlot.getMinTime();
    queryForm.storeId = SessionUtil.getInstance().getStoreId();
    queryForm.pageItemCount = viewData.pageItemCount;
    queryForm.status = viewData.status;
    queryForm.pageNo = viewData.curPage;
    let pageResp: PageResp = await  WorkFlowDataMgr.getInstance().getWFList(queryForm);
    viewData.wfList = pageResp.list;
    viewData.curPage = pageResp.pageNo;
    viewData.totalCount = pageResp.totalCount;
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  }

  /**
   * 根据工作流id 获取工作流封装信息
   * @param {number} wfId
   * @returns {Promise<WFWrap>}
   */
  public async getWfById(wfId: number): Promise<WFWrap> {
    let wf = await WorkFlowDataMgr.getInstance().getWfById(wfId);
    let wfWrap: WFWrap = WFWrap.newInstance();
    wfWrap.wf = wf;
    //build 划卡、预存卡、项目、商品、套餐、次卡 记录
    this.buildPreStoreCardRecords(wfWrap)
      .buildDelimitCardRecords(wfWrap)
      .buildProdRecords(wfWrap)
      .buildGoodsRecords(wfWrap)
      .buildPackagePrjRecords(wfWrap)
      .buildPrdCardRecords(wfWrap);
    await this.buildAllItemBaseInfo(wfWrap);//build 所有列表项的基本信息 名称，图片，分类等
    let leaguerInfo = wf.leaguerInfo;
    if (AppUtils.isNullObj(leaguerInfo)) {
      return AppUtils.getPromise(wfWrap);
    }
    await this.buildLeaguerInfo(leaguerInfo, wfWrap);
    return AppUtils.getPromise(wfWrap);
  }

  /**
   * 构建 客户 和 跟进人员相关信息
   * @param leaguerInfo
   * @param {WFWrap} wfWrap
   * @returns {Promise<void>}
   */
  private async buildLeaguerInfo(leaguerInfo, wfWrap: WFWrap) {
    let curStoreId = SessionUtil.getInstance().getCurStoreId();
    let storeLeaguerInfo = await StoreLeaguerInfoSynDataHolder.getInstance().getData(curStoreId);
    let leaguer = storeLeaguerInfo.getLeaguerMap().get(leaguerInfo.leaguerId);
    wfWrap.leaguer = leaguer;
    if (!AppUtils.isNullObj(leaguerInfo.followUserId)) {
      let buser = await BUserSynDataHolder.getInstance().getData(leaguerInfo.followUserId.toString());
      wfWrap.buser = buser;
    }
  }

  /**
   * build 所有列表项的基础信息 名称，图片，分类等
   * @param {WFWrap} wfWrap
   * @returns {Promise<string>}
   */
  private async buildAllItemBaseInfo(wfWrap: WFWrap) {
    let allItems: Array<OpenWFItem> = new Array<OpenWFItem>();//所有的列表项
    allItems = allItems.concat(wfWrap.preStoreCardRecordSaveForms);
    allItems = allItems.concat(wfWrap.delimitCardRecordSaveForms);
    allItems = allItems.concat(wfWrap.buyItemSaveForms);
    allItems = allItems.concat(wfWrap.donateItemSaveForms);
    let storeProductInfo: StoreProductInfo;
    let storeGoods: StoreGoods;
    let storePackageProject: StorePackageProject;
    let storeCardInfo: StoreCardInfo;
    let curStoreId = SessionUtil.getInstance().getCurStoreId();
    //build 所有列表项的信息 名称，图片，分类等
    for (let item of allItems) {
      switch (AppUtils.toNum(item.wfDataTypeEnum)) {
        case WFDataTypeEnum.PRODUCT:
          if (AppUtils.isNullObj(storeProductInfo)) {
            storeProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(curStoreId);
          }
          this.buildProductInfo(storeProductInfo, item);
          break;
        case WFDataTypeEnum.GOODS:
          if (AppUtils.isNullObj(storeGoods)) {
            storeGoods = await StoreGoodsSynDataHolder.getInstance().getData(curStoreId);
          }
          this.buildGoods(storeGoods, item);
          break;
        case WFDataTypeEnum.PACKAGE:
          if (AppUtils.isNullObj(storePackageProject)) {
            storePackageProject = await StorePackageProjectSynDataHolder.getInstance().getData(curStoreId);
          }
          this.buildPackageProject(storePackageProject, item);
          break;
        case WFDataTypeEnum.PRDCARD:
          if (AppUtils.isNullObj(storeCardInfo)) {
            storeCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(curStoreId);
          }
          this.buildProductCard(storeCardInfo, item);
          break;
      }
    }
  }

  /**
   * build 预存卡 记录
   * @param {WFWrap} wfWrap
   * @returns {WFService}
   */
  public buildPreStoreCardRecords(wfWrap: WFWrap): WFService {
    let preStoreCardRecordSaveForms = wfWrap.preStoreCardRecordSaveForms;
    let preStoreCardRecordMap: ZmMap<PreStoreCardRecord> = <ZmMap<PreStoreCardRecord>>wfWrap.wf.preStoreCardRecordMap;
    if (AppUtils.isNullObj(preStoreCardRecordMap)) return this;
    let array: Array<PreStoreCardRecord> = preStoreCardRecordMap.values();
    for (let value of array) {
      if (AppUtils.isNullObj(value)) continue;
      let openWFItem = OpenWFItem.newInstance();
      AppUtils.copyJson(openWFItem, AppUtils.toJson(value));
      openWFItem.openWFItemEnum = OpenWFItemEnum.PreStoreCard;
      openWFItem.wfDataTypeEnum = value.itemType;
      preStoreCardRecordSaveForms.push(openWFItem);
    }
    return this;
  }

  /**
   * build 划卡 记录
   * @param {WFWrap} wfWrap
   * @returns {WFService}
   */
  public buildDelimitCardRecords(wfWrap: WFWrap): WFService {
    let delimitCardRecordSaveForms = wfWrap.delimitCardRecordSaveForms;
    let delimitCardRecordMap: ZmMap<DelimitCardRecord> = wfWrap.wf.delimitCardRecordMap;
    if (AppUtils.isNullObj(delimitCardRecordMap)) return this;
    for (let value of delimitCardRecordMap.values()) {
      if (AppUtils.isNullObj(value)) continue;
      let openWFItem = OpenWFItem.newInstance();
      AppUtils.copyJson(openWFItem, AppUtils.toJson(value));
      openWFItem.openWFItemEnum = OpenWFItemEnum.DelimitCard;
      openWFItem.wfDataTypeEnum = value.itemType;
      delimitCardRecordSaveForms.push(openWFItem);
    }
    return this;
  }

  /**
   * build 项目 记录
   * @param {WFWrap} wfWrap
   * @returns {WFService}
   */
  public buildProdRecords(wfWrap: WFWrap): WFService {
    let prodRecordMap: ZmMap<ProdRecord> = wfWrap.wf.prodRecordMap;
    if (AppUtils.isNullObj(prodRecordMap)) return this;
    for (let value of prodRecordMap.values()) {
      if (AppUtils.isNullObj(value)) continue;
      let openWFItem = OpenWFItem.newInstance();
      AppUtils.copyJson(openWFItem, AppUtils.toJson(value));
      openWFItem.pgId = value.prodId;
      openWFItem.oldPrice = value.price;
      openWFItem.wfDataTypeEnum = WFDataTypeEnum.PRODUCT;
      switch (AppUtils.toNum(value.recordType)) {
        case RecordTypeEnum.Buy:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Buy;
          wfWrap.buyItemSaveForms.push(openWFItem);
          break;
        case RecordTypeEnum.Donation:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Donation;
          wfWrap.donateItemSaveForms.push(openWFItem);
          break;
      }
    }
    return this;
  }

  /**
   * build 商品 记录
   * @param {WFWrap} wfWrap
   * @returns {WFService}
   */
  public buildGoodsRecords(wfWrap: WFWrap): WFService {
    let goodsRecordMap: ZmMap<GoodsRecord> = wfWrap.wf.goodsRecordMap;
    if (AppUtils.isNullObj(goodsRecordMap)) return this;
    for (let value of goodsRecordMap.values()) {
      if (AppUtils.isNullObj(value)) continue;
      let openWFItem = OpenWFItem.newInstance();
      AppUtils.copyJson(openWFItem, AppUtils.toJson(value));
      openWFItem.pgId = value.goodsId;
      openWFItem.oldPrice = value.price;
      openWFItem.wfDataTypeEnum = WFDataTypeEnum.GOODS;
      switch (AppUtils.toNum(AppUtils.toNum(value.recordType))) {
        case RecordTypeEnum.Buy:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Buy;
          wfWrap.buyItemSaveForms.push(openWFItem);
          break;
        case RecordTypeEnum.Donation:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Donation;
          wfWrap.donateItemSaveForms.push(openWFItem);
          break;
      }
    }
    return this;
  }

  /**
   * build 套餐 记录
   * @param {WFWrap} wfWrap
   * @returns {WFService}
   */
  public buildPackagePrjRecords(wfWrap: WFWrap): WFService {
    let packagePrjRecordMap: ZmMap<PackagePrjRecord> = wfWrap.wf.packagePrjRecordMap;
    if (AppUtils.isNullObj(packagePrjRecordMap)) return this;
    for (let value of packagePrjRecordMap.values()) {
      if (AppUtils.isNullObj(value)) continue;
      let openWFItem = OpenWFItem.newInstance();
      AppUtils.copyJson(openWFItem, AppUtils.toJson(value));
      openWFItem.pgId = value.packagePrjId;
      openWFItem.oldPrice = value.price;
      openWFItem.wfDataTypeEnum = WFDataTypeEnum.PACKAGE;
      switch (AppUtils.toNum(value.recordType)) {
        case RecordTypeEnum.Buy:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Buy;
          wfWrap.buyItemSaveForms.push(openWFItem);
          break;
        case RecordTypeEnum.Donation:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Donation;
          wfWrap.donateItemSaveForms.push(openWFItem);
          break;
      }
    }
    return this;
  }

  /**
   * build 次卡 记录
   * @param {WFWrap} wfWrap
   * @returns {WFService}
   */
  public buildPrdCardRecords(wfWrap: WFWrap): WFService {
    let prdCardRecordMap: ZmMap<PrdCardRecord> = wfWrap.wf.prdCardRecordMap;
    if (AppUtils.isNullObj(prdCardRecordMap)) return this;
    for (let value of prdCardRecordMap.values()) {
      if (AppUtils.isNullObj(value)) continue;
      let openWFItem = OpenWFItem.newInstance();
      AppUtils.copyJson(openWFItem, AppUtils.toJson(value));
      openWFItem.pgId = value.prdCardTypeId;
      openWFItem.oldPrice = value.price;
      openWFItem.wfDataTypeEnum = WFDataTypeEnum.PRDCARD;
      switch (AppUtils.toNum(value.recordType)) {
        case RecordTypeEnum.Buy:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Buy;
          wfWrap.buyItemSaveForms.push(openWFItem);
          break;
        case RecordTypeEnum.Donation:
          openWFItem.openWFItemEnum = OpenWFItemEnum.Donation;
          wfWrap.donateItemSaveForms.push(openWFItem);
          break;
      }
    }
    return this;
  }

  /**
   * build OpenWFItem 项目信息
   * @param {StoreProductInfo} storeProductInfo
   * @param {OpenWFItem} item
   */
  private buildProductInfo(storeProductInfo: StoreProductInfo, item: OpenWFItem) {
    let productInfo = StoreProductInfoHelper.getInstance().getProductInfoById(storeProductInfo, item.pgId);
    if (AppUtils.isNullObj(productInfo)) return;
    let productType = StoreProductInfoHelper.getInstance().getProductTypeById(storeProductInfo, productInfo.typeId);
    item.img = productInfo.defaultImg;
    item.name = productInfo.name;
    item.type = productType.name;
  }

  /**
   * build OpenWFItem 商品信息
   * @param {StoreGoods} storeGoods
   * @param {OpenWFItem} item
   */
  private buildGoods(storeGoods: StoreGoods, item: OpenWFItem) {
    let goods = StoreGoodsHelper.getInstance().getGoodsById(storeGoods, item.pgId);
    if (AppUtils.isNullObj(goods)) return;
    let goodsType = StoreGoodsHelper.getInstance().getGoodsTypeById(storeGoods, goods.typeId);
    item.img = goods.defaultImg;
    item.name = goods.name;
    item.type = goodsType.name;
  }

  /**
   * build OpenWFItem 套餐信息
   * @param {StorePackageProject} storePackageProject
   * @param {OpenWFItem} item
   */
  private buildPackageProject(storePackageProject: StorePackageProject, item: OpenWFItem) {
    let packageProject = StorePackageProjectHelper.getInstance().getPackageProjectById(storePackageProject, item.pgId);
    if (AppUtils.isNullObj(packageProject)) return;
    let packageProjectType = StorePackageProjectHelper.getInstance().getPackageProjectTypeById(storePackageProject, packageProject.typeId);
    item.img = packageProject.defaultImg;
    item.name = packageProject.name;
    item.type = packageProjectType.name;
  }

  /**
   * build OpenWFItem 次卡信息
   * @param {StoreProductInfo} storeCardInfo
   * @param {OpenWFItem} item
   */
  private buildProductCard(storeCardInfo: StoreCardInfo, item: OpenWFItem) {
    let productCard = StoreCardInfoHelper.getInstance().getProductCardById(storeCardInfo, item.pgId);
    if (AppUtils.isNullObj(productCard)) return;
    let prdCardType = StoreCardInfoHelper.getInstance().getPrdCardTypeById(storeCardInfo, productCard.typeId);
    item.img = productCard.imgPath;
    item.name = productCard.name;
    item.type = prdCardType.name;
  }

}
