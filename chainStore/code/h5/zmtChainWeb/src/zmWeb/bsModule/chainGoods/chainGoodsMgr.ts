

import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {ChainGoods} from "./data/ChainGoods";
import {GoodsAddForm} from "./apiData/GoodsAddForm";
import {ChainGoodsUpdateForm} from "./apiData/ChainGoodsUpdateForm";
import {ChainGoodsUpdateType} from "./apiData/ChainGoodsUpdateType";
import {GoodsRemoveForm} from "./apiData/GoodsRemoveForm";
import {GoodsTypeAddForm} from "./apiData/GoodsTypeAddForm";
import {GoodsTypeUpdateForm} from "./apiData/GoodsTypeUpdateForm";
import {GoodsTypeRemoveForm} from "./apiData/GoodsTypeRemoveForm";
import {GoodsUpdateForm} from "./apiData/GoodsUpdateForm";
import {GoodsUpdateStateForm} from "./apiData/GoodsUpdateStateForm";
import {GoodsBatchUpdateStateForm} from "./apiData/GoodsBatchUpdateStateForm";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {GoodsAllotForm} from "./apiData/GoodsAllotForm";
import {GoodsBatchAllotForm} from "./apiData/GoodsBatchAllotForm";
@Injectable() //修饰器
export class ChainGoodsMgr{

  private chainGoodsDao:ChainGoodsDao;


  constructor(private restProxy:AsyncRestProxy){
    this.chainGoodsDao = new ChainGoodsDao(restProxy);
  }

  public getChainGoods(chainId:string):Promise<ChainGoods> {
    return this.chainGoodsDao.get(chainId);
  }

  public addGoods(chainId:string, dataForm:GoodsAddForm):Promise<boolean>{
    var updateForm:ChainGoodsUpdateForm = new ChainGoodsUpdateForm();
    updateForm.goodsAddForm = dataForm;
    updateForm.updateType = ChainGoodsUpdateType.AddGoods;
    return this.updateChainGoods(chainId, updateForm);
  }

  public deleteGoods(chainId,removeForm:GoodsRemoveForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.RemoveGoods;
    updateForm.goodsRemoveForm = removeForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public addGoodsType(chainId,addForm:GoodsTypeAddForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.AddGoodsType;
    updateForm.goodsTypeAddForm = addForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public updateGoodsType(chainId,editForm:GoodsTypeUpdateForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.UpdateGoodsType;
    updateForm.goodsTypeUpdateForm = editForm;
    return this.updateChainGoods(chainId,updateForm);
  }


  public deleteGoodsType(chainId,removeForm:GoodsTypeRemoveForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.RemoveGoodsType;
    updateForm.goodsTypeRemoveForm = removeForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public editGoods(chainId,editForm:GoodsUpdateForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.UpdateGoods;
    updateForm.goodsUpdateForm = editForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public updateGoodsState(chainId,updateStateForm:GoodsUpdateStateForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.UpdateGoodsState;
    updateForm.goodsUpdateStateForm = updateStateForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public batchUpdateGoodsState(chainId,batchUpdateStateForm:GoodsBatchUpdateStateForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.BatchUpdateGoodsState;
    updateForm.goodsBatchUpdateStateForm = batchUpdateStateForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public allotStore(chainId,allotForm:GoodsAllotForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.AllotStore;
    updateForm.goodsAllotForm = allotForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public batchAllotStore(chainId,batchAllotForm:GoodsBatchAllotForm){
    let updateForm = new ChainGoodsUpdateForm();
    updateForm.updateType = ChainGoodsUpdateType.BatchAllotStore;
    updateForm.goodsBatchAllotForm = batchAllotForm;
    return this.updateChainGoods(chainId,updateForm);
  }

  public updateChainGoods(chainId:string, updateForm:ChainGoodsUpdateForm):Promise<boolean>{
    return this.chainGoodsDao.updateWithId(chainId,updateForm);
  }

}


class ChainGoodsDao extends AsyncRestDao<ChainGoods>{
  constructor(restProxy:AsyncRestProxy){
    var table:string = "chainGoods";
    super(ChainGoods,restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
