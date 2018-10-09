import {TodayAppointCompViewData} from "./TodayAppointComp";
import {ViewDataMgr} from "../../../zmComUtils/ViewDataMgr";

export class TodayAppointViewDataMgr {

  private static Instance: TodayAppointViewDataMgr = new TodayAppointViewDataMgr();

  public static getInstance(): TodayAppointViewDataMgr{
    return TodayAppointViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<TodayAppointCompViewData> = new ViewDataMgr<TodayAppointCompViewData>();

  public setData(vieData: TodayAppointCompViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:TodayAppointCompViewData, func: (viewData: TodayAppointCompViewData) => void) {
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
