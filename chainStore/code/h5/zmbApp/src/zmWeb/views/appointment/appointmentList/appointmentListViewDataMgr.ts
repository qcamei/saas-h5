import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AppointmentListViewdata} from "./appointmentList.viewdata";

export class AppointmentListViewDataMgr {

  private static instance: AppointmentListViewDataMgr = new AppointmentListViewDataMgr();
  private viewDataMgr: ViewDataMgr<AppointmentListViewdata> = new ViewDataMgr<AppointmentListViewdata>();

  public static getInstance(): AppointmentListViewDataMgr {
    return AppointmentListViewDataMgr.instance;
  }

  public setData(viewData: AppointmentListViewdata): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: AppointmentListViewdata, func: (viewData: AppointmentListViewdata) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
