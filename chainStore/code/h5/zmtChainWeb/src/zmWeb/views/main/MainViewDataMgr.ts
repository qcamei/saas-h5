import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";
import {MainViewData} from "./page/main.page";


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
