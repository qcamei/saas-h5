import {LeaguerListViewData} from "./LeaguerListViewData";
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";

export class LeaguerListViewDataMgr {

  private static instance: LeaguerListViewDataMgr = new LeaguerListViewDataMgr();
  private viewDataMgr: ViewDataMgr<LeaguerListViewData> = new ViewDataMgr<LeaguerListViewData>();

  public static getInstance(): LeaguerListViewDataMgr {
    return LeaguerListViewDataMgr.instance;
  }

  public setData(viewData: LeaguerListViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: LeaguerListViewData, func: (viewData: LeaguerListViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
