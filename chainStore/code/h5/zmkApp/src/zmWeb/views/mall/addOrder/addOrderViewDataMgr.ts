
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AddOrderViewData} from "./addOrder.page";

export class AddOrderViewDataMgr{

  private static Instance: AddOrderViewDataMgr = new AddOrderViewDataMgr();

  public static getInstance(): AddOrderViewDataMgr{

    return AddOrderViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<AddOrderViewData> = new ViewDataMgr<AddOrderViewData>();

  public setData(viewData:AddOrderViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:AddOrderViewData,func:(viewData:AddOrderViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
