import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AddLabelViewData} from "./AddLabel.page";

export class AddLabelViewDataMgr{

  private static instance:AddLabelViewDataMgr = new AddLabelViewDataMgr();
  private viewDataMgr:ViewDataMgr<AddLabelViewData> = new ViewDataMgr<AddLabelViewData>();

  public static getInstance():AddLabelViewDataMgr{
    return AddLabelViewDataMgr.instance;
  }

  public setData(viewData:AddLabelViewData){
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(initViewData:AddLabelViewData,fun:(viewData:AddLabelViewData)=>void){
    this.viewDataMgr.onDataChanged(initViewData,fun);
  }

}
