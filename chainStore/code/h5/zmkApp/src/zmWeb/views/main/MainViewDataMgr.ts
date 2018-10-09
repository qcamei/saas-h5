import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";
import {MainViewData} from "./MainViewData";

export class MainViewDataMgr {

  private static Instance: MainViewDataMgr = new MainViewDataMgr();

  public static getInstance(): MainViewDataMgr{
    return MainViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MainViewData> = new ViewDataMgr<MainViewData>();

  public setData(vieData: MainViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:MainViewData, func: (viewData: MainViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }


}
