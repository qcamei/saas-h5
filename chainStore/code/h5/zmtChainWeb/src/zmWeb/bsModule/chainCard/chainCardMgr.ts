import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ChainCard} from "./data/ChainCard";
import {AppCfg} from "../../comModule/AppCfg";
import {AddMembershipCard} from "./apiData/AddMembershipCard";
import {ChainCardUpdateApiForm} from "./apiData/ChainCardUpdateApiForm";
import {ChainCardUpdateType} from "./apiData/ChainCardUpdateType";
import {DelMembershipCard} from "./apiData/DelMembershipCard";
import {DelProductCardForm} from "./apiData/DelProductCardForm";
import {UpdMemberCardStateData} from "./apiData/UpdMemberCardStateData";
import {BatchUpdMemberCardStateData} from "./apiData/BatchUpdMemberCardStateData";
import {AddProductCardForm} from "./apiData/AddProductCardForm";
import {UpdProductCardStateData} from "./apiData/UpdProductCardStateData";
import {BatchUpdProductCardStateData} from "./apiData/BatchUpdProductCardStateData";
import {PrdCardTypeUpdateForm} from "./apiData/PrdCardTypeUpdateForm";
import {PrdCardTypeRemoveForm} from "./apiData/PrdCardTypeRemoveForm";
import {PrdCardTypeAddForm} from "./apiData/PrdCardTypeAddForm";
import {MemberCardAllotForm} from "./apiData/MemberCardAllotForm";
import {MemberCardBatchAllotForm} from "./apiData/MemberCardBatchAllotForm";
import {ProductCardAllotForm} from "./apiData/ProductCardAllotForm";
import {ProductCardBatchAllotForm} from "./apiData/ProductCardBatchAllotForm";


@Injectable()
export class ChainCardMgr {
  private chainCardDao: ChainCardDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainCardDao = new ChainCardDao(restProxy);
  }


  public getChainCard(chainId:string):Promise<ChainCard> {
    return this.chainCardDao.get(chainId);
  }

  public addMemCard(chainId,addForm:AddMembershipCard){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.AddMembershipCard;
    updateForm.addMembershipCard = addForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public deleteMemCard(chainId,deleteForm:DelMembershipCard){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.DelMembershipCard;
    updateForm.delMembershipCard = deleteForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public updateMemCardCardState(chainId:string,updateStateForm:UpdMemberCardStateData):Promise<boolean>{
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.UpdMemberCardState;
    updateForm.updateMemberCardStateData = updateStateForm;
    return this.updateChainCard(chainId,updateForm);

  }

  public batchUpdateMemCardCardState(chainId:string,batchUpdateStateForm:BatchUpdMemberCardStateData){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.BatchUpdMemberCardState;
    updateForm.batchUpdateMemberCardStateData = batchUpdateStateForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public addProdutCard(chainId,addForm:AddProductCardForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.AddProductCard;
    updateForm.addProductCard = addForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public deleteProductCard(chainId,deleteForm:DelProductCardForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.DelProductCard;
    updateForm.delProductCard = deleteForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public updateProductCardState(chainId:string,updateStateForm:UpdProductCardStateData){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.UpdProductCardState;
    updateForm.updateProductCardStateData = updateStateForm;
    return this.updateChainCard(chainId,updateForm);

  }

  public batchUpdateProductCardState(chainId:string,batchUpdateStateForm:BatchUpdProductCardStateData){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.BatchUpdProductCardState;
    updateForm.batchUpdateProductCardStateData = batchUpdateStateForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public addProductCardType(chainId:string,addTypeForm:PrdCardTypeAddForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.AddPrdCardType;
    updateForm.prdCardTypeAddForm = addTypeForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public removeProductCardType(chainId:string,removeTypeForm:PrdCardTypeRemoveForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.DelPrdCardType;
    updateForm.prdCardTypeRemoveForm = removeTypeForm;
    return this.updateChainCard(chainId,updateForm);
  }
  public updateProductCardType(chainId:string,updateTypeForm:PrdCardTypeUpdateForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.UpdPrdCardType;
    updateForm.prdCardTypeUpdateForm = updateTypeForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public allotStore(chainId:string,allotForm:MemberCardAllotForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.MemberCardAllot;
    updateForm.memberCardAllotForm = allotForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public batchAllotStore(chainId:string,batchAllotForm:MemberCardBatchAllotForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.MemberCardBatchAllot;
    updateForm.memberCardBatchAllotForm = batchAllotForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public allotProductCard(chainId:string,productCardAllotForm:ProductCardAllotForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.ProductCardAllot;
    updateForm.productCardAllotForm = productCardAllotForm;
    return this.updateChainCard(chainId,updateForm);
  }

  public batchAllotProductCard(chainId:string,productCardBatchAllotForm:ProductCardBatchAllotForm){
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.ProductCardBatchAllot;
    updateForm.productCardBatchAllotForm = productCardBatchAllotForm;
    return this.updateChainCard(chainId,updateForm);
  }




  public updateChainCard(chainId, updateForm):Promise<boolean>{
    return this.chainCardDao.updateWithId(chainId,updateForm);
  }


}

export class ChainCardDao extends AsyncRestDao<ChainCard> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chainCard";
    super(ChainCard, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
