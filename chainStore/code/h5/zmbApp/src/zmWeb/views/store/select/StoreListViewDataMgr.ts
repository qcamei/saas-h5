import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {StoreListViewData} from "./StoreListViewData";

export class StoreListViewDataMgr {

  private static Instance: StoreListViewDataMgr = new StoreListViewDataMgr();

  public static getInstance(): StoreListViewDataMgr{
    return StoreListViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<StoreListViewData> = new ViewDataMgr<StoreListViewData>();

  public setData(vieData: StoreListViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:StoreListViewData, func: (viewData: StoreListViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
