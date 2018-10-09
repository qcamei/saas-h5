import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MallListViewData} from "./mallListViewData";

export class MallListViewDataMgr {

  private static Instance: MallListViewDataMgr = new MallListViewDataMgr();

  public static getInstance(): MallListViewDataMgr{
    return MallListViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MallListViewData> = new ViewDataMgr<MallListViewData>();

  public setData(vieData: MallListViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:MallListViewData, func: (viewData: MallListViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
