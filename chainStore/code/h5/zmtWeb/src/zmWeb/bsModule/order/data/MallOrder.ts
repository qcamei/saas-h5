/**
 * 商城订单
 */
import {Order} from "./Order";

export class MallOrder{
  order: Order;//订单信息
  /**
   * 商城订单 物流状态 枚举
   * @link{src/zmWeb/bsModule/order/data/OrderTrackStatusEnum.ts}
   */
  trackStatus: number;
}
