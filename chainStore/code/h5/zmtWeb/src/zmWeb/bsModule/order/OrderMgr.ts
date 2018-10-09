import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Order} from "./data/Order";
import {ReqMap} from "../../comModule/AppUtils";
import {OrderQueryForm} from "./apiData/OrderQueryForm";
import {OrderItemAddForm} from "./apiData/OrderItemAddForm";
import {OrderUpdateApiForm} from "./apiData/OrderUpdateApiForm";
import {OrderUpdateType} from "./apiData/OrderUpdateType";
import {OrderUpdatePayItemApiForm} from "./apiData/OrderUpdatePayItemApiForm";
import {PageResp} from "../../comModule/PageResp";
import {RestResp} from "../../comModule/RestResp";
import {AppCfg} from "../../comModule/AppCfg";
import {OrderAddByWorkflowDataIdForm} from "./apiData/OrderAddByWorkflowDataIdForm";
import {PreOrderAddForm} from "./apiData/PreOrderAddForm";
import {PayOrderWithNoteApiForm} from "./apiData/PayOrderWithNoteApiForm";
import {MallOrderQueryForm} from "./apiData/MallOrderQueryForm";


@Injectable()
export class OrderMgr {
  private orderDao: OrderDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.orderDao = new OrderDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param orderId
   * @returns {Promise<Order>}
   */
  public get(orderId): Promise<Order> {
    return this.orderDao.get(orderId);
  }

  /**
   * 查询订单列表
   * @param queryForm
   * @returns {Promise<Array<Order>>}
   */
  public findOrderList(queryForm:OrderQueryForm):Promise<Array<Order>>{
    var reqMap =new ReqMap().add("storeId",queryForm.storeId)
      .add("leaguerId", queryForm.leaguerId)
      .add("orderType",queryForm.orderType.toString())
      .add("numberOrName",queryForm.numberOrName)
      .add("status",queryForm.status.toString())
      .add("cuserId",queryForm.cuserId)
      .add("maxTime",queryForm.maxTime.toString())
      .add("minTime",queryForm.minTime.toString());
    var findPath = "findOrderList";
    return this.orderDao.findListWithReqParam(findPath, reqMap, queryForm.pageItemCount, queryForm.pageNo);
  }

  /**
   * 查询订单分页
   * @param queryForm
   * @returns {Promise<Array<Order>>}
   */
  public findOrderPageInfo(queryForm:OrderQueryForm):Promise<PageResp>{
    let reqMap = new ReqMap().add("storeId",queryForm.storeId)
      .add("leaguerId", queryForm.leaguerId)
      .add("orderType",queryForm.orderType.toString())
      .add("numberOrName",queryForm.numberOrName)
      .add("status",queryForm.status)
      .add("cuserId",queryForm.cuserId)
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "findOrderPageInfo";
    return this.orderDao.getPageRespByType(findPath,reqMap,Order);
  }

  /**
   * 工作流转生成订单 预生成未支付订单
   * @returns {Promise<RestResp>}
   */
  public addPreOrder(addForm:PreOrderAddForm): Promise<RestResp> {
    return this.orderDao.rawReq("addPreOrder",addForm);
  }

  /**
   * 工作流转生成订单
   * @returns {Promise<RestResp>}
   */
  public addOrderByWorkflowDataId(addForm:OrderAddByWorkflowDataIdForm): Promise<RestResp> {
    return this.orderDao.rawReq("addOrderByWorkflowDataId",addForm);
  }

  /**
   * 添加开单收银工作流订单
   * @returns {Promise<Order>}
   */
  public addOrder(addForm:OrderItemAddForm): Promise<RestResp> {
    return this.orderDao.rawReq("",addForm);
  }

  /**
   * 添加开单收银工作流订单
   * @returns {Promise<Order>}
   */
  public addOrderT(addForm:OrderItemAddForm): Promise<Order> {
    return this.orderDao.addForm(addForm);
  }

  /**
   * 订单支付
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public payOrder(storeId,orderId,updateForm:OrderUpdatePayItemApiForm):Promise<boolean>{
    let orderUpdateApiForm = new OrderUpdateApiForm();
    orderUpdateApiForm.storeId = storeId;
    orderUpdateApiForm.updateType = OrderUpdateType.UpdatePayItem;
    orderUpdateApiForm.updatePayItemApiForm = updateForm;
    return this.orderDao.updateWithId(orderId,orderUpdateApiForm);
  }

  /**
   * 订单支付,添加订单备注
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public payOrderWithNote(storeId,orderId,updateForm:PayOrderWithNoteApiForm):Promise<RestResp>{
    let orderUpdateApiForm = new OrderUpdateApiForm();
    orderUpdateApiForm.storeId = storeId;
    orderUpdateApiForm.updateType = OrderUpdateType.PayOrderWithNote;
    orderUpdateApiForm.payOrderWithNoteApiForm = updateForm;
    return this.orderDao.update4Resp(orderId,orderUpdateApiForm);
  }

  /**
   * 分页查询商城订单
   * @returns {Promise<PageResp>}
   */
  public findMallOrderPage(queryForm: MallOrderQueryForm): Promise<PageResp>{
    let reqMap = new ReqMap()
      .add("storeId",queryForm.storeId.toString())
      .add("maxTime",queryForm.maxTime.toString())
      .add("minTime",queryForm.minTime.toString())
      .add("numberOrName",queryForm.numberOrName)
      .add("status",queryForm.status.toString())
      .add("leaguerId", queryForm.leaguerId)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "findMallOrderPage";
    return this.orderDao.getPageRespByType(findPath,reqMap,Order);
  }
}

export class OrderDao extends AsyncRestDao<Order> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "order";
    super(Order, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
