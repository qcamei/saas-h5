import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {Order} from "./data/Order";
import {OrderQueryForm} from "./apiData/OrderQueryForm";
import {OrderUpdateStatusApiForm} from "./apiData/OrderUpdateStatusApiForm";
import {OrderUpdateType} from "./apiData/OrderUpdateType";
import {OrderUpdateApiForm} from "./apiData/OrderUpdateApiForm";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";

@Injectable()
export class OrderMgr {

  public static getInstance(): OrderMgr {
    return MgrPool.getInstance().get("OrderMgr",OrderMgr);
  }

  private orderDao: OrderDao;

  constructor() {
    this.orderDao = new OrderDao();
  }

  public get(storeId: string, orderId: string): Promise<Order> {
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern, storeId, orderId);
    return this.orderDao.getByUri(uri);
  }

 public updateOrderState(storeId: string, orderId: string, updateStatusData: OrderUpdateStatusApiForm): Promise<boolean> {
    let updateOrderForm: OrderUpdateApiForm = new OrderUpdateApiForm();
    updateOrderForm.storeId = storeId;
    updateOrderForm.updateType = OrderUpdateType.UpdateState;
    updateOrderForm.updateStatusData = updateStatusData;
    return this.updateOrder(orderId, updateOrderForm);
  }

  public updateOrder(orderId: string, updateOrderForm: OrderUpdateApiForm): Promise<boolean> {
    return this.orderDao.updateWithId(orderId, updateOrderForm);
  }

  public findOrderPageInfo(queryForm:OrderQueryForm):Promise<PageResp>{
    let findPath = "findOrderPageInfo";
    let reqMap = new ReqMap();
    reqMap.add("buserId", queryForm.buserId)
      .add("storeId", queryForm.storeId)
      .add("origin", queryForm.origin.toString())
      .add("status", queryForm.status.toString())
      .add("minTime", queryForm.minTime.toString())
      .add("maxTime", queryForm.maxTime.toString())
      .add("pageItemCount", queryForm.pageItemCount.toString());
    return this.orderDao.getPageRespByType(findPath, reqMap, Order);
  }

}

export class OrderDao extends AsyncRestDao<Order> {
  constructor() {
    var table = "order";
    super(Order, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
