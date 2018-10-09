import {ViewDataMgr} from "../../../zmComUtils/ViewDataMgr";
import {UnfinishedWFCompViewData} from "./UnfinishedWFCompViewData";

export class UnfinishedWFViewDataMgr {


  private static Instance: UnfinishedWFViewDataMgr = new UnfinishedWFViewDataMgr();

  public static getInstance(): UnfinishedWFViewDataMgr{
    return UnfinishedWFViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<UnfinishedWFCompViewData> = new ViewDataMgr<UnfinishedWFCompViewData>();

  public setData(vieData: UnfinishedWFCompViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:UnfinishedWFCompViewData, func: (viewData: UnfinishedWFCompViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  public onInformDataChanged(func: () => void) {
    this.viewDataMgr.onInformDataChanged(func);
  }
  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

  public notifyDataChanged(): void {
    this.viewDataMgr.notifyDataChanged();
  }

}
