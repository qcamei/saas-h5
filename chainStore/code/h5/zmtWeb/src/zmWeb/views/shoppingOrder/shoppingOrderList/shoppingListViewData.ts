import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {MgrPool} from "../../../comModule/MgrPool";
import {MallOrder} from "../../../bsModule/order/data/MallOrder";

export class ShoppingOrderListViewData {

  mallOrders: Array<MallOrder> = new Array<MallOrder>();
  curPage: number = 1;//页号
  searchKey: string = null;//搜索字段
  /**
   * 商城订单 物流状态 枚举
   * @link{src/zmWeb/bsModule/order/data/OrderTrackStatusEnum.ts}
   */
  trackStatus: number = -1;
  loadingFinish: boolean = false;
  recordCount: number;//分页条数
  timeSlot: TimeSlot = new TimeSlot(0,0);//时间段
  itemActiveIndex: number = 0;//时间段默认选中的下标


  public static getInstance(): ShoppingOrderListViewData {
    return MgrPool.getInstance().get("ShoppingOrderListViewData", ShoppingOrderListViewData);
  }
}
