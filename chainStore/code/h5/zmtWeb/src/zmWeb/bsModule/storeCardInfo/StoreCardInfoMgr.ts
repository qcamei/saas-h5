import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {StoreCardInfo} from "./data/StoreCardInfo";
import {AppCfg} from "../../comModule/AppCfg";
import {AddMembershipCard} from "./apiData/AddMembershipCard";
import {StoreCardInfoUpdateApiForm} from "./apiData/StoreCardInfoUpdateApiForm";
import {StoreCardInfoUpdateType} from "./apiData/StoreCardInfoUpdateType";
import {DelMembershipCard} from "./apiData/DelMembershipCard";
import {DelProductCardForm} from "./apiData/DelProductCardForm";
import {ReqMap} from "../../comModule/AppUtils";
import {UpdMemberCardStateData} from "./apiData/UpdMemberCardStateData";
import {BatchUpdMemberCardStateData} from "./apiData/BatchUpdMemberCardStateData";
import {AddProductCardForm} from "./apiData/AddProductCardForm";
import {UpdProductCardStateData} from "./apiData/UpdProductCardStateData";
import {BatchUpdProductCardStateData} from "./apiData/BatchUpdProductCardStateData";
import {PrdCardTypeAddForm} from "./apiData/PrdCardTypeAddForm";
import {PrdCardTypeRemoveForm} from "./apiData/PrdCardTypeRemoveForm";
import {PrdCardTypeUpdateForm} from "./apiData/PrdCardTypeUpdateForm";
import {CardBatchCancelForm} from "./apiData/CardBatchCancelForm";
import {CardBatchPullForm} from "./apiData/CardBatchPullForm";
import {CardCancelForm} from "./apiData/CardCancelForm";
import {CardPullForm} from "./apiData/CardPullForm";
import {MemberCardBatchCancelForm} from "./apiData/MemberCardBatchCancelForm";
import {MemberCardBatchPullForm} from "./apiData/MemberCardBatchPullForm";
import {MemberCardCancelForm} from "./apiData/MemberCardCancelForm";
import {MemberCardPullForm} from "./apiData/MemberCardPullForm";
import {RestResp} from "../../comModule/RestResp";
import {AddPrdCardTop} from "./apiData/AddPrdCardTop";
import {CancelPrdCardTop} from "./apiData/CancelPrdCardTop";


@Injectable()
export class StoreCardInfoMgr {
  private storeCardInfoDao: StoreCardInfoDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.storeCardInfoDao = new StoreCardInfoDao(restProxy);
  }

  public getStoreCardInfo(storeId:string):Promise<StoreCardInfo> {
    let uriPath = "findSimpleStoreInfo/"+storeId;
    let reqMap = new ReqMap();
    return this.storeCardInfoDao.findOneWithReqParam(uriPath,reqMap);
  }

  /**********************会员卡相关操作*********************************/
  public addMemCardCard(storeId,addForm:AddMembershipCard):Promise<RestResp>{
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.AddMembershipCard;
    updateForm.addMembershipCard = addForm;
    return this.updateStoreCardInfoWithResp(storeId,updateForm);
  }

  public deleteMemCard(storeId,deleteForm:DelMembershipCard){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.DelMembershipCard;
    updateForm.delMembershipCard = deleteForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public updateMemCardCardState(storeId:string,updateStateForm:UpdMemberCardStateData){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.UpdateMemberCardState;
    updateForm.updateMemberCardStateData = updateStateForm;
    return this.updateStoreCardInfo(storeId,updateForm);

  }

  public batchUpdateMemCardCardState(storeId:string,batchUpdateStateForm:BatchUpdMemberCardStateData){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.BatchUpdateMemberCardState;
    updateForm.batchUpdateMemberCardStateData = batchUpdateStateForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  /**********************次卡相关操作*********************************/

  public addProdutCard(storeId,addForm:AddProductCardForm):Promise<RestResp>{
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.AddProductCard;
    updateForm.addProductCard = addForm;
    return this.updateStoreCardInfoWithResp(storeId,updateForm);
  }

  public deletePrdCard(storeId,deleteForm:DelProductCardForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.DelProductCard;
    updateForm.delProductCard = deleteForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public updateProductCardState(storeId:string,updateStateForm:UpdProductCardStateData){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.UpdateProductCardState;
    updateForm.updateProductCardStateData = updateStateForm;
    return this.updateStoreCardInfo(storeId,updateForm);

  }

  public batchUpdateProductCardState(storeId:string,batchUpdateStateForm:BatchUpdProductCardStateData){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.BatchUpdateProductCardState;
    updateForm.batchUpdateProductCardStateData = batchUpdateStateForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public toTop(storeId:string,toTopForm:AddPrdCardTop){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.AddPrdCardTop;
    updateForm.addPrdCardTop = toTopForm;
    return this.updateStoreCardInfo(storeId,updateForm);

  }

  public cancelTop(storeId:string,cancelTopForm:CancelPrdCardTop){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.CancelPrdCardTop;
    updateForm.cancelPrdCardTop = cancelTopForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public addProductCardType(storeId:string,addTypeForm:PrdCardTypeAddForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.AddPrdCardType;
    updateForm.prdCardTypeAddForm = addTypeForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public removeProductCardType(storeId:string,removeTypeForm:PrdCardTypeRemoveForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.DelPrdCardType;
    updateForm.prdCardTypeRemoveForm = removeTypeForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }
  public updateProductCardType(storeId:string,updateTypeForm:PrdCardTypeUpdateForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.UpdPrdCardType;
    updateForm.prdCardTypeUpdateForm = updateTypeForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public updateStoreCardInfo(storeId, updateForm):Promise<boolean>{
    return this.storeCardInfoDao.updateWithId(storeId,updateForm);
  }

  public updateStoreCardInfoWithResp(storeId, updateForm):Promise<RestResp>{
    return this.storeCardInfoDao.update4Resp(storeId,updateForm);
  }

  /*************************连锁店数据同步**************************************/
  public batchCancelChainCard(storeId:string,cardBatchCancelForm:CardBatchCancelForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.BatchCancelChainCard;
    updateForm.cardBatchCancelForm = cardBatchCancelForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public batchPullCardFromChain(storeId:string,cardBatchPullForm:CardBatchPullForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.BatchPullCardFromChain;
    updateForm.cardBatchPullForm = cardBatchPullForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public cancelChainCard(storeId:string,cardCancelForm:CardCancelForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.CancelChainCard;
    updateForm.cardCancelForm = cardCancelForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public pullCardFromChain(storeId:string,cardPullForm:CardPullForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.PullCardFromChain;
    updateForm.cardPullForm = cardPullForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public batchCancelChainMemberCard(storeId:string,memberCardBatchCancelForm:MemberCardBatchCancelForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.BatchCancelChainMemberCard;
    updateForm.memberCardBatchCancelForm = memberCardBatchCancelForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public batchPullMemberCardFromChain(storeId:string,memberCardBatchPullForm:MemberCardBatchPullForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.BatchPullMemberCardFromChain;
    updateForm.memberCardBatchPullForm = memberCardBatchPullForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public cancelChainMemberCard(storeId:string,memberCardCancelForm:MemberCardCancelForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.CancelChainMemberCard;
    updateForm.memberCardCancelForm = memberCardCancelForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  public pullMemberCardFromChain(storeId:string,memberCardPullForm:MemberCardPullForm){
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.PullMemberCardFromChain;
    updateForm.memberCardPullForm = memberCardPullForm;
    return this.updateStoreCardInfo(storeId,updateForm);
  }

  /*************************连锁店数据同步**************************************/


}

export class StoreCardInfoDao extends AsyncRestDao<StoreCardInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "storeCardInfo";
    super(StoreCardInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
