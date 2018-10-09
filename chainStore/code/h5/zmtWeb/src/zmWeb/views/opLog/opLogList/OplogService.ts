import {OpLogMgr} from "../../../bsModule/opLog/OpLogMgr";
import {OplogViewDataMgr} from "../OplogViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {OpLogListViewData} from "./OpLogListViewData";
import {OpLogQueryForm} from "../../../bsModule/opLog/apiData/OpLogQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {Constants} from "../../common/Util/Constants";
import {OpLog} from "../../../bsModule/opLog/data/OpLog";

export class OplogService {

  constructor(private opLogMgr: OpLogMgr, private oplogViewDataMgr: OplogViewDataMgr) {
  }

  public handleViewData(viewDataP: OpLogListViewData) {
    this.oplogViewDataMgr.setOpLogListViewData(viewDataP);
  }

  /**
   * 获取列表
   * @param {OpLogListViewData} viewData
   * @returns {Promise<void>}
   */
  public async getPageData(viewData: OpLogListViewData) {
    viewData.loadingFinish = false;

    let queryForm: OpLogQueryForm = this.buildQueryForm(viewData);//构建表单

    let pageResp: PageResp = await this.opLogMgr.getOpLogPageInfo(queryForm);
    if (!AppUtils.isNullObj(pageResp)) {
      viewData.oplogs = this.buildOpLogDataList(pageResp.list);
      viewData.recordCount = pageResp.totalCount;
    } else {
      viewData.oplogs = new Array<OpLog>();
    }
    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  private buildQueryForm(viewDataTmp: OpLogListViewData) {
    let storeId: number = parseInt(SessionUtil.getInstance().getStoreId());
    let queryForm: OpLogQueryForm = new OpLogQueryForm();
    queryForm.storeId = storeId;
    queryForm.buserName = viewDataTmp.buserName;
    queryForm.name = null;
    queryForm.maxTime = viewDataTmp.maxTime;
    queryForm.minTime = viewDataTmp.minTime;
    queryForm.type = viewDataTmp.type;
    queryForm.pageNo = viewDataTmp.curPage;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    return queryForm;
  }

  private buildOpLogDataList(list: Array<OpLog>) {
    let opLogListTmp = new Array<OpLog>();
    AppUtils.copyJson(opLogListTmp, JSON.stringify(list));//深度copy数组
    return list;
  }
}
