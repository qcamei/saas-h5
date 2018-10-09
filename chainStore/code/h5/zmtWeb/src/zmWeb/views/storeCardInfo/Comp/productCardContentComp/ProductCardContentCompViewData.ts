import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {GoodsType} from "../../../../bsModule/storeGoods/data/GoodsType";
import {PackageProjectType} from "../../../../bsModule/storePackageProject/data/PackageProjectType";
import {ZmMap} from "../../../../comModule/AppUtils";


export class ProductCardContentCompViewData {
  /********项目数据*************/
  public productTypeMap: ZmMap<ProductType>;
  public productTypeList: Array<ProductType>;
  public productDataList: Array<ProductData> = new Array<ProductData>();
  public productDataListTmp: Array<ProductData> = new Array<ProductData>();

  //选中的项目列表
  public choosedProductList: Array<ProductData> = new Array();
  public choosedProductListTmp: Array<ProductData> = new Array();

  /********商品数据*************/
  public goodsTypeMap: ZmMap<GoodsType>;
  public goodsTypeList: Array<GoodsType>;
  public goodsDataList: Array<ProductData> = new Array();
  public goodsDataListTmp: Array<ProductData> = new Array();

  //选中的商品列表
  public choosedGoodsList: Array<ProductData> = new Array();
  public choosedGoodsListTmp: Array<ProductData> = new Array();

  /********套餐数据*************/
  public packageProjectTypeMap:ZmMap<PackageProjectType>;
  public packageTypeList: Array<PackageProjectType>;
  public packageDataList: Array<ProductData> = new Array();
  public packageDataListTmp: Array<ProductData> = new Array();

  //选中的套餐列表
  public choosedPackageList: Array<ProductData> = new Array();
  public choosedPackageListTmp: Array<ProductData> = new Array();

  /*********页面展示数据********/
  public flag: boolean = false;//是否已初始化数据
  public hasUnLimit:boolean = false;//包含无限次

}


//产品数据
export class ProductData {
  public id: string;
  public name: string;
  public typeId:string;//产品分类
  public userType: number;//使用类型 UseTypeEnum
  public count: number;
  public unlimit_count:string = "无限";

  public type:number;//产品类型  ItemTypeEnum
  public price: number = 0;
  public discountPrice:number = 0;
  // public withDiscount:boolean = true;//默认参与计算
  // public locked:boolean = true;//默认锁定
}
