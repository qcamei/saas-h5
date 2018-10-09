import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AddLeaguerViewData} from "./AddLeaguer.page";

export class AddLeaguerViewDataMgr{

  private static instance:AddLeaguerViewDataMgr = new AddLeaguerViewDataMgr();
  private viewDataMgr:ViewDataMgr<AddLeaguerViewData> = new ViewDataMgr<AddLeaguerViewData>();

  public static getInstance():AddLeaguerViewDataMgr{
    return AddLeaguerViewDataMgr.instance;
  }

  public setData(viewData:AddLeaguerViewData){
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(initViewData:AddLeaguerViewData,fun:(viewData:AddLeaguerViewData)=>void){
    this.viewDataMgr.onDataChanged(initViewData,fun);
  }

}
