export class PayItem {
  payType:number;//PayTypeEnum
  cost:number;

  /***************************选择扫码线上支付*******************************/
  outTradeNo:string;//随机生成的订单号
  tradeNo:string;//交易成功的流水号

  createdTime:number;
  constructor(){}
}
