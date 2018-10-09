import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {WorkFlowData} from "./data/WorkFlowData";
import {WorkFlowDataAddForm} from "./apiData/WorkFlowDataAddForm";
import {ReqMap} from "../../comModule/AppUtils";
import {WorkFlowDataAddByAppoint} from './apiData/WorkFlowDataAddByAppoint';
import {WorkFlowDataUpdateForm} from "./apiData/WorkFlowDataUpdateForm";
import {WorkFlowDataUpdateEnum} from "./apiData/WorkFlowDataUpdateEnum";
import {WorkFlowDataUpdateStatusForm} from "./apiData/WorkFlowDataUpdateStatusForm";
import {WorkFlowDataQueryForm} from "./apiData/WorkFlowDataQueryForm";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {WorkFlowDataSwitchLeaguer} from "./apiData/WorkFlowDataSwitchLeaguer";
import {RestResp} from "../../comModule/RestResp";
import {WorkFlowDataSaveForm} from "./apiData/save/WorkFlowDataSaveForm";
import {WorkFlowDataCancelForm} from "./apiData/WorkFlowDataCancelForm";

@Injectable()
export class WorkFlowMgr {
  private workFlowDao: WorkFlowDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.workFlowDao = new WorkFlowDao(restProxy);
  }

  /**
   * 获取店铺工作流
   * minTime,maxTime,status,storeId,workFlowTypeId,pageItemCount,pageNo
   */
  public getList(workFlowDataQueryForm:WorkFlowDataQueryForm): Promise<Array<WorkFlowData>> {
    let findPath = "findByCond";
    let reqMap = new ReqMap();
    reqMap.add("storeId",workFlowDataQueryForm.storeId);
    reqMap.add("minTime",workFlowDataQueryForm.minTime);
    reqMap.add("maxTime",workFlowDataQueryForm.maxTime);
    return this.workFlowDao.findListWithReqParam(findPath, reqMap, workFlowDataQueryForm.pageItemCount, workFlowDataQueryForm.pageNo);
  }

  /**
   * 工作流列表分页
   * minTime,maxTime,status,storeId,workFlowTypeId,pageItemCount,pageNo,leaguerNameOrPhone,buserId
   */
  public getWorkFlowPageInfo(queryForm:WorkFlowDataQueryForm): Promise<PageResp> {
    let findPath = "findWorkFlowDataPageInfo";
    let reqMap = new ReqMap();
    reqMap.add("storeId",queryForm.storeId)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString())
      .add("leaguerNameOrPhone",queryForm.leaguerNameOrPhone)
      .add("status", queryForm.status)
      .add("minTime", queryForm.minTime)
      .add("maxTime", queryForm.maxTime)
      .add("buserId", queryForm.buserId)
      .add("workFlowTypeId", queryForm.workFlowTypeId.toString());
    return this.workFlowDao.getPageRespByType(findPath, reqMap, WorkFlowData);
  }

  public getByWFTypeId(workFlowDataQueryForm:WorkFlowDataQueryForm): Promise<Array<WorkFlowData>> {
    let findPath = "findByCond";
    let reqMap = new ReqMap();
    reqMap.add("storeId",workFlowDataQueryForm.storeId);
    reqMap.add("workFlowTypeId",workFlowDataQueryForm.workFlowTypeId+"");
    return this.workFlowDao.findListWithReqParam(findPath, reqMap, workFlowDataQueryForm.pageItemCount, workFlowDataQueryForm.pageNo);
  }

  /**
   * 预约转收银
   */
  public addByAppoint(addForm:WorkFlowDataAddByAppoint):Promise<WorkFlowData>{
    let findPath = "addByAppoint";
    return this.workFlowDao.addFormByCond(addForm,findPath);
  }

  /**
   * 删除工作流
   */
  public deleteWorkFlow(workFlowId:string):Promise<boolean>{
    return this.workFlowDao.delete(workFlowId);
  };

  /**
   * 根据id获取详情
   * @param workFlowId
   * @returns {Promise<WorkFlowData>}
   */
  public get(workFlowId): Promise<WorkFlowData> {
    return this.workFlowDao.get(workFlowId);
  };

  /**
   * 添加工作流
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addWorkFlow(addForm:WorkFlowDataAddForm):Promise<WorkFlowData>{
    return this.workFlowDao.addForm(addForm);
  }

  /**
   * 修改工作流状态
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateWorkFlowStatus(workFlowDataId,workFlowDataUpdateStatusForm:WorkFlowDataUpdateStatusForm):Promise<boolean>{
    let workFlowDataUpdateForm = new WorkFlowDataUpdateForm();
    workFlowDataUpdateForm.updateType = WorkFlowDataUpdateEnum.updateWorkFlowDataStatus;
    workFlowDataUpdateForm.workFlowDataStatusForm = workFlowDataUpdateStatusForm;
    return this.workFlowDao.updateWithId(workFlowDataId,workFlowDataUpdateForm);
  }

  /**
   * 作废工作流
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public cancelWorkFlowData(workFlowDataId,workFlowDataCancelForm:WorkFlowDataCancelForm):Promise<boolean>{
    let workFlowDataUpdateForm = new WorkFlowDataUpdateForm();
    workFlowDataUpdateForm.updateType = WorkFlowDataUpdateEnum.cancelWorkFlowData;
    workFlowDataUpdateForm.workFlowDataCancelForm = workFlowDataCancelForm;
    return this.workFlowDao.updateWithId(workFlowDataId,workFlowDataUpdateForm);
  }

  /**
   * 切换会员
   * @param leaguerId
   * @returns {Promise<boolean>}
   */
  public switchLeaguer(workFlowDataId:string,leaguerId:string):Promise<RestResp>{
    let uriPath = "switchLeaguer";
    let workFlowDataSwitchLeaguer = new WorkFlowDataSwitchLeaguer();
    workFlowDataSwitchLeaguer.leaguerId = leaguerId;
    workFlowDataSwitchLeaguer.workFlowDataId = workFlowDataId;
    return this.workFlowDao.rawReq(uriPath,workFlowDataSwitchLeaguer);
  }

  /**
   * 流程挂单保存
   */
  public saveOrUpdate(addForm:WorkFlowDataSaveForm):Promise<WorkFlowData>{
    let uriPath = "saveOrUpdate";
    return this.workFlowDao.addFormByCond(addForm,uriPath);
  }

}

//工作流
export class WorkFlowDao extends AsyncRestDao<WorkFlowData> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData";
    super(WorkFlowData, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

