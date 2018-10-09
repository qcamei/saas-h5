import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AppointmentDetailViewData} from "./appointmentDetail.page";

export class AppointmentDetailViewDataMgr {

  private static instance: AppointmentDetailViewDataMgr = new AppointmentDetailViewDataMgr();
  private viewDataMgr: ViewDataMgr<AppointmentDetailViewData> = new ViewDataMgr<AppointmentDetailViewData>();

  public static getInstance(): AppointmentDetailViewDataMgr {
    return AppointmentDetailViewDataMgr.instance;
  }

  public setData(viewData: AppointmentDetailViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: AppointmentDetailViewData, func: (viewData: AppointmentDetailViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
