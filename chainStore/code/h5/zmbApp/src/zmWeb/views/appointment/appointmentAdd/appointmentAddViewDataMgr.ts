import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AppointmentAddViewData} from "./appointmentAdd.page";

export class AppointmentAddViewDataMgr {
  private static instance: AppointmentAddViewDataMgr = new AppointmentAddViewDataMgr();
  private viewDataMgr: ViewDataMgr<AppointmentAddViewData> = new ViewDataMgr<AppointmentAddViewData>();

  public static getInstance(): AppointmentAddViewDataMgr {
    return AppointmentAddViewDataMgr.instance;
  }

  public setData(viewData: AppointmentAddViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: AppointmentAddViewData, func: (viewData: AppointmentAddViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }
}
