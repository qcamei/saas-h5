export enum OrderStatusEnum {
  NOT_PAY = 0,//待付款
  HAS_PAY = 1,//已完成
  CANCEL = 2,
  CHARGEBACK_ALL = 3,//已退单
  CHARGEBACK_PART = 4,
}
