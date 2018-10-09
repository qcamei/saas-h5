

import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {ChainProduct} from "./data/ChainProduct";
import {AddProductInfoData} from "./apiData/AddProductInfoData";
import {ChainProductUpdateForm} from "./apiData/ChainProductUpdateForm";
import {ChainProductUpdateType} from "./apiData/ChainProductUpdateType";
import {RemoveProductInfoData} from "./apiData/RemoveProductInfoData";
import {UpdateProductInfoData} from "./apiData/UpdateProductInfoData";
import {UpdateProductStateData} from "./apiData/UpdateProductStateData";
import {RemoveProductTypeData} from "./apiData/RemoveProductTypeData";
import {BatchUpdateProductStateData} from "./apiData/BatchUpdateProductStateData";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ProductAllotForm} from "./apiData/ProductAllotForm";
import {ProductBatchAllotForm} from "./apiData/ProductBatchAllotForm";
import {AddProductTypeData} from "./apiData/AddProductTypeData";
import {UpdateProductTypeData} from "./apiData/UpdateProductTypeData";

@Injectable() //修饰器
export class ChainProductMgr{

  private chainProductDao:ChainProductDao;


  constructor(private restProxy:AsyncRestProxy){
    this.chainProductDao = new ChainProductDao(restProxy);
  }

  public getChainProduct(storeId:string):Promise<ChainProduct> {
    return this.chainProductDao.get(storeId);
  }


  public addProduct(chainId:string,addForm:AddProductInfoData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.AddProductInfo;
    updateForm.addProductInfoData = addForm;
    return this.updateProduct(chainId,updateForm);
  }

  public deleteProduct(chainId:string,removeForm:RemoveProductInfoData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.RemoveProductInfo;
    updateForm.removeProductInfoData = removeForm;
    return this.updateProduct(chainId,updateForm);
  }

  public editProduct(chainId:string,editForm:UpdateProductInfoData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.UpdateProductInfo;
    updateForm.updateProductInfoData = editForm;
    return this.updateProduct(chainId,updateForm);
  }

  public addProductType(chainId:string,addProductTypeData:AddProductTypeData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.AddProductType;
    updateForm.addProductTypeData = addProductTypeData;
    return this.updateProduct(chainId,updateForm);
  }

  public updateProductType(chainId:string,updateProductTypeData:UpdateProductTypeData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.UpdateProductType;
    updateForm.updateProductTypeData = updateProductTypeData;
    return this.updateProduct(chainId,updateForm);
  }

  public deleteProductType(chainId:string,removeForm:RemoveProductTypeData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.RemoveProductType;
    updateForm.removeProductTypeData = removeForm;
    return this.updateProduct(chainId,updateForm);
  }

  public updateProductState(chainId:string,updateStateForm:UpdateProductStateData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.UpdateProductState;
    updateForm.updateProductStateData = updateStateForm;
    return this.updateProduct(chainId,updateForm);
  }

  public batchUpdateProductState(chainId:string,batchUpdateStateForm:BatchUpdateProductStateData){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.BatchUpdateProductState;
    updateForm.batchUpdateProductStateData = batchUpdateStateForm;
    return this.updateProduct(chainId,updateForm);
  }

  public allotStore(chainId:string,productAllotForm:ProductAllotForm){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.AllotStore;
    updateForm.productAllotForm = productAllotForm;
    return this.updateProduct(chainId,updateForm);
  }

  public batchAllotStore(chainId:string,productBatchAllotForm:ProductBatchAllotForm){
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.BatchAllotStore;
    updateForm.productBatchAllotForm = productBatchAllotForm;
    return this.updateProduct(chainId,updateForm);
  }

  public updateProduct(chainId:string, updateForm):Promise<boolean>{
    return this.chainProductDao.updateWithId(chainId,updateForm);
  }

}

class ChainProductDao extends AsyncRestDao<ChainProduct>{
  constructor(restProxy:AsyncRestProxy){
    var table:string = "chainProduct";
    super(ChainProduct,restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
