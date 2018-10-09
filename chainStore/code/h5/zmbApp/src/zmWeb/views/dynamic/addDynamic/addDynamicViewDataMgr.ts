
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AddDynamicViewData} from "./addDynamic.page";

export class AddDynamicViewDataMgr{

  private static Instance: AddDynamicViewDataMgr = new AddDynamicViewDataMgr();

  public static getInstance(): AddDynamicViewDataMgr{

    return AddDynamicViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<AddDynamicViewData> = new ViewDataMgr<AddDynamicViewData>();

  public setData(viewData:AddDynamicViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:AddDynamicViewData,func:(viewData:AddDynamicViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
