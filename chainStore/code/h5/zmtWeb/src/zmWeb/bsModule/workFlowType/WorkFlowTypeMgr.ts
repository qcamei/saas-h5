import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {WorkFlowType} from "./data/WorkFlowType";
import {ReqMap} from "../../comModule/AppUtils";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class WorkFlowTypeMgr {
  private workFlowTypeDao: WorkFlowTypeDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.workFlowTypeDao = new WorkFlowTypeDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param id
   * @returns {Promise<WorkFlowType>}
   */
  public get(id): Promise<WorkFlowType> {
    return this.workFlowTypeDao.get(id);
  }

  public getWFTypeList(): Promise<Array<WorkFlowType>> {
    let findPath = "findByCond";
    let pageItemCount =100;
    let pageNo =1;
    return this.workFlowTypeDao.findList(findPath,pageItemCount,pageNo);
  }

/**
   * 根据name获取详情
   * @param name
   * @returns {Promise<WorkFlowType>}
   */
  public findByName(name): Promise<WorkFlowType> {
    let uriPath = "findByName";
    let reqMap = new ReqMap().add("typeName",name);
    return this.workFlowTypeDao.findOneWithReqParam(uriPath,reqMap);
  }

}

export class WorkFlowTypeDao extends AsyncRestDao<WorkFlowType> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowType";
    super(WorkFlowType, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
