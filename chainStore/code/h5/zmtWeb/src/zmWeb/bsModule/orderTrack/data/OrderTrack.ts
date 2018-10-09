/**
 * 物流信息
 */
export class OrderTrack {
  id: number;
  // 店铺ID
  storeId: number;

  //OrderTrackTypeEnum
  type: number;

  //收货人
  receiver: string;
  //收货人号码
  phone: string;
  //收货地址
  address: string;

  // 下单时间
  createTime: number;
  // 付款时间
  payTime: number;
  // 发货时间
  deliverTime: number;
  // 确认时间
  confirmTime: number;
  // 物流状态 OrderTrackStatusEnum
  status: number;

  //快递公司
  company: string;
  //快递单号
  courierNum: string;

  lastUpdateTime: number;
  ver: number;
}
