export enum OrderStatusEnum {
  NOT_PAY = 0,//("未支付")
  HAS_PAY = 1,//("已支付")
  CANCEL = 2,//("已取消")
  CHARGEBACK_ALL = 3,//("已退单")
  CHARGEBACK_PART = 4,//("部分退单")
}
