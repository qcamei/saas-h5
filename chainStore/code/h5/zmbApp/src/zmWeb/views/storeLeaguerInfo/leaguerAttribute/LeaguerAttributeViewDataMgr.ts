import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {LeaguerAttributeViewData} from "./LeaguerAttribute.page";

export class LeaguerAttributeViewDataMgr{

  private static instance:LeaguerAttributeViewDataMgr = new LeaguerAttributeViewDataMgr();
  private viewDataMgr:ViewDataMgr<LeaguerAttributeViewData> = new ViewDataMgr<LeaguerAttributeViewData>();

  public static getInstance():LeaguerAttributeViewDataMgr{
    return LeaguerAttributeViewDataMgr.instance;
  }

  public setData(viewData:LeaguerAttributeViewData){
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(initViewData:LeaguerAttributeViewData,fun:(viewData:LeaguerAttributeViewData)=>void){
    this.viewDataMgr.onDataChanged(initViewData,fun);
  }

}
