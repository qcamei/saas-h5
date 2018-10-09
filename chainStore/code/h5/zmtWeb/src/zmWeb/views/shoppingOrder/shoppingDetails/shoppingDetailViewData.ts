import {MallOrder} from "../../../bsModule/order/data/MallOrder";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {OrderTrack} from "../../../bsModule/orderTrack/data/OrderTrack";

export class ShoppingDetailViewData {

  orderId: string;
  orderDetail: OrderDetail;//订单详情

  public static newInstance(): ShoppingDetailViewData {
    return new ShoppingDetailViewData();
  }
}
