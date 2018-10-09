import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";
import {MainViewData} from "./MainViewData";

export class MainViewDataMgr {
  private static instance: MainViewDataMgr = new MainViewDataMgr();
  private viewDataMgr: ViewDataMgr<MainViewData> = new ViewDataMgr<MainViewData>();


  public static getInstance(): MainViewDataMgr {
    return MainViewDataMgr.instance;
  }

  public setData(viewData: MainViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: MainViewData, func: (viewData: MainViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }


  onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }

}
