import {ShoppingOrderViewDataMgr} from "../ShoppingOrderViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {OrderTrackMgr} from "../../../bsModule/orderTrack/OrderTrackMgr";
import {OrderTrackUpdateStatusForm} from "../../../bsModule/orderTrack/apiData/OrderTrackUpdateStatusForm";
import {ShoppingDetailViewData} from "./shoppingDetailViewData";
import {OrderTrack} from "../../../bsModule/orderTrack/data/OrderTrack";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";

export class ShoppingDetailService {

  constructor(private orderMgr: OrderMgr,
              private orderTrackMgr: OrderTrackMgr,
              private orderDetailMgr: OrderDetailMgr) {
  }

  /**
   * 获取物流信息
   * @param {string} storeId
   * @param {string} orderId
   * @returns {Promise<OrderTrack>}
   */
  public getOrderTrack(storeId: string, orderId: string): Promise<OrderTrack> {
   return new Promise(resolve => {
     this.orderTrackMgr.getOrderTrack(storeId, orderId).then(
        (orderTrack) => {
          resolve(orderTrack);
        }
      );
    });
  }

  /**
   * 获取订单详情
   * @param {string} orderId
   * @returns {Promise<OrderDetail>}
   */
  public getOrderDetail(orderId: string): Promise<OrderDetail> {
    return new Promise(resolve => {
      this.orderDetailMgr.getOrderDetail(orderId).then(
        (orderDetail) => {
          resolve(orderDetail);
        }
      );
    });
  }


  /**
   * 修改 物流信息 状态
   * @param {string} storeId 店铺id
   * @param {string} orderId 订单id 也是 OrderTrack 的 id
   * @param {OrderTrackUpdateStatusForm} updateStatusForm 修改状态表单
   * @returns {Promise<boolean>}
   */
  public updateOrderTrackStatus(storeId: string, orderId: string, updateStatusForm: OrderTrackUpdateStatusForm): Promise<boolean> {
    return new Promise(resolve => {
      this.orderTrackMgr.updateOrderTrackStatus(storeId, orderId, updateStatusForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  }

}
