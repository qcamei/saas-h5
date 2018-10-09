import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {DataReportMainViewData} from "./data-report-main.viewData";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/26
 */

export class DataReportMainViewDataMgr {

  private static instance: DataReportMainViewDataMgr = null;
  private viewDataMgr: ViewDataMgr<DataReportMainViewData> = new ViewDataMgr<DataReportMainViewData>();

  constructor() {

  }

  public static getInstance() {
    if (AppUtils.isNullObj(this.instance)) {
      this.instance = new DataReportMainViewDataMgr();
    }
    return this.instance;
  }

  public setViewData(viewData: DataReportMainViewData) {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(viewData: DataReportMainViewData, func: (viewData: DataReportMainViewData) => void) {
    this.viewDataMgr.onDataChanged(viewData, func)
  }


}
