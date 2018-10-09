import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {StoreGoods} from "./data/StoreGoods";
import {StoreGoodsUpdateForm} from "./apiData/StoreGoodsUpdateForm";
import {GoodsAddForm} from "./apiData/GoodsAddForm";
import {StoreGoodsUpdateType} from "./apiData/StoreGoodsUpdateType";
import {AppCfg} from "../../comModule/AppCfg";
import {ExcelGoods} from "../excel/apiData/ExcelGoods";
import {GoodsTmp} from "./data/GoodsTmp";
import {GoodsRemoveForm} from "./apiData/GoodsRemoveForm";
import {GoodsTypeRemoveForm} from "./apiData/GoodsTypeRemoveForm";
import {ReqMap} from "../../comModule/AppUtils";
import {GoodsUpdateForm} from "./apiData/GoodsUpdateForm";
import {GoodsTypeAddForm} from "./apiData/GoodsTypeAddForm";
import {GoodsTypeUpdateForm} from "./apiData/GoodsTypeUpdateForm";
import {GoodsUpdateStateForm} from "./apiData/GoodsUpdateStateForm";
import {GoodsBatchUpdateStateForm} from "./apiData/GoodsBatchUpdateStateForm";
import {GoodsBatchCancelForm} from "./apiData/GoodsBatchCancelForm";
import {GoodsBatchPullForm} from "./apiData/GoodsBatchPullForm";
import {GoodsCancelForm} from "./apiData/GoodsCancelForm";
import {GoodsPullForm} from "./apiData/GoodsPullForm";
import {RestResp} from "../../comModule/RestResp";
import {GoodsAddToTopForm} from "./apiData/GoodsAddToTopForm";
import {GoodsCancelTopForm} from "./apiData/GoodsCancelTopForm";

@Injectable() //修饰器
export class StoreGoodsMgr{

  private storeGoodsDao:StoreGoodsDao;


  constructor(private restProxy:AsyncRestProxy){
    this.storeGoodsDao = new StoreGoodsDao(restProxy);
  }

  public getStoreGoods(storeId:string):Promise<StoreGoods> {
    let uriPath = "findSimpleStoreInfo/"+storeId;
    let reqMap = new ReqMap();
    return this.storeGoodsDao.findOneWithReqParam(uriPath,reqMap);
  }

  public addGoods(storeId:string, dataForm:GoodsAddForm):Promise<RestResp>{
    var updateForm:StoreGoodsUpdateForm = new StoreGoodsUpdateForm();
    updateForm.goodsAddForm = dataForm;
    updateForm.updateType = StoreGoodsUpdateType.AddGoods;
    return this.storeGoodsDao.update4Resp(storeId,updateForm);
  }

  public deleteGoods(storeId,removeForm:GoodsRemoveForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.RemoveGoods;
    updateForm.goodsRemoveForm = removeForm;
    return this.updateStoreGoods(storeId,updateForm);
  }

  public editGoods(storeId,editForm:GoodsUpdateForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.UpdateGoods;
    updateForm.goodsUpdateForm = editForm;
    return this.updateStoreGoods(storeId,updateForm);
  }

  public updateGoodsState(storeId,updateStateForm:GoodsUpdateStateForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.UpdateGoodsState;
    updateForm.goodsUpdateStateForm = updateStateForm;
    return this.updateStoreGoods(storeId,updateForm);
  }

  public batchUpdateGoodsState(storeId,natchUpdateStateForm:GoodsBatchUpdateStateForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.BatchUpdateGoodsState;
    updateForm.goodsBatchUpdateStateForm = natchUpdateStateForm;
    return this.updateStoreGoods(storeId,updateForm);
  }


  public toTop(storeId,toTopForm:GoodsAddToTopForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.AddGoodsToTop;
    updateForm.goodsAddToTopForm = toTopForm;
    return this.updateStoreGoods(storeId,updateForm);
  }

  public cancelTop(storeId,toTopForm:GoodsCancelTopForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.CancelGoodsFromTop;
    updateForm.goodsCancelTopForm = toTopForm;
    return this.updateStoreGoods(storeId,updateForm);
  }


  public addGoodsType(storeId,addForm:GoodsTypeAddForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.AddGoodsType;
    updateForm.goodsTypeAddForm = addForm;
    return this.updateStoreGoods(storeId,updateForm);
  }

  public updateGoodsType(storeId,editForm:GoodsTypeUpdateForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.UpdateGoodsType;
    updateForm.goodsTypeUpdateForm = editForm;
    return this.updateStoreGoods(storeId,updateForm);
  }


  public deleteGoodsType(storeId,removeForm:GoodsTypeRemoveForm){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.RemoveGoodsType;
    updateForm.goodsTypeRemoveForm = removeForm;
    return this.updateStoreGoods(storeId,updateForm);
  }

  public updateStoreGoods(storeId:string, updateForm:StoreGoodsUpdateForm):Promise<boolean>{
    return this.storeGoodsDao.updateWithId(storeId,updateForm);
  }


  /**
   * 从Excel批量导入商品
   * @param storeId
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addGoodsListFromExcel(storeId,addListForm:Array<ExcelGoods>){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.AddListFromExcel;
    updateForm.addListFromExcel = addListForm;
    return this.storeGoodsDao.update4Resp(storeId,updateForm);
  }

  /**
   * 从店铺批量导入商品
   * @param storeId
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addGoodsListFromStore(storeId,addListForm:Array<GoodsTmp>){
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.AddListFromStore;
    updateForm.addListFromStore = addListForm;
    return this.storeGoodsDao.update4Resp(storeId,updateForm);
  }

  /******************************连锁店数据同步***************************************/
  public batchCancelChainGoods(storeId:string,goodsBatchCancelForm:GoodsBatchCancelForm):Promise<boolean>{
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.BatchCancelChainGoods;
    updateForm.goodsBatchCancelForm = goodsBatchCancelForm;
    return this.storeGoodsDao.updateWithId(storeId,updateForm);
  }

  public batchPullGoodsFromChain(storeId:string,goodsBatchPullForm:GoodsBatchPullForm):Promise<boolean>{
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.BatchPullGoodsFromChain;
    updateForm.goodsBatchPullForm = goodsBatchPullForm;
    return this.storeGoodsDao.updateWithId(storeId,updateForm);
  }

  public cancelChainGoods(storeId:string,goodsCancelForm:GoodsCancelForm):Promise<boolean>{
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.CancelChainGoods;
    updateForm.goodsCancelForm = goodsCancelForm;
    return this.storeGoodsDao.updateWithId(storeId,updateForm);
  }

  public pullGoodsFromChain(storeId:string,goodsPullForm:GoodsPullForm):Promise<boolean>{
    let updateForm = new StoreGoodsUpdateForm();
    updateForm.updateType = StoreGoodsUpdateType.PullGoodsFromChain;
    updateForm.goodsPullForm = goodsPullForm;
    return this.storeGoodsDao.updateWithId(storeId,updateForm);
  }

}


class StoreGoodsDao extends AsyncRestDao<StoreGoods>{
  constructor(restProxy:AsyncRestProxy){
    var table:string = "storeGoods";
    super(StoreGoods,restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
