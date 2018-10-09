import {Component, Input, OnInit} from "@angular/core";

import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/apiData/Store";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreFindTypeEnum} from "../../../bsModule/store/apiData/StoreFindTypeEnum";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {GoodsTmp} from "../../../bsModule/storeGoods/data/GoodsTmp";
import {LeaguerLeadModal, LeaguerLeadViewData} from "../modal/LeaguerLeadModal";
import {ProductLeadModal, ProductLeadViewData} from "../modal/ProductLeadModal";
import {GoodsLeadModal, GoodsLeadViewData} from "../modal/GoodsLeadModal";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {ProductInfoTmp} from "../../../bsModule/StoreProductInfo/data/ProductInfoTmp";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ImportTypeEnum} from "../enum/ImportType";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**批量导入数据组件**/

@Component({
  selector: "importData_comp",
  template: `    
     <div class="leadcontent">
       <div class="leadhead pos-r">
         <img src="assets/images/setting/Shopx.png" alt="" class="pos-a" style="top:-45px;left: calc(50% - 45px)">
         <span class="fz-12 font-c6">选择店铺{{section}}导入</span>
       </div>
       <div class="leadfoot">
         <p>选择已有店铺的{{section}}后</p>
         <p> 批量导入</p>
         <button class="c-btn-blue cur-hand" (click)="openModal()">点击导入</button>
       </div>
     </div>
  `,
  styleUrls:['./settingComp.scss']
})
export class ImportDataComp implements OnInit {
  @Input() section: string;
  @Input() type:number;
  private service: ImportDataServcie;
  public viewData: ImportDataViewData;

  constructor(
              private storeMgr: StoreMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storePrdSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ImportDataServcie(
      this.storeMgr,
      this.storeLeaguerInfoSynDataHolder,
      this.storePrdSynDataHolder,
      this.storeGoodsSynDataHolder
    );

  }

  ngOnInit(): void {
    this.viewData = new ImportDataViewData();
    this.service.initViewData((viewDataTmp: ImportDataViewData) => {
      if (viewDataTmp) {
        this.viewData = viewDataTmp;
      } else {
        AppUtils.showError("提示", "加载数据失败");
      }
    });
  }

  public openModal() {
    if (this.viewData.storeList.length == 0) {
      AppUtils.showWarn("提示", "您只有一家店铺，无法进行店铺导入");
    } else {
      if (this.type == ImportTypeEnum.GOODS) {
        this.openGoodsModal();
      } else if (this.type == ImportTypeEnum.PRODUCT) {
        this.openProductModal();
      } else if (this.type == ImportTypeEnum.LEAGUER) {
        this.openLeaguerModal();
      }
    }
  }

  private openGoodsModal() {
    // const activeModal = this.modalService.open(GoodsLeadModal, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newLgModal(GoodsLeadModal, null,null);
    let goodsData: GoodsLeadViewData = GoodsLeadViewData.fromParentComp(this.viewData);
    activeModal.componentInstance.data = goodsData;
  }

  private openProductModal() {
    // const productModal = this.modalService.open(ProductLeadModal, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newLgModal(ProductLeadModal, null,null);
    let data: ProductLeadViewData = ProductLeadViewData.fromParentComp(this.viewData);
    activeModal.componentInstance.data = data;
  }

  private openLeaguerModal() {
    // const leaguerModal = this.modalService.open(LeaguerLeadModal, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newLgModal(LeaguerLeadModal, null,null);
    let data: LeaguerLeadViewData = LeaguerLeadViewData.fromParentComp(this.viewData);
    activeModal.componentInstance.data = data;
  }
}

export class ImportDataViewData {

  defaultStoreId: string;
  storeList: Array<Store>;

  leaguerList: Array<Leaguer>;
  goodsListTmp: Array<GoodsTmp>;
  productListTmp: Array<ProductInfoTmp>;
}


export class ImportDataServcie {

  constructor(private storeMgr: StoreMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storePrdSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder) {

  }

  /**
   * 初始化页面数据
   * @param callback
   */
  public async initViewData(callback: (viewDataP: ImportDataViewData) => void) {
    let viewDataTmp = new ImportDataViewData();

    //storeList
    let storeList: Array<Store> = await this.getStoreList();
    viewDataTmp.storeList = storeList;
    if (storeList.length > 0) {
      viewDataTmp.defaultStoreId = storeList[0].id;

      //leaguerList
      let storeLeaguerInfo: StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(viewDataTmp.defaultStoreId);
      let leaguerMap = storeLeaguerInfo.getValidLeaguerMap();
      viewDataTmp.leaguerList = leaguerMap.values();


      //productListTmp
      let storePrd: StoreProductInfo = await this.storePrdSynDataHolder.getData(viewDataTmp.defaultStoreId);
      let productInfoList = storePrd.getValidProductInfoList();
      let productListTmp: Array<ProductInfoTmp> = this.buildProductTmpList(productInfoList, storePrd);
      viewDataTmp.productListTmp = productListTmp;

      //goodsListTmp
      let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(viewDataTmp.defaultStoreId);
      let goodsList = storeGoods.getValidGoodsList();
      let goodsListTmp: Array<GoodsTmp> = this.buildGoodsTmpList(goodsList, storeGoods);
      viewDataTmp.goodsListTmp = goodsListTmp;
    }

    callback(viewDataTmp);
  }

  //除当前店铺的店铺列表
  private async getStoreList() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let buserId = SessionUtil.getInstance().getUserId();
    let pageItemCount = 1000;
    let pageNo = 1;
    let findType = StoreFindTypeEnum.All;
    let storeList: Array<Store> = await this.storeMgr.getByUser(buserId, pageItemCount, pageNo, findType.toString());
    storeList = storeList.filter((item) => {
      if (item.id != storeId) {
        return true;
      }
    });
    return storeList;
  }

  private buildProductTmpList(productInfoList: Array<ProductInfo>, storePrd: StoreProductInfo) {
    let productListTmp: Array<ProductInfoTmp> = AppUtils.cloneArray(productInfoList);
    let typeMap = storePrd.getTypeMap();
    for (let item of productListTmp) {
      item.typeName = typeMap.get(item.typeId + "");
      item.checked = false;
      // if(item.imgPathList.length>0){
      //   item.defaultImg = item.imgPathList[0];
      // }
    }
    return productListTmp;
  }

  private buildGoodsTmpList(goodsList: Array<Goods>, storeGoods: StoreGoods) {
    let goodsListTmp: Array<GoodsTmp> = AppUtils.cloneArray(goodsList);
    let typeMapTmp = storeGoods.getTypeMap();
    for (let item of goodsListTmp) {
      item.typeName = typeMapTmp.get(item.typeId + "");
      item.checked = false;
      // if(item.imgPaths.length>0){
      //   item.defaultImg = item.imgPaths[0];
      // }
    }
    return goodsListTmp;
  }

}
