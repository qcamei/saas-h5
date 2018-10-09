import {PayItemData} from "../../../zmComp/form/zmPay/PayItemData";
import {ConsumePayViewData} from "../consumePay";
import {RechargePayViewData} from "../rechargePay";
export class PayCompViewData{
  public orderId:string;//订单id

  public payList:Array<PayItemData>;//支付信息
  public remark:string;//备注信息

  public balance:number = 0;//会员卡余额

  public orderCost:number;//订单应结
  public orderPay:number = 0;//实际应收 可修改
  public restAmount:number = 0;//还需支付

  public static fromConsumePay(consumePayViewData:ConsumePayViewData):PayCompViewData{
    let payCompViewData = new PayCompViewData();
    payCompViewData.orderId = consumePayViewData.orderDetail.simpleOrderInfo.orderId;
    payCompViewData.payList = consumePayViewData.payList;
    payCompViewData.balance = consumePayViewData.balance;
    payCompViewData.orderCost = consumePayViewData.orderCost;
    payCompViewData.orderPay = consumePayViewData.orderPay;
    payCompViewData.restAmount = consumePayViewData.restAmount;
    return payCompViewData;
  }

  public static fromRechargePay(rechargePayViewData:RechargePayViewData):PayCompViewData{
    let payCompViewData = new PayCompViewData();
    payCompViewData.orderId = rechargePayViewData.orderDetail.simpleOrderInfo.orderId;
    payCompViewData.payList = rechargePayViewData.payList;
    payCompViewData.balance = rechargePayViewData.balance;
    payCompViewData.orderCost = rechargePayViewData.orderCost;
    payCompViewData.orderPay = rechargePayViewData.orderPay;
    payCompViewData.restAmount = rechargePayViewData.restAmount;
    return payCompViewData;
  }

}
