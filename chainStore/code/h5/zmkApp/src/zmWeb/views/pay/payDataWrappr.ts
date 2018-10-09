import {Order} from "../../bsModule/order/data/Order";
import {PayResp} from "../../bsModule/pay/data/PayResp";
import {MgrPool} from "../../comModule/MgrPool";

export class PayDataWrappr {

  public static getInstance():PayDataWrappr{
    return MgrPool.getInstance().get("PayDataWrappr",PayDataWrappr);
  }

  private order:Order = new Order(); //订单信息
  private payResp: PayResp = new PayResp(); //支付二维码信息

  public clear(){
    this.order = new Order();
    this.payResp = new PayResp();
  }

  public setOrder(orderP:Order){
    this.order = orderP;
  }

  public getOrder():Order{
    return this.order;
  }

  public setPayResp(payRespP:PayResp){
    this.payResp = payRespP;
  }

  public getPayResp():PayResp{
    return this.payResp;
  }

}
