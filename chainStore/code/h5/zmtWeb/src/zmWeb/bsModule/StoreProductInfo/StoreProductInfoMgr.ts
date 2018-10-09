import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {StoreProductInfo} from "./data/StoreProductInfo";
import {AppCfg} from "../../comModule/AppCfg";
import {StoreProductInfoUpdateForm} from "./apiData/StoreProductInfoUpdateForm";
import {StoreProductInfoUpdateType} from "./apiData/StoreProductInfoUpdateType";
import {ExcelProduct} from "../excel/apiData/ExcelProduct";
import {ProductInfoTmp} from "./data/ProductInfoTmp";
import {RemoveProductInfoData} from "./apiData/RemoveProductInfoData";
import {RemoveProductTypeData} from "./apiData/RemoveProductTypeData";
import {UpdateProductInfoData} from "./apiData/UpdateProductInfoData";
import {ReqMap} from "../../comModule/AppUtils";
import {AddProductInfoData} from "./apiData/AddProductInfoData";
import {UpdateProductStateData} from "./apiData/UpdateProductStateData";
import {BatchUpdateProductStateData} from "./apiData/BatchUpdateProductStateData";
import {ProductBatchCancelForm} from "./apiData/ProductBatchCancelForm";
import {ProductBatchPullForm} from "./apiData/ProductBatchPullForm";
import {ProductPullForm} from "./apiData/ProductPullForm";
import {ProductCancelForm} from "./apiData/ProductCancelForm";
import {RestResp} from "../../comModule/RestResp";
import {AddProductToTopData} from "./apiData/AddProductToTopData";
import {CancelProductFromTopData} from "./apiData/CancelProductFromTopData";

@Injectable() //修饰器
export class StoreProductInfoMgr{

  private storePrdDao:StorePrdDao;


  constructor(private restProxy:AsyncRestProxy){
    this.storePrdDao = new StorePrdDao(restProxy);
  }

  public getStoreProductInfo(storeId:string):Promise<StoreProductInfo> {
    let uriPath = "findSimpleStoreInfo/"+storeId;
    let reqMap = new ReqMap();
    return this.storePrdDao.findOneWithReqParam(uriPath,reqMap);
  }

  /**
   * 从Excel批量添加项目
   */
  public addProductListFromExcel(storeId,addListForm:Array<ExcelProduct>){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.AddListFromExcel;
    updateForm.storeId = storeId;
    updateForm.addListFromExcel = addListForm;
    return this.storePrdDao.update4Resp(storeId,updateForm);
  }

  /**
   * 从店铺批量添加项目
   */
  public addProductListFromStore(storeId,addListForm:Array<ProductInfoTmp>){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.AddListFromStore;
    updateForm.storeId = storeId;
    updateForm.addListFromStore = addListForm;
    return this.storePrdDao.update4Resp(storeId,updateForm);
  }

  public addProduct(addForm:AddProductInfoData):Promise<RestResp>{
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.AddProductInfo;
    updateForm.addProductInfoData = addForm;
    return this.storePrdDao.update4Resp(addForm.storeId,updateForm);
  }

  public deleteProduct(removeForm:RemoveProductInfoData){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.RemoveProductInfo;
    updateForm.storeId = removeForm.storeId;
    updateForm.removeProductInfoData = removeForm;
    return this.updateProduct(removeForm.storeId,updateForm);
  }

  public editProductInfo(editForm:UpdateProductInfoData){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.UpdateProductInfo;
    updateForm.storeId = editForm.storeId;
    updateForm.updateProductInfoData = editForm;
    return this.updateProduct(editForm.storeId,updateForm);
  }

  public toTop(toTopData:AddProductToTopData){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.AddProductToTop;
    updateForm.addProductToTopData = toTopData;
    return this.updateProduct(toTopData.storeId,updateForm);
  }

  public cancelTop(cancelTopData:CancelProductFromTopData){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.CancelProductFromTop;
    updateForm.cancelProductFromTopData = cancelTopData;
    return this.updateProduct(cancelTopData.storeId,updateForm);
  }

  public updateProductInfoState(updateStateForm:UpdateProductStateData){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.UpdateProductState;
    updateForm.updateProductStateData = updateStateForm;
    return this.updateProduct(updateStateForm.storeId,updateForm);
  }

  public batchUpdateProductInfoState(batchUpdateStateForm:BatchUpdateProductStateData){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.BatchUpdateProductState;
    updateForm.batchUpdateProductStateData = batchUpdateStateForm;
    return this.updateProduct(batchUpdateStateForm.storeId,updateForm);
  }

  /***
   * 项目分类
   */
  public deleteProductType(removeForm:RemoveProductTypeData){
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.RemoveProductType;
    updateForm.storeId = removeForm.storeId;
    updateForm.removeProductTypeData = removeForm;
    return this.updateProduct(removeForm.storeId,updateForm);
  }


  public updateProduct(storeId, updateForm):Promise<boolean>{
    return this.storePrdDao.updateWithId(storeId,updateForm);
  }

  /******************************连锁店数据同步***************************************/
  public batchCancelChainProduct(storeId:string,productBatchCancelForm:ProductBatchCancelForm):Promise<boolean>{
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.storeId = storeId;
    updateForm.updateType = StoreProductInfoUpdateType.BatchCancelChainProduct;
    updateForm.productBatchCancelForm = productBatchCancelForm;
    return this.updateProduct(updateForm.storeId,updateForm);
  }

  public batchPullProductFromChain(storeId:string,productBatchPullForm:ProductBatchPullForm):Promise<boolean>{
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.storeId = storeId;
    updateForm.updateType = StoreProductInfoUpdateType.BatchPullProductFromChain;
    updateForm.productBatchPullForm = productBatchPullForm;
    return this.updateProduct(updateForm.storeId,updateForm);
  }

  public cancelChainProduct(storeId:string,productCancelForm:ProductCancelForm):Promise<boolean>{
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.storeId = storeId;
    updateForm.updateType = StoreProductInfoUpdateType.CancelChainProduct;
    updateForm.productCancelForm = productCancelForm;
    return this.updateProduct(updateForm.storeId,updateForm);
  }

  public pullProductFromChain(storeId:string,productPullForm:ProductPullForm):Promise<boolean>{
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.storeId = storeId;
    updateForm.updateType = StoreProductInfoUpdateType.PullProductFromChain;
    updateForm.productPullForm = productPullForm;
    return this.updateProduct(updateForm.storeId,updateForm);
  }

}

class StorePrdDao extends AsyncRestDao<StoreProductInfo>{
  constructor(restProxy:AsyncRestProxy){
    var table:string = "storeProductInfo";
    super(StoreProductInfo,restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
