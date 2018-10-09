import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {EditLeaguerViewData} from "./EditLeaguer.page";

export class EditLeaguerViewDataMgr{

  private static instance:EditLeaguerViewDataMgr = new EditLeaguerViewDataMgr();
  private viewDataMgr:ViewDataMgr<EditLeaguerViewData> = new ViewDataMgr<EditLeaguerViewData>();

  public static getInstance():EditLeaguerViewDataMgr{
    return EditLeaguerViewDataMgr.instance;
  }

  public setData(viewData:EditLeaguerViewData){
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(initViewData:EditLeaguerViewData,fun:(viewData:EditLeaguerViewData)=>void){
    this.viewDataMgr.onDataChanged(initViewData,fun);
  }

}
