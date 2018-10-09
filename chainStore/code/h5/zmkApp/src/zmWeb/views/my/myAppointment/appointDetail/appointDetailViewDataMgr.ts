
import {AppointDetailViewData} from "./appointDetail.page";
import {ViewDataMgr} from "../../../zmComUtils/ViewDataMgr";

export class AppointDetailViewDataMgr{

  private static Instance: AppointDetailViewDataMgr = new AppointDetailViewDataMgr();

  public static getInstance(): AppointDetailViewDataMgr{
    return AppointDetailViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<AppointDetailViewData> = new ViewDataMgr<AppointDetailViewData>();

  public setData(viewData:AppointDetailViewData):void{
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:AppointDetailViewData, func:(viewData:AppointDetailViewData) => void){
    this.viewDataMgr.onDataChanged(initData,func);
  }

}
