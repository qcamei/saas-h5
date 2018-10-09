import {ProductData, PackageContentCompViewData} from "./PackageContentCompViewData";
import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainGoodsSynDataHolder} from "../../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {PackageContentViewDataMgr} from "./PackageContentCompViewDataMgr";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {UseTypeEnum} from "../../pipe/UseTypeEnum";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {Product} from "../../../../bsModule/chainProduct/data/Product";


export class PackageContentCompService {

  constructor(private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,) {
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
    let chainGoods = await this.chainGoodsSynDataHolder.getData(chainId);
    if (chainGoods) {
      let openGoodsMap = chainGoods.getOpenGoodsMap();//只显示上架项目
      let openGoodsList = openGoodsMap.values();//只显示上架项目
      let goodsTypeMap = chainGoods.getAllGoodsTypeMap();

      viewDataTmp.goodsTypeMap = chainGoods.getAllGoodsTypeMap();
      viewDataTmp.goodsTypeList = goodsTypeMap.values();
      viewDataTmp.goodsDataList = this.buildGoodsDataList(openGoodsList);//显示数据
      viewDataTmp.goodsDataListTmp = this.buildGoodsDataList(openGoodsList);//显示数据
    }

    viewDataTmp.flag = true;
    callback(viewDataTmp);
  }

  private buildProductDataList(openProductList:Array<Product>):Array<ProductData>{
    let targetList:Array<ProductData> = new Array<ProductData>();
    for(let item of openProductList){
      let productDataTmp:ProductData= new ProductData();
      productDataTmp.id = item.id;
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ItemTypeEnum.PRODUCT;
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
      productDataTmp.id = item.id;
      productDataTmp.name = item.name;
      productDataTmp.typeId  = item.typeId;
      productDataTmp.userType = UseTypeEnum.lIMIT_NUMBER;
      productDataTmp.count = 1;
      productDataTmp.type = ItemTypeEnum.GOODS;
      productDataTmp.price = item.sellPrice;
      productDataTmp.discountPrice = item.sellPrice;
      // productDataTmp.withDiscount = true;
      targetList.push(productDataTmp);
    }
    return targetList;
  }

}
