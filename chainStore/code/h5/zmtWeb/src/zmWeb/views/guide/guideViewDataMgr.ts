import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {GuideViewData} from "./guide/guide";
import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";


@Injectable()
export class GuideViewDataMgr {

  private static Instance: GuideViewDataMgr = new GuideViewDataMgr();

  public static getInstance(): GuideViewDataMgr{
    return GuideViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<GuideViewData> = new ViewDataMgr<GuideViewData>();

  public setData(vieData: GuideViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:GuideViewData, func: (viewData: GuideViewData) => void) {
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
