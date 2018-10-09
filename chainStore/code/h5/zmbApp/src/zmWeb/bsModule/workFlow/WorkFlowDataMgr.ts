import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {MgrPool} from "../../comModule/MgrPool";
import {WorkFlowData} from "./data/WorkFlowData";
import {AppCfg} from "../../comModule/AppCfg";
import {AppUtils, ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {WorkFlowDataQueryForm} from "./apiData/WorkFlowDataQueryForm";
import {WorkFlowDataSaveForm} from "./apiData/WorkFlowDataSaveForm";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {LoginResp} from "../buser/apiData/LoginResp";
import {WorkFlowDataAddByAppoint} from "./data/WorkFlowDataAddByAppoint";

export class WorkFlowDataMgr {

  public static getInstance(): WorkFlowDataMgr {
    return MgrPool.getInstance().get("WorkFlowDataMgr", WorkFlowDataMgr);
  }

  /**
   * 获取开单列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public getWFList(queryForm: WorkFlowDataQueryForm): Promise<PageResp> {
    let reqMap = new ReqMap()
      .add("storeId",AppUtils.isNullObj(queryForm.storeId)?null: queryForm.storeId.toString())
      .add("status", AppUtils.isNullObj(queryForm.status)?null: queryForm.status)
      .add("maxTime", AppUtils.isNullObj(queryForm.maxTime)?null: queryForm.maxTime.toString())
      .add("minTime", AppUtils.isNullObj(queryForm.minTime)?null: queryForm.minTime.toString())
      .add("workFlowTypeId", queryForm.workFlowTypeId)
      .add("leaguerNameOrPhone",queryForm.leaguerNameOrPhone)
      .add("buserId", AppUtils.isNullObj(queryForm.buserId)?null: queryForm.buserId.toString())
      .add("pageItemCount", AppUtils.isNullObj(queryForm.pageItemCount)?null: queryForm.pageItemCount.toString())
      .add("pageNo", AppUtils.isNullObj(queryForm.pageNo)?null: queryForm.pageNo.toString());
    let findPath = "findWorkFlowDataPageInfo";
    return WorkFlowDataDao.getInstance().getPageRespByType(findPath, reqMap, WorkFlowData);
  }

  /**
   * 添加或者保存 WorkFlowData
   * @param {WorkFlowDataSaveForm} inputForm
   * @returns {Promise<RestResp>}
   */
  public saveOrUpdate(inputForm: WorkFlowDataSaveForm): Promise<RestResp> {
    let actionName: string = "saveOrUpdate";
    return WorkFlowDataDao.getInstance().rawReq(actionName, inputForm);
  }

  /**
   * 根据 Id 获取 WorkFlowData
   * @param {number} wfId
   * @returns {Promise<WorkFlowData>}
   */
  public getWfById(wfId: number): Promise<WorkFlowData> {
    return WorkFlowDataDao.getInstance().get(wfId);
  }

  public addByAppoint(workFlowDataAddByAppoint:WorkFlowDataAddByAppoint):Promise<WorkFlowData>{
    let actionName: string = "addByAppoint";
    return WorkFlowDataDao.getInstance().addWithUri(actionName,workFlowDataAddByAppoint);
  }

}

export class WorkFlowDataDao extends AsyncRestDao<WorkFlowData> {
  constructor() {
    var table = "workFlowData";
    super(WorkFlowData, table);
  }

  public static getInstance(): WorkFlowDataDao {
    return MgrPool.getInstance().get("WorkFlowDataDao", WorkFlowDataDao);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
