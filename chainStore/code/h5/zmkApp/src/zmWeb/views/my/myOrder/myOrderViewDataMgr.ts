
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MyOrderViewData} from "./myOrder.page";
export class MyOrderViewDataMgr{

  private static Instance: MyOrderViewDataMgr = new MyOrderViewDataMgr();

  public static getInstance(): MyOrderViewDataMgr{

    return MyOrderViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MyOrderViewData> = new ViewDataMgr<MyOrderViewData>();

  public setData(viewData:MyOrderViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MyOrderViewData,func:(viewData:MyOrderViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
