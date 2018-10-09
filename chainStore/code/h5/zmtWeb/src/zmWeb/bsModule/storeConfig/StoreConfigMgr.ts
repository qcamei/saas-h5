import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {StoreConfig} from "./data/StoreConfig";
import {LeaguerOriginAddForm} from "./apiData/LeaguerOriginAddForm";
import {StoreConfigUpdateForm} from "./apiData/StoreConfigUpdateForm";
import {StoreConfigUpdateType} from "./apiData/StoreConfigUpdateType";
import {LeaguerOriginRemoveForm} from "./apiData/LeaguerOriginRemoveForm";
import {LeaguerOriginUpdateForm} from "./apiData/LeaguerOriginUpdateForm";
import {RestResp} from "../../comModule/RestResp";
import {LeaguerTypeUpdateForm} from "./apiData/LeaguerTypeUpdateForm";
import {AppointTimeUpdateForm} from "./apiData/AppointTimeUpdateForm";
import {CancelAppointAddForm} from "./apiData/CancelAppointAddForm";
import {CancelAppointUpdateForm} from "./apiData/CancelAppointUpdateForm";
import {CancelAppointRemoveForm} from "./apiData/CancelAppointRemoveForm";
import {BaseAttributeStatusForm} from "./apiData/BaseAttributeStatusForm";
import {ExpandAttributeAddForm} from "./apiData/ExpandAttributeAddForm";
import {ExpandAttributeSortForm} from "./apiData/ExpandAttributeSortForm";
import {ExpandAttributeUpdateForm} from "./apiData/ExpandAttributeUpdateForm";
import {ExpandAttributeStatusForm} from "./apiData/ExpandAttributeStatusForm";
import {LeaguerAnalysisUpdateForm} from "./apiData/LeaguerAnalysisUpdateForm";


@Injectable()
export class StoreConfigMgr {
  private storeConfigDao: StoreConfigDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.storeConfigDao = new StoreConfigDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param storeId
   * @returns {Promise<Store>}
   */
  public get(storeId): Promise<StoreConfig> {
    return this.storeConfigDao.get(storeId);
  }

  /**
   * 添加会员来源
   * @param storeId
   * @param leaguerOriginAddForm
   * @returns {Promise<RestResp>}
   */
  public addLeaguerOrigin(storeId:string,leaguerOriginAddForm:LeaguerOriginAddForm):Promise<RestResp>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.AddLeaguerOrigin;
    storeConfigUpdateForm.leaguerOriginAddForm = leaguerOriginAddForm;
    return this.storeConfigDao.update4Resp(storeId,storeConfigUpdateForm);
  }

  /**
   * 删除会员来源
   * @param storeId
   * @param leaguerOriginRemoveForm
   * @returns {Promise<boolean>}
   */
  public removeLeaguerOrigin(storeId:string,leaguerOriginRemoveForm:LeaguerOriginRemoveForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.RemoveLeaguerOrigin;
    storeConfigUpdateForm.leaguerOriginRemoveForm = leaguerOriginRemoveForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

  /**
   * 修改会员来源
   * @param storeId
   * @param leaguerOriginUpdateForm
   * @returns {Promise<RestResp>}
   */
  public updateLeaguerOrigin(storeId:string,leaguerOriginUpdateForm:LeaguerOriginUpdateForm):Promise<RestResp>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.UpdateLeaguerOrigin;
    storeConfigUpdateForm.leaguerOriginUpdateForm = leaguerOriginUpdateForm;
    return this.storeConfigDao.update4Resp(storeId,storeConfigUpdateForm);
  }

  /**
   * 设置会员类型
   * @param storeId
   * @param leaguerTypeUpdateForm
   * @returns {Promise<boolean>}
   */
  public updateLeaguerType(storeId:string,leaguerTypeUpdateForm:LeaguerTypeUpdateForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.UpdateLeaguerType;
    storeConfigUpdateForm.leaguerTypeUpdateForm = leaguerTypeUpdateForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

  /**
   * 设置预约时间
   * @param storeId
   * @param appointTimeUpdateForm
   * @returns {Promise<boolean>}
   */
  public updateAppointTime(storeId:string,appointTimeUpdateForm:AppointTimeUpdateForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.UpdateAppointTime;
    storeConfigUpdateForm.appointTimeUpdateForm = appointTimeUpdateForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

  /**
   * 新建取消预约原因
   * @param storeId
   * @param cancelAppointAddForm
   * @returns {Promise<RestResp>}
   */
  public addCancelReason(storeId:string,cancelAppointAddForm:CancelAppointAddForm):Promise<RestResp>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.AddCancelReason;
    storeConfigUpdateForm.cancelAppointAddForm = cancelAppointAddForm;
    return this.storeConfigDao.update4Resp(storeId,storeConfigUpdateForm);
  }

  /**
   * 删除取消预约原因
   * @param storeId
   * @param cancelAppointRemoveForm
   * @returns {Promise<boolean>}
   */
  public removeCancelReason(storeId:string,cancelAppointRemoveForm:CancelAppointRemoveForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.RemoveCancelReason;
    storeConfigUpdateForm.cancelAppointRemoveForm = cancelAppointRemoveForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

  /**
   * 编辑取消预约原因
   * @param storeId
   * @param cancelAppointUpdateForm
   * @returns {Promise<RestResp>}
   */
  public updateCancelReason(storeId:string,cancelAppointUpdateForm:CancelAppointUpdateForm):Promise<RestResp>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.UpdateCancelReason;
    storeConfigUpdateForm.cancelAppointUpdateForm = cancelAppointUpdateForm;
    return this.storeConfigDao.update4Resp(storeId,storeConfigUpdateForm);
  }

  /**
   * 设置会员基础属性
   * @param storeId
   * @param baseAttributeStatusForm
   * @returns {Promise<boolean>}
   */
  public updateBaseAttribute(storeId:string,baseAttributeStatusForm:BaseAttributeStatusForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.UpdateBaseAttribute;
    storeConfigUpdateForm.baseAttributeStatusForm = baseAttributeStatusForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

  /**
   * 添加扩展属性
   * @param storeId
   * @param expandAttributeAddForm
   * @returns {Promise<RestResp>}
   */
  public addExpandAttribute(storeId:string,expandAttributeAddForm:ExpandAttributeAddForm):Promise<RestResp>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.AddExpandAttribute;
    storeConfigUpdateForm.expandAttributeAddForm = expandAttributeAddForm;
    return this.storeConfigDao.update4Resp(storeId,storeConfigUpdateForm);
  }

  /**
   * 扩展属性升降序
   * @param storeId
   * @param expandAttributeSortForm
   * @returns {Promise<boolean>}
   */
  public sortExpandAttribute(storeId:string,expandAttributeSortForm:ExpandAttributeSortForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.SortExpandAttribute;
    storeConfigUpdateForm.expandAttributeSortForm = expandAttributeSortForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

  /**
   * 修改扩展属性信息
   * @param storeId
   * @param expandAttributeUpdateForm
   * @returns {Promise<RestResp>}
   */
  public updateExpandAttribute(storeId:string,expandAttributeUpdateForm:ExpandAttributeUpdateForm):Promise<RestResp>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.UpdateExpandAttribute;
    storeConfigUpdateForm.expandAttributeUpdateForm = expandAttributeUpdateForm;
    return this.storeConfigDao.update4Resp(storeId,storeConfigUpdateForm);
  }

  /**
   * 设置扩展属性启用、必填
   * @param storeId
   * @param expandAttributeStatusForm
   * @returns {Promise<boolean>}
   */
  public setExpandAttributeStatus(storeId:string,expandAttributeStatusForm:ExpandAttributeStatusForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.StatusExpandAttribute;
    storeConfigUpdateForm.expandAttributeStatusForm = expandAttributeStatusForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

  /**
   * 会员分析设置
   * @param storeId
   * @param leaguerAnalysisUpdateForm
   * @returns {Promise<boolean>}
   */
  public updateLeaguerAnalysis(storeId:string,leaguerAnalysisUpdateForm:LeaguerAnalysisUpdateForm):Promise<boolean>{
    let storeConfigUpdateForm = new StoreConfigUpdateForm();
    storeConfigUpdateForm.updateType = StoreConfigUpdateType.UpdateLeaguerAnalysis;
    storeConfigUpdateForm.leaguerAnalysisUpdateForm = leaguerAnalysisUpdateForm;
    return this.storeConfigDao.updateWithId(storeId,storeConfigUpdateForm);
  }

}

export class StoreConfigDao extends AsyncRestDao<StoreConfig> {
  constructor(restProxy: AsyncRestProxy) {
    let table = "storeConfig";
    super(StoreConfig, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
