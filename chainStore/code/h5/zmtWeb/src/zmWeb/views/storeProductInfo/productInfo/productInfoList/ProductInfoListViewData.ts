import {ProductDetail} from "../../../../bsModule/productDetail/data/ProductDetail";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {ProductDetailQueryForm} from "../../../../bsModule/productDetail/apiData/ProductDetailQueryForm";
import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
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
  recordCount: number;//总记录数
  loadingFinish: boolean = false;

  productTypeList: Array<ProductType> = new Array<ProductType>();
  productTypeMap: ZmMap<ProductType>;

  curPage:number = 1;
  queryForm: ProductDetailQueryForm = new ProductDetailQueryForm();

  isSelectedAll:boolean = false;

}
export class DeleteData{
  canDelete:boolean = true;
  flag:number = -1;//0 次卡 1 套餐 2 次卡&&套餐
}
