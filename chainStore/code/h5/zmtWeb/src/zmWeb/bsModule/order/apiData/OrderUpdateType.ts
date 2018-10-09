export enum OrderUpdateType {
  UpdateInfo=0,//("修改订单基本信息")
  UpdateState=1,//("修改订单状态")
  UpdateMaterial=2,//("修改订单耗材信息")
  UpdatePayItem=3,//("支付订单"),
  DeleteOrder=4,//("删除订单"),
  UpdateChargeBackCost=5,//("更新订单退款金额"),
  PayOrderWithNote=6,//("支付订单,添加订单备注"),
}
