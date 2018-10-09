import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {ZmMap} from "../../../comModule/AppUtils";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {Constants} from "../../zmComUtils/Constants";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {MallItemEnum} from "../../../comModule/enum/MallItemEnum";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";

export class MallListViewData {
  //准备数据
  validGoodsTypeList: Array<GoodsType> = new Array<GoodsType>();
  allGoodsTypeMap: ZmMap<GoodsType>;
  openGoodsMap: ZmMap<Goods>;

  validProductTypeList: Array<ProductType> = new Array<ProductType>();
  allProductTypeMap: ZmMap<ProductType>;
  openProductMap: ZmMap<ProductInfo>;

  validPackageTypeList: Array<PackageProjectType> = new Array<PackageProjectType>();
  allPackageTypeMap: ZmMap<PackageProjectType>;
  openPackageMap: ZmMap<PackageProject>;

  validProductCardTypeList: Array<PrdCardType> = new Array<PrdCardType>();
  allProductCardTypeMap: ZmMap<PrdCardType>;
  openProductCardMap: ZmMap<ProductCard>;

  goodsFirstTypeId: string;
  productFirstTypeId: string;
  packageFirstTypeId: string;
  productCardFirstTypeId: string;

  memCard: MembershipCard = new MembershipCard();

  tabList = [{name: '商品', value: 0}, {name: '项目', value: 1}, {name: '套餐', value: 2}, {name: '次卡', value: 3}];
  selectedTab: any = this.tabList[0];

  //查询参数
  itemType: number = 0;//MallItemEnum
  isSearch: boolean = false;
  nameOrNumber: string;
  isActive: number = 0;//分类高亮

  //显示数据
  projectTypeList: Array<any> = new Array<any>();
  projectList: Array<MallItemData> = new Array<MallItemData>();
  projectListShow: Array<MallItemData> = new Array<MallItemData>();

  buyProjectList: Array<MallItemData> = new Array<MallItemData>();
  loadingFinish: boolean = false;
}

export class PreOrderData {
  totalDisCountPrice: number = 0;//总的折后价
  totalPrice: number = 0;//总价
  buyProjectList: Array<MallItemData> = new Array<MallItemData>();

  constructor() {
  }
}

export class MallItemData {
  id: string;
  name: string;
  number: string;
  itemType: number;//MallItemEnum
  typeId: string;
  typeName: string;
  price: number;
  discount: number = 10;
  defaultImg: string;
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  count: number = 0;

  constructor() {
  }

  public static fromGoods(goods: Goods, memCard: MembershipCard) {
    let target = new MallItemData();
    target.id = goods.id;
    target.price = goods.price;
    target.name = goods.name;
    target.number = goods.number;
    target.topFlag = goods.topFlag;
    target.promotionFlag = goods.promotionFlag;
    target.promotionPrice = goods.promotionPrice;
    target.itemType = MallItemEnum.Goods;
    memCard ? target.discount = memCard.goodsDiscount : target.discount = 10;
    if (goods.defaultImg) {
      target.defaultImg = goods.defaultImg;
    } else {
      target.defaultImg = Constants.GOODS_DEFAULT_IMG;
    }
    target.typeId = goods.typeId;
    return target;
  }

  public static fromProduct(productInfo: ProductInfo, memCard: MembershipCard) {
    let target = new MallItemData();
    target.id = productInfo.id;
    target.price = productInfo.price;
    target.name = productInfo.name;
    target.number = productInfo.number;
    target.topFlag = productInfo.topFlag;
    target.promotionFlag = productInfo.promotionFlag;
    target.promotionPrice = productInfo.promotionPrice;
    target.itemType = MallItemEnum.Product;
    memCard ? target.discount = memCard.prodDiscount : target.discount = 10;
    if (productInfo.defaultImg) {
      target.defaultImg = productInfo.defaultImg;
    } else {
      target.defaultImg = Constants.PRODUCT_DEFAULT_IMG;
    }
    target.typeId = productInfo.typeId;
    return target;
  }

  public static fromPackage(packageProject: PackageProject, memCard: MembershipCard) {
    let target = new MallItemData();
    target.id = packageProject.id;
    target.price = packageProject.sellPrice;
    target.name = packageProject.name;
    target.number = packageProject.number;
    target.topFlag = packageProject.topFlag;
    target.promotionFlag = packageProject.promotionFlag;
    target.promotionPrice = packageProject.promotionPrice;
    target.itemType = MallItemEnum.Package;
    memCard ? target.discount = memCard.packagePrjDiscount : target.discount = 10;
    if (packageProject.defaultImg) {
      target.defaultImg = packageProject.defaultImg;
    } else {
      target.defaultImg = Constants.PACKAGE_DEFAULT_IMG;
    }
    target.typeId = packageProject.typeId;
    return target;
  }

  public static fromProductCard(productCard: ProductCard, memCard: MembershipCard) {
    let target = new MallItemData();
    target.id = productCard.id;
    target.price = productCard.sellPrice;
    target.name = productCard.name;
    target.number = productCard.number;
    target.topFlag = productCard.topFlag;
    target.promotionFlag = productCard.promotionFlag;
    target.promotionPrice = productCard.promotionPrice;
    target.itemType = MallItemEnum.ProductCard;
    memCard ? target.discount = memCard.prdCardDiscount : target.discount = 10;
    if (productCard.imgPath) {
      target.defaultImg = productCard.imgPath;
    } else {
      target.defaultImg = Constants.PRDCARD_DEFAULT_IMG;
    }
    target.typeId = productCard.typeId;
    return target;
  }
}
