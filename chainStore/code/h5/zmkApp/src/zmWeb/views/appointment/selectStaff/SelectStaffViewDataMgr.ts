import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {SelectStaffViewData} from "./SelectStaff.page";

export class SelectStaffViewDataMgr {

  private static Instance: SelectStaffViewDataMgr = new SelectStaffViewDataMgr();

  public static getInstance(): SelectStaffViewDataMgr{
    return SelectStaffViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<SelectStaffViewData> = new ViewDataMgr<SelectStaffViewData>();

  public setData(vieData: SelectStaffViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:SelectStaffViewData, func: (viewData: SelectStaffViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
