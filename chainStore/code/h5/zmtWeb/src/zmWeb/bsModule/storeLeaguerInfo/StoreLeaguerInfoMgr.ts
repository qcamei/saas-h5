import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {StoreLeaguerInfo} from "./data/StoreLeaguerInfo";
import {LeaguerDelApiForm} from "./apiData/LeaguerDelApiForm";
import {StoreLeaguerInfoUpdateApiForm} from "./apiData/StoreLeaguerInfoUpdateApiForm";
import {StoreLeaguerInfoUpdateType} from "./apiData/StoreLeaguerInfoUpdateType";
import {LeaguerAddApiForm} from "./apiData/LeaguerAddApiForm";
import {LeaguerUpdateInfoApiForm} from "./apiData/LeaguerUpdateInfoApiForm";
import {RechargeMemberCardForm} from './apiData/RechargeMemberCardForm';
import {UpdateMemberCardForm} from "./apiData/UpdateMemberCardForm";
import {PurchaseProductCardForm} from "./apiData/PurchaseProductCardForm";
import {AppCfg} from "../../comModule/AppCfg";
import {ExcelLeaguer} from "../excel/apiData/ExcelLeaguer";
import {Leaguer} from "./data/Leaguer";
import {RestResp} from "../../comModule/RestResp";
import {AppUtils} from "../../comModule/AppUtils";
import {LeaguerLabelAddForm} from "./apiData/LeaguerLabelAddForm";


@Injectable()
export class StoreLeaguerInfoMgr {
  private storeLeaguerInfoDao: StoreLeaguerInfoDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.storeLeaguerInfoDao = new StoreLeaguerInfoDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param storeId
   * @returns {Promise<StoreLeaguerInfo>}
   */
  public get(storeId): Promise<StoreLeaguerInfo> {
    let findPath = "findSimpleStoreInfo";
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,findPath,storeId);
    return this.storeLeaguerInfoDao.get(uri);
  };

  /**
   * 删除会员
   * @returns {Promise<boolean>}
   */
  public deleteLeaguer(storeId,leaguerId){
    let leaguerDelApiForm = new LeaguerDelApiForm();
    leaguerDelApiForm.id = leaguerId;
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.DelLeaguer;
    updateForm.storeId = storeId;
    updateForm.leaguerDelInfoData = leaguerDelApiForm;
    return this.storeLeaguerInfoDao.updateWithId(storeId,updateForm);
  }

  /**
   * 添加会员
   * @param storeId
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addLeaguer(storeId,addForm:LeaguerAddApiForm):Promise<RestResp>{
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.AddLeaguerInfo;
    updateForm.storeId = storeId;
    updateForm.leaguerAddInfoData = addForm;
    return this.storeLeaguerInfoDao.update4Resp(storeId,updateForm);
  }

  /**
   * 从Excel批量导入会员
   * @param storeId
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addLeaguerListFromExcel(storeId,addListForm:Array<ExcelLeaguer>){
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.AddListFromExcel;
    updateForm.storeId = storeId;
    updateForm.addListFromExcel = addListForm;
    return this.storeLeaguerInfoDao.update4Resp(storeId,updateForm);
  }

  /**
   * 从店铺批量导入会员
   * @param storeId
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addLeaguerListFromStore(storeId,addListForm:Array<Leaguer>){
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.AddListFromStore;
    updateForm.storeId = storeId;
    updateForm.addListFromStore = addListForm;
    return this.storeLeaguerInfoDao.update4Resp(storeId,updateForm);
  }

  /**
   * 通过id列表批量新增会员
   * @param storeId
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addListOfLeaguerIds(storeId,leaguerIds:string){
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.AddListOfLeaguerIds;
    updateForm.storeId = storeId;
    updateForm.leaguerIds = leaguerIds;
    return this.storeLeaguerInfoDao.update4Resp(storeId,updateForm);
  }

  /**
   * 会员充值
   * @param storeId
   * @param {RechargeMemberCardForm} rechargeForm
   * @returns {Promise<boolean>}
   */
  public rechargeMemberCard(storeId, rechargeForm: RechargeMemberCardForm){
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.storeId = storeId;
    updateForm.updateType = StoreLeaguerInfoUpdateType.RechargeMemberCard;
    updateForm.rechargeMemberCardForm = rechargeForm;
    return this.storeLeaguerInfoDao.updateWithId(storeId,updateForm);
  }

  /**
   * 修改会员信息
   * @returns {Promise<boolean>}
   */
  public updateLeaguerInfo(storeId,leaguerUpdateInfoApiForm:LeaguerUpdateInfoApiForm):Promise<RestResp>{
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.UpdateLeaguerInfo;
    updateForm.storeId = storeId;
    updateForm.leaguerUpdateInfoData = leaguerUpdateInfoApiForm;
    return this.storeLeaguerInfoDao.update4Resp(storeId,updateForm);
  }

  /**
   * 设置会员会员卡信息
   * @returns {Promise<boolean>}
   */
  public updateMemberCard(storeId,updateMemberCardForm:UpdateMemberCardForm){
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.UpdateMemberCard;
    updateForm.storeId = storeId;
    updateForm.updateMemberCardForm = updateMemberCardForm;
    return this.storeLeaguerInfoDao.updateWithId(storeId,updateForm);
  }

  /**
   * 会员购买次卡
   * @returns {Promise<boolean>}
   */
  public purchaseProductCard(storeId,purchaseProductCardForm:PurchaseProductCardForm){
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.PurchaseProductCard;
    updateForm.storeId = storeId;
    updateForm.purchaseProductCardForm = purchaseProductCardForm;
    return this.storeLeaguerInfoDao.updateWithId(storeId,updateForm);
  }

  /**
   * 添加标签
   * @returns {Promise<boolean>}
   */
  public addLeaguerLabel(storeId,leaguerLabelAddForm:LeaguerLabelAddForm):Promise<boolean>{
    let updateForm = new StoreLeaguerInfoUpdateApiForm();
    updateForm.updateType = StoreLeaguerInfoUpdateType.AddLeaguerLabel;
    updateForm.storeId = storeId;
    updateForm.leaguerLabelAddForm = leaguerLabelAddForm;
    return this.storeLeaguerInfoDao.updateWithId(storeId,updateForm);
  }

}

export class StoreLeaguerInfoDao extends AsyncRestDao<StoreLeaguerInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "storeLeaguerInfo";
    super(StoreLeaguerInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
