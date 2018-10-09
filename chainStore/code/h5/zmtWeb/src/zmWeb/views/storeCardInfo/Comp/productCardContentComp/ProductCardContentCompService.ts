import {ProductData, ProductCardContentCompViewData} from "./ProductCardContentCompViewData";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductCardContentViewDataMgr} from "./ProductCardContentViewDataMgr";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {PackageProject} from "../../../../bsModule/storePackageProject/data/PackageProject";
import {UseTypeEnum} from "../../../storePackageProject/pipe/UseTypeEnum";
import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";


export class ProductCardContentCompService {

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder) {
  }

  public initViewData() {
    ProductCardContentViewDataMgr.getInstance().setData(new ProductCardContentCompViewData());

    this.buildViewData((viewDataTmp: ProductCardContentCompViewData) => {
      this.handleViewData(viewDataTmp);
    });

  }

  public handleViewData(viewDataP: ProductCardContentCompViewData) {
    ProductCardContentViewDataMgr.getInstance().setData(viewDataP);
  }

  /**
   * @param leaguerId
   * @param callback
   */
  public async buildViewData(callback: (viewDataP: ProductCardContentCompViewData) => void) {

    let viewDataTmp = new ProductCardContentCompViewData();

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

    //套餐相关
    let storePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    if (storePackageProject) {
      let openPackageProjectMap = storePackageProject.getOpenPackageProjectMap();//只显示上架项目
      let openPackageProjectList = openPackageProjectMap.values();//只显示上架项目
      let packageTypeMap = storePackageProject.getValidPackageTypeMap();

      viewDataTmp.packageProjectTypeMap = storePackageProject.getAllPackageTypeMap();
      viewDataTmp.packageTypeList = packageTypeMap.values();
      viewDataTmp.packageDataList = this.buildPackageProjectDataList(openPackageProjectList);//显示数据
      viewDataTmp.packageDataListTmp = this.buildPackageProjectDataList(openPackageProjectList);//显示数据
    }


    viewDataTmp.flag = true;
    callback(viewDataTmp);
  }

  private buildProductDataList(openProductList:Array<ProductInfo>):Array<ProductData>{
    let targetList:Array<ProductData> = new Array<ProductData>();
    for(let item of openProductList){
      let productDataTmp:ProductData= new ProductData();
      productDataTmp.id = item.id.toString();
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ProductCardItemEnum.PRODUCT;
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
      productDataTmp.id = item.id.toString();
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ProductCardItemEnum.GOODS;
      productDataTmp.price = item.price;
      productDataTmp.discountPrice = item.price;
      // productDataTmp.withDiscount = true;
      targetList.push(productDataTmp);
    }
    return targetList;
  }

  private buildPackageProjectDataList(openPackageProjectList:Array<PackageProject>){
    let targetList:Array<ProductData> = new Array<ProductData>();
    for(let item of openPackageProjectList){
      let productDataTmp:ProductData= new ProductData();
      productDataTmp.id = item.id;
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ProductCardItemEnum.PACKAGE;
      productDataTmp.price = item.sellPrice;
      productDataTmp.discountPrice = item.sellPrice;
      // productDataTmp.withDiscount = true;
      targetList.push(productDataTmp);
    }
    return targetList;
  }
}
