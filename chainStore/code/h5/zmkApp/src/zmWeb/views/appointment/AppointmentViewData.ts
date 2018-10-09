import {ProductInfo} from "../../bsModule/StoreProductInfo/data/ProductInfo";
import {ZmMap} from "../../comModule/AppUtils";
import {ProductType} from "../../bsModule/StoreProductInfo/data/ProductType";
import {BUser} from "../../bsModule/buser/data/BUser";

export class AppointmentViewData {

  /*****************************预约数据***************************************/
  appointDateMin:string; //最小预约日期

  appointTimeMin:string; //最小预约时间
  appointTimeMax:string; //最大预约时间

  curAppointDate:string; //当前选择的预约日期
  curAppointTime:string; //当前选择的预约时间

  /*****************************项目列表数据***************************************/
  selectedProductList: Array<ProductItemData> = new Array<ProductItemData>();
  productList: Array<ProductItemData> = new Array<ProductItemData>();
  productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  /*****************************服务人员数据***************************************/
  buserList: Array<BUser> = new Array<BUser>();
  selectedProductItem:ProductItemData;

}

export class ProductItemData{
  id: string;
  name: string;
  typeId: string;
  defaultImg: string;
  price:number=0;
  count:number=0; //预约的项目数量
  staffList:Array<StaffItemData> = new Array<StaffItemData>(); //服务人员
  selected:boolean = false; //是否选中

  public static fromProduct(item:ProductInfo):ProductItemData{
    let productItemData = new ProductItemData();
    productItemData.id = item.id;
    productItemData.name = item.name;
    productItemData.typeId = item.typeId;
    productItemData.defaultImg = item.defaultImg;
    productItemData.price = item.price;
    return productItemData;
  }
}

export class StaffItemData{
  id:string;
  name:string;
  phone:number;
  headImg:string;
  gender:number;
  selected:boolean = false; //是否选中

  public static fromBuser(item:BUser):StaffItemData{
    let staffItemData = new StaffItemData();
    staffItemData.id = item.id;
    staffItemData.name = item.name;
    staffItemData.phone = item.phone;
    staffItemData.headImg = item.headImg;
    staffItemData.gender = item.gender;
    return staffItemData;
  }
}
