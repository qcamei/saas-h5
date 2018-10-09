import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {OpLog} from "./data/OpLog";
import {ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/PageResp";
import {OpLogQueryForm} from "./apiData/OpLogQueryForm";
import {OpLogDao} from "./OpLogDao";


@Injectable()
export class OpLogMgr {
  private opLogDao: OpLogDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.opLogDao = new OpLogDao(restProxy);
  }

  /**
   * 查询操作日志列表
   * @param {} queryForm
   * @returns {Promise<PageResp>}
   */
  public getOpLogPageInfo(queryForm: OpLogQueryForm): Promise<PageResp> {
    let findPath = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId.toString())
      .add("buserName", queryForm.buserName)
      .add("name", queryForm.name)
      .add("type", queryForm.type === -1 ? "" : queryForm.type.toString())//-1表示全部type
      .add("minTime", queryForm.minTime.toString())
      .add("maxTime", queryForm.maxTime.toString())
      .add("pageItemCount", queryForm.pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.opLogDao.getPageRespByType(findPath, reqMap, OpLog);
  }

  public getOpLog(apptId: string): Promise<OpLog> {
    return this.opLogDao.get(apptId);
  }

}


