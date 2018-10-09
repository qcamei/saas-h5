import {Injectable} from '@angular/core';
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {SellProduct} from "./data/SellProduct";
import {AppCfg} from "../../comModule/AppCfg";
import {SellProductQueryForm} from "./apiData/SellProductQueryForm";
import {ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/PageResp";
import {SellProductUpdateApiForm} from "./apiData/SellProductUpdateApiForm";
import {SellProductAllotForm} from "./apiData/SellProductAllotForm";
import {SellProductUpdateType} from "./apiData/SellProductUpdateType";
import {SellProductBatchAllotForm} from "./apiData/SellProductBatchAllotForm";
import {SellProductUpdateStateForm} from "./apiData/SellProductUpdateStateForm";
import {SellProductBatchUpdateStateForm} from "./apiData/SellProductBatchUpdateStateForm";


@Injectable()
export class SellProductMgr {

  private sellProductDao: SellProductDao;

  constructor(restProxy: AsyncRestProxy) {
    this.sellProductDao = new SellProductDao(restProxy);
  }

  public getPageInfo(queryForm:SellProductQueryForm): Promise<PageResp> {
    let path = "getPageInfo";
    let reqMap = new ReqMap();
    let state = "";
    if(queryForm.stateArray){
      state = queryForm.stateArray.join(",");
    }
    let sellProductType = "";
    if(queryForm.sellProductTypeArray){
      sellProductType = queryForm.sellProductTypeArray.join(",");
    }
    reqMap.add("numberOrName",queryForm.numberOrName)
      .add("typeId",queryForm.typeId)
      .add("stateArray",state)
      .add("sellProductTypeArray",sellProductType)
      .add("chainId",queryForm.chainId)
      .add("pageNo",queryForm.pageNo.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString());
    return this.sellProductDao.getPageRespByType(path,reqMap,SellProduct);
  }


  public allotSellProduct(chainId:string,sellProductAllotForm:SellProductAllotForm){
    let updateApiForm:SellProductUpdateApiForm = new SellProductUpdateApiForm();
    updateApiForm.updateType = SellProductUpdateType.AllotSellProduct;
    updateApiForm.allotSellProductForm = sellProductAllotForm;
    return this.updateSellProduct(chainId,updateApiForm);
  }

  public batchAllotSellProduct(chainId:string,batchAllotForm:SellProductBatchAllotForm){
    let updateApiForm:SellProductUpdateApiForm = new SellProductUpdateApiForm();
    updateApiForm.updateType = SellProductUpdateType.BatchAllotSellProduct;
    updateApiForm.batchAllotSellProductForm = batchAllotForm;
    return this.updateSellProduct(chainId,updateApiForm);
  }

  public updateSellProductState(chainId:string,updateStateForm:SellProductUpdateStateForm){
    let updateApiForm:SellProductUpdateApiForm = new SellProductUpdateApiForm();
    updateApiForm.updateType = SellProductUpdateType.UpdateSellProductState;
    updateApiForm.updateStateForm = updateStateForm;
    return this.updateSellProduct(chainId,updateApiForm);
  }

  public batchUpdateSellProductState(chainId:string,batchUpdateStateForm:SellProductBatchUpdateStateForm){
    let updateApiForm:SellProductUpdateApiForm = new SellProductUpdateApiForm();
    updateApiForm.updateType = SellProductUpdateType.BatchUpdateSellProductState;
    updateApiForm.batchUpdateStateForm = batchUpdateStateForm;
    return this.updateSellProduct(chainId,updateApiForm);
  }

  public updateSellProduct(chainId:string,updateApiForm:SellProductUpdateApiForm){
    return this.sellProductDao.updateWithId(chainId,updateApiForm);
  }


}

class SellProductDao extends AsyncRestDao<SellProduct> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "sellProduct";
    super(SellProduct, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


