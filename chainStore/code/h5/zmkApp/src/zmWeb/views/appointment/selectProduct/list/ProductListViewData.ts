import {ProductItemData, AppointmentViewData} from "../../AppointmentViewData";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {ZmMap} from "../../../../comModule/AppUtils";

export class ProductListViewData{
  productList: Array<ProductItemData>;
  productTypeMap: ZmMap<ProductType>;

  public static fromAppoint(viewData:AppointmentViewData):ProductListViewData{
    let productListViewData = new ProductListViewData();
    productListViewData.productList = viewData.productList;
    productListViewData.productTypeMap = viewData.productTypeMap;
    return productListViewData;
  }
}

