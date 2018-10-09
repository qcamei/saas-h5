import {RootPageHeaderViewData} from "./RootPageHeaderViewData";
import {ViewDataMgr} from "../../../zmComUtils/ViewDataMgr";

export class RootPageHeaderViewDataMgr {
  private static instance: RootPageHeaderViewDataMgr = new RootPageHeaderViewDataMgr();
  private viewDataMgr: ViewDataMgr<RootPageHeaderViewData> = new ViewDataMgr<RootPageHeaderViewData>();


  public static getInstance(): RootPageHeaderViewDataMgr {
    return RootPageHeaderViewDataMgr.instance;
  }

  public setData(viewData: RootPageHeaderViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: RootPageHeaderViewData, func: (viewData: RootPageHeaderViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }


  onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
