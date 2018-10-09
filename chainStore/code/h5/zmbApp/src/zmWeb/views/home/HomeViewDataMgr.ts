import {HomeViewData} from "./homeViewData";
import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";

export class HomeViewDataMgr {
  private static Instance: HomeViewDataMgr = new HomeViewDataMgr();

  public static getInstance(): HomeViewDataMgr {
    return HomeViewDataMgr.Instance;
  }

  private viewDataMgr: ViewDataMgr<HomeViewData> = new ViewDataMgr<HomeViewData>();

  public setHomeViewData(homeViewData: HomeViewData): void {
    this.viewDataMgr.setData(homeViewData);
  }

  public onDataChanged(initData:HomeViewData, func: (homeViewData: HomeViewData) => void) {
    this.viewDataMgr.onDataChanged(initData, func);
  }


  public onInformDataChanged(func: () => void) {
    this.viewDataMgr.onInformDataChanged(func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }


  public notifyDataChanged(): void {
    this.viewDataMgr.notifyDataChanged();
    // TodayAppointViewDataMgr.getInstance().notifyDataChanged();
    // UnfinishedWFViewDataMgr.getInstance().notifyDataChanged();
  }

}
