/**
 * 商城订单 物流状态 枚举
 */
export enum OrderTrackStatusEnum {
  New,//待付款
  Pay,//待发货
  Send,//已发货
  Finish,//已完成
  Cancel,//已取消
}
