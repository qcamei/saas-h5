/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/27
 */
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {CustomerStatisticViewData} from "./customer-statistic.viewData";
import {AppUtils} from "../../../comModule/AppUtils";

export class CustomerStatisticViewDataMgr {

  public static instance: CustomerStatisticViewDataMgr = null;

  private viewDataMgr: ViewDataMgr<CustomerStatisticViewData> = new ViewDataMgr<CustomerStatisticViewData>();

  constructor() {

  }

  public static getInstance(): CustomerStatisticViewDataMgr {
    if (AppUtils.isNullObj(this.instance)) {
      this.instance = new CustomerStatisticViewDataMgr();
    }
    return this.instance;
  }

  public setViewData(viewData: CustomerStatisticViewData) {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(viewData: CustomerStatisticViewData, func: (viewData: CustomerStatisticViewData) => void) {
    this.viewDataMgr.onDataChanged(viewData, func)
  }

}
