import {AppointmentViewData} from "./AppointmentViewData";
import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";

export class AppointmentViewDataMgr {
  private static instance: AppointmentViewDataMgr = new AppointmentViewDataMgr();
  private viewDataMgr: ViewDataMgr<AppointmentViewData> = new ViewDataMgr<AppointmentViewData>();


  public static getInstance(): AppointmentViewDataMgr {
    return AppointmentViewDataMgr.instance;
  }

  public setData(viewData: AppointmentViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: AppointmentViewData, func: (viewData: AppointmentViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }


  onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
