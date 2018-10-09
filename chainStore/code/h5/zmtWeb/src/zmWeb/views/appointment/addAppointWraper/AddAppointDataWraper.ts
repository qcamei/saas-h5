import {BuyTypeEnum} from "../../../bsModule/workFlow/data/BuyTypeEnum";
import {ProductWithCardData} from "../Comp/ProductComp/productComp";
import {LeaguerMemberCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerMemberCard";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";

export class AppointDataWraper {

  //会员组件数据
  private _leaguerCompData: LeaguerCompData = new LeaguerCompData();
  //项目组件数据
  private _productCompData: ProductCompData = new ProductCompData();

  private _servicePersonCompData: ServicePersonCompData = new ServicePersonCompData();


  public getLeaguerCompData() {
    return this._leaguerCompData;
  }

  public setLeaguerCompData(leaguerCompData:LeaguerCompData) {
    this._leaguerCompData = leaguerCompData;
  }

  public getProductCompData() {
    return this._productCompData;
  }

  public getServicePersonCompData() {
    return this._servicePersonCompData;
  }

}

export class LeaguerCompData {
  //选中的会员
  public selectLeaguer: LeaguerDetail = new LeaguerDetail();
  public leaguerMemberCard:LeaguerMemberCard = new LeaguerMemberCard();
  public memberCard:MembershipCard = new MembershipCard();
}

export class ProductCompData {
  public leaguerId: string;
  public productList: Array<ProductData> = new Array<ProductData>();//项目
}

export class ServicePersonCompData {
  public productList: Array<ProductData> = new Array<ProductData>();//项目
}


//页面显示的所选项目列表项实体bean
export class ProductData {
  public type: number;//类型  项目1/商品2/次卡3
  public id: string;//对应项目/商品/次卡id
  public name: string;//名称
  public count: number;//数量
  public userType:number;//次卡使用类型  永久 限次数
  public payType: number;//结算方式 现结0/划卡1
  public buserId: Array<string>;
  public buserName: string;

  public productCardId: string = "";//所属次卡id
  public productCardName: string = "";//所属次卡名称

  public static fromProduct(product: ProductInfo): ProductData {
    let productData = new ProductData();
    productData.type = BuyTypeEnum.PRODUCT;
    productData.id = product.id;
    productData.name = product.name;
    productData.count = 1;
    productData.payType = 0;//现结
    return productData;
  }

  public static fromCardProduct(productWithCardData: ProductWithCardData): ProductData {
    let productData = new ProductData();
    productData.type = BuyTypeEnum.PRODUCT;
    productData.id = productWithCardData.productId;
    productData.name = productWithCardData.productName;
    productData.count = 1;
    productData.payType = 1;//划卡
    productData.userType = productWithCardData.userType;
    productData.productCardId = productWithCardData.productCardId;//次卡id
    productData.productCardName = productWithCardData.productCardName;//次卡id
    return productData;
  }
}



