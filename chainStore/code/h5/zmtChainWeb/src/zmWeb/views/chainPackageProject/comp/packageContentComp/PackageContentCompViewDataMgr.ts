import {ViewDataMgr} from "../../../zmComUtils/ViewDataMgr";
import {PackageContentCompViewData} from "./PackageContentCompViewData";

export class PackageContentViewDataMgr {

  private static Instance: PackageContentViewDataMgr = new PackageContentViewDataMgr();

  public static getInstance(): PackageContentViewDataMgr{
    return PackageContentViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<PackageContentCompViewData> = new ViewDataMgr<PackageContentCompViewData>();

  public setData(vieData: PackageContentCompViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:PackageContentCompViewData, func: (viewData: PackageContentCompViewData) => void) {
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
