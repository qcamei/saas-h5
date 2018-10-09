import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
import {ProductDetail} from "../../../../bsModule/chainProduct/data/ProductDetail";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {ProductDetailQueryForm} from "../../../../bsModule/chainProduct/apiData/ProductDetailQueryForm";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {Constants} from "../../../common/Util/Constants";
import {MgrPool} from "../../../../comModule/MgrPool";

export class ProductInfoListViewData {
  public static getInstance():ProductInfoListViewData{
    let target = MgrPool.getInstance().get("ProductInfoListViewData",ProductInfoListViewData);
    if(AppUtils.isNullObj(target)){
      target = new ProductInfoListViewData();
    }
    return target;
  }

  public initData(){
    MgrPool.getInstance().setNull("ProductInfoListViewData",ProductInfoListViewData);
  }

  productList: Array<ProductDetail> = new Array<ProductDetail>();//原始数据
  curPage: number = 1;
  recordCount: number;//总记录数
  loadingFinish: boolean = false;

  productTypeList: Array<ProductType> = new Array<ProductType>();
  productTypeMap: ZmMap<ProductType>;

  queryForm: ProductDetailQueryForm = new ProductDetailQueryForm();
  state:number = Constants.DEFAULT_STATE_VALUE;
  isSelectedAll:boolean = false;

  //分配门店相关
  public storeList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds:Array<string> = new Array<string>();

}
