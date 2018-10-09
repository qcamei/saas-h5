import {AddProductInfoData} from "./AddProductInfoData";
import {UpdateProductInfoData} from "./UpdateProductInfoData";
import {RemoveProductInfoData} from "./RemoveProductInfoData";
import {UpdateProductStateData} from "./UpdateProductStateData";
import {AddProductTypeData} from "./AddProductTypeData";
import {UpdateProductTypeData} from "./UpdateProductTypeData";
import {RemoveProductTypeData} from "./RemoveProductTypeData";
import {AddProductToTopData} from "./AddProductToTopData";
import {CancelProductFromTopData} from "./CancelProductFromTopData";
import {BatchUpdateProductStateData} from "./BatchUpdateProductStateData";
import {ExcelProduct} from "../../excel/apiData/ExcelProduct";
import {ProductInfoTmp} from "../data/ProductInfoTmp";
import {ProductBatchCancelForm} from "./ProductBatchCancelForm";
import {ProductBatchPullForm} from "./ProductBatchPullForm";
import {ProductCancelForm} from "./ProductCancelForm";
import {ProductPullForm} from "./ProductPullForm";
export class StoreProductInfoUpdateForm {

  updateType: number;

  storeId: string;

  addProductInfoData: AddProductInfoData;
  addListFromExcel: Array<ExcelProduct>;//批量新增项目
  addListFromStore: Array<ProductInfoTmp>;//批量新增项目
  updateProductInfoData: UpdateProductInfoData;
  removeProductInfoData: RemoveProductInfoData;
  updateProductStateData: UpdateProductStateData;
  batchUpdateProductStateData: BatchUpdateProductStateData;

  addProductTypeData: AddProductTypeData;
  updateProductTypeData: UpdateProductTypeData;
  removeProductTypeData: RemoveProductTypeData;

  addProductToTopData: AddProductToTopData;
  cancelProductFromTopData: CancelProductFromTopData;

  /*************************连锁店数据同步**************************************/
  productBatchCancelForm:ProductBatchCancelForm;
  productBatchPullForm:ProductBatchPullForm;
  productCancelForm:ProductCancelForm;
  productPullForm:ProductPullForm;

  constructor() {
  }
}
