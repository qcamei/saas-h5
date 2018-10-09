import {PayResp} from "../../../bsModule/pay/data/PayResp";
import {Order} from "../../../bsModule/order/data/Order";

export class PayQrcodeViewData {
   order:Order = new Order();
   payResp: PayResp = new PayResp(); //支付二维码信息
}

