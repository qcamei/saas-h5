import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AppointCancelReasonViewData} from "./appointCancelReason.page";

export class AppointCancelReasonViewDataMgr {

  private static instance: AppointCancelReasonViewDataMgr = new AppointCancelReasonViewDataMgr();
  private viewDataMgr: ViewDataMgr<AppointCancelReasonViewData> = new ViewDataMgr<AppointCancelReasonViewData>();

  public static getInstance(): AppointCancelReasonViewDataMgr {
    return AppointCancelReasonViewDataMgr.instance;
  }

  public setData(viewData: AppointCancelReasonViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: AppointCancelReasonViewData, func: (viewData: AppointCancelReasonViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
