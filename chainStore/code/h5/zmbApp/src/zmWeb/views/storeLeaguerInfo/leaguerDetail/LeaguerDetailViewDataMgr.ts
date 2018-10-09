import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {LeaguerDetailViewData} from "./LeaguerDetail.page";

export class LeaguerDetailViewDataMgr {

  private static instance: LeaguerDetailViewDataMgr = new LeaguerDetailViewDataMgr();
  private viewDataMgr: ViewDataMgr<LeaguerDetailViewData> = new ViewDataMgr<LeaguerDetailViewData>();

  public static getInstance(): LeaguerDetailViewDataMgr {
    return LeaguerDetailViewDataMgr.instance;
  }

  public setData(viewData: LeaguerDetailViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: LeaguerDetailViewData, func: (viewData: LeaguerDetailViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
