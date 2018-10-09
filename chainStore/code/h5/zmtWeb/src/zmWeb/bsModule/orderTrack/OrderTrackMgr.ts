import {Injectable} from "@angular/core";
import {OrderTrack} from "./data/OrderTrack";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AppCfg} from "../../comModule/AppCfg";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {OrderTrackUpdateApiForm} from "./apiData/OrderTrackUpdateApiForm";
import {OrderTrackUpdateStatusForm} from "./apiData/OrderTrackUpdateStatusForm";
import {OrderTrackUpdateType} from "./data/OrderTrackUpdateType";

@Injectable()
export class OrderTrackMgr {
  private orderDetailDao: OrderTrackDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.orderDetailDao = new OrderTrackDao(restProxy);
  }

  /**
   * 获取 OrderTrack
   * @param {string} storeId 店铺id
   * @param {string} orderId 订单id 也是 OrderTrack 的 id
   * @returns {Promise<OrderTrack>}
   */
  public getOrderTrack(storeId: string, orderId: string): Promise<OrderTrack> {
    let id: string = storeId + "/" + orderId;
    return this.orderDetailDao.get(id);
  }

  /**
   * 修改 物流信息
   * @param {string} storeId 店铺id
   * @param {string} orderId 订单id 也是 OrderTrack 的 id
   * @param {OrderTrackUpdateApiForm} updateForm 表单
   * @returns {Promise<boolean>}
   */
  public updateOrderTrack(storeId: string, orderId: string, updateForm: OrderTrackUpdateApiForm): Promise<boolean> {
    let id: string = storeId + "/" + orderId;
    return this.orderDetailDao.updateWithId(id, updateForm);
  }

  /**
   * 修改 物流信息 状态
   * @param {string} storeId 店铺id
   * @param {string} orderId 订单id 也是 OrderTrack 的 id
   * @param {OrderTrackUpdateStatusForm} updateStatusForm 修改状态表单
   * @returns {Promise<boolean>}
   */
  public updateOrderTrackStatus(storeId: string, orderId: string, updateStatusForm: OrderTrackUpdateStatusForm): Promise<boolean> {
    let updateForm: OrderTrackUpdateApiForm = new OrderTrackUpdateApiForm();
    updateForm.updateType = OrderTrackUpdateType.UpdateStatus;
    updateForm.trackUpdateStatusForm = updateStatusForm;
    return this.updateOrderTrack(storeId, orderId, updateForm);
  }
}

export class OrderTrackDao extends AsyncRestDao<OrderTrack> {

  constructor(restProxy: AsyncRestProxy) {
    var table = "orderTrack";
    super(OrderTrack, restProxy, table);
  }

  getService() {
    return AppCfg.getInstance().getServiceAddress();
  }

}
