import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {OrderListViewData} from "./orderList.page";

export class OrderListViewDataMgr {

  private static Instance: OrderListViewDataMgr = new OrderListViewDataMgr();

  public static getInstance(): OrderListViewDataMgr{
    return OrderListViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<OrderListViewData> = new ViewDataMgr<OrderListViewData>();

  public setData(vieData: OrderListViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:OrderListViewData, func: (viewData: OrderListViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
