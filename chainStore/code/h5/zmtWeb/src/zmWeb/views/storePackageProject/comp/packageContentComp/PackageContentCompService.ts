import {ProductData, PackageContentCompViewData} from "./PackageContentCompViewData";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {PackageContentViewDataMgr} from "./PackageContentCompViewDataMgr";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {UseTypeEnum} from "../../pipe/UseTypeEnum";


export class PackageContentCompService {

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,) {
  }

  public initViewData() {
    PackageContentViewDataMgr.getInstance().setData(new PackageContentCompViewData());

    this.buildViewData((viewDataTmp: PackageContentCompViewData) => {
      this.handleViewData(viewDataTmp);
    });

  }

  public handleViewData(viewDataP: PackageContentCompViewData) {
    PackageContentViewDataMgr.getInstance().setData(viewDataP);
  }

  /**
   * @param leaguerId
   * @param callback
   */
  public async buildViewData(callback: (viewDataP: PackageContentCompViewData) => void) {

    let viewDataTmp = new PackageContentCompViewData();

    //项目相关
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    if (storeProductInfo) {
      let openProductMap = storeProductInfo.getOpenProductInfoMap();//只显示上架项目
      let openProductList = openProductMap.values();//只显示上架项目
      let productTypeMap = storeProductInfo.getProductTypeMap();
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
      viewDataTmp.productTypeList = productTypeMap.values();
      viewDataTmp.productDataList = this.buildProductDataList(openProductList);//显示数据
      viewDataTmp.productDataListTmp = this.buildProductDataList(openProductList);
    }

    //商品相关
    let storeGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    if (storeGoods) {
      let openGoodsMap = storeGoods.getOpenGoodsMap();//只显示上架项目
      let openGoodsList = openGoodsMap.values();//只显示上架项目
      let goodsTypeMap = storeGoods.getValidGoodsTypeMap();

      viewDataTmp.goodsTypeMap = storeGoods.getGoodsTypeMap();
      viewDataTmp.goodsTypeList = goodsTypeMap.values();
      viewDataTmp.goodsDataList = this.buildGoodsDataList(openGoodsList);//显示数据
      viewDataTmp.goodsDataListTmp = this.buildGoodsDataList(openGoodsList);//显示数据
    }

    viewDataTmp.flag = true;
    callback(viewDataTmp);
  }

  private buildProductDataList(openProductList:Array<ProductInfo>):Array<ProductData>{
    let targetList:Array<ProductData> = new Array<ProductData>();
    for(let item of openProductList){
      let productDataTmp:ProductData= new ProductData();
      productDataTmp.id = item.id;
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ItemTypeEnum.PRODUCT;
      productDataTmp.price = item.price;
      productDataTmp.discountPrice = item.price;
      // productDataTmp.withDiscount = true;
      targetList.push(productDataTmp);
    }
    return targetList;
  }

  private buildGoodsDataList(openGoodsList:Array<Goods>):Array<ProductData>{
    let targetList:Array<ProductData> = new Array<ProductData>();
    for(let item of openGoodsList){
      let productDataTmp:ProductData= new ProductData();
      productDataTmp.id = item.id;
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ItemTypeEnum.GOODS;
      productDataTmp.price = item.price;
      productDataTmp.discountPrice = item.price;
      // productDataTmp.withDiscount = true;
      targetList.push(productDataTmp);
    }
    return targetList;
  }

}
