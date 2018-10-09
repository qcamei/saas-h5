
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {OrderDetailViewData} from "./orderDetail.page";
export class OrderDetailViewDataMgr{

  private static Instance: OrderDetailViewDataMgr = new OrderDetailViewDataMgr();

  public static getInstance(): OrderDetailViewDataMgr{

    return OrderDetailViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<OrderDetailViewData> = new ViewDataMgr<OrderDetailViewData>();

  public setData(viewData:OrderDetailViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:OrderDetailViewData,func:(viewData:OrderDetailViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
