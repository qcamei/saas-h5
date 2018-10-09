import {ProductData, ProductCardContentCompViewData} from "./ProductCardContentCompViewData";
import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {ProductCardContentViewDataMgr} from "./ProductCardContentViewDataMgr";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainGoodsSynDataHolder} from "../../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {PackageProject} from "../../../../bsModule/chainPackageProject/data/PackageProject";
import {UseTypeEnum} from "../../../chainPackageProject/pipe/UseTypeEnum";
import {ProductCardItemEnum} from "../../../../bsModule/chainCard/data/ProductCardItemEnum";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {Product} from "../../../../bsModule/chainProduct/data/Product";


export class ProductCardContentCompService {

  constructor(private chainProductSynDataHolder: ChainProductSynDataHolder,
              private ChainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainPackageProjectSynDataHolder:ChainPackageProjectSynDataHolder) {
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
    let chainId = SessionUtil.getInstance().getChainId();
    let chainProduct = await this.chainProductSynDataHolder.getData(chainId);
    if (chainProduct) {
      let openProductMap = chainProduct.getOpenProductInfoMap();//只显示上架项目
      let openProductList = openProductMap.values();//只显示上架项目
      let productTypeMap = chainProduct.getAllProductTypeMap();
      viewDataTmp.productTypeMap = chainProduct.getAllProductTypeMap();
      viewDataTmp.productTypeList = productTypeMap.values();
      viewDataTmp.productDataList = this.buildProductDataList(openProductList);//显示数据
      viewDataTmp.productDataListTmp = this.buildProductDataList(openProductList);
    }

    //商品相关
    let chainGoods:ChainGoods = await this.ChainGoodsSynDataHolder.getData(chainId);
    if (chainGoods) {
      let openGoodsMap = chainGoods.getOpenGoodsMap();//只显示上架项目
      let openGoodsList = openGoodsMap.values();//只显示上架项目
      let goodsTypeMap = chainGoods.getAllGoodsTypeMap();
      viewDataTmp.goodsTypeMap = chainGoods.getAllGoodsTypeMap();
      viewDataTmp.goodsTypeList = goodsTypeMap.values();
      viewDataTmp.goodsDataList = this.buildGoodsDataList(openGoodsList);//显示数据
      viewDataTmp.goodsDataListTmp = this.buildGoodsDataList(openGoodsList);//显示数据
    }

    //套餐相关
    let chainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    if (chainPackageProject) {
      let openPackageProjectMap = chainPackageProject.getOpenPackageProjectMap();//只显示上架项目
      let openPackageProjectList = openPackageProjectMap.values();//只显示上架项目
      let packageTypeMap = chainPackageProject.getValidPackageTypeMap();

      viewDataTmp.packageProjectTypeMap = chainPackageProject.getAllPackageTypeMap();
      viewDataTmp.packageTypeList = packageTypeMap.values();
      viewDataTmp.packageDataList = this.buildPackageProjectDataList(openPackageProjectList);//显示数据
      viewDataTmp.packageDataListTmp = this.buildPackageProjectDataList(openPackageProjectList);//显示数据
    }


    viewDataTmp.flag = true;
    callback(viewDataTmp);
  }

  private buildProductDataList(openProductList:Array<Product>):Array<ProductData>{
    let targetList:Array<ProductData> = new Array<ProductData>();
    for(let item of openProductList){
      let productDataTmp:ProductData= new ProductData();
      productDataTmp.id = item.id.toString();
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ProductCardItemEnum.PRODUCT;
      productDataTmp.price = item.sellPrice;
      productDataTmp.discountPrice = item.sellPrice;
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
      productDataTmp.price = item.sellPrice;
      productDataTmp.discountPrice = item.sellPrice;
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
