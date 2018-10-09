import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {Order} from "./data/Order";
import {OrderQueryForm} from "./apiData/OrderQueryForm";
import {PreOrderForCuserAddForm} from "./apiData/PreOrderForCuserAddForm";
import {PayOrderForCuserForm} from "./apiData/PayOrderForCuserForm";
import {OrderUpdateStatusApiForm} from "./apiData/OrderUpdateStatusApiForm";
import {OrderUpdateType} from "./apiData/OrderUpdateType";
import {OrderUpdateApiForm} from "./apiData/OrderUpdateApiForm";
import {MallOrderQueryForm} from "./apiData/MallOrderQueryForm";
import {MallOrder} from "./data/MallOrder";

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

  public addOrder(addOrderForm: PreOrderForCuserAddForm): Promise<Order> {
    let uriPath = "addOrder";
    return this.orderDao.addWithUri(uriPath, addOrderForm);
  }
 public payOrder(payOrderForCuserForm:PayOrderForCuserForm):Promise<Order>{
    let uriPath = "payOrder";
    return this.orderDao.addWithUri(uriPath,payOrderForCuserForm);
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

  public findOrderPageInfo(queryForm:OrderQueryForm){
    let findPath = "findOrderPageInfo";
    let reqMap = new ReqMap();
    reqMap.add("leaguerId", queryForm.leaguerId)
      .add("storeId", queryForm.storeId)
      .add("orderType", queryForm.orderType.toString())
      .add("origin", queryForm.origin.toString())
      .add("status", queryForm.status.toString())
      .add("pageNo", queryForm.pageNo.toString())
      .add("pageItemCount", queryForm.pageItemCount.toString());
    return this.orderDao.getPageRespByType(findPath, reqMap, Order);
  }

  public findMallOrderPage(queryForm:MallOrderQueryForm){
    let findPath = "findMallOrderPage";
    let reqMap = new ReqMap();
    let status = "";
    if(queryForm.status && queryForm.status.length>0){
      status = queryForm.status.toString();
    }
    reqMap.add("leaguerId", queryForm.leaguerId)
      .add("storeId", queryForm.storeId)
      .add("status", status)
      .add("pageNo", queryForm.pageNo.toString())
      .add("pageItemCount", queryForm.pageItemCount.toString());
    return this.orderDao.getPageRespByType(findPath, reqMap, MallOrder);
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
