/**
 *财务统计对象
 */
import {PayItemDetail} from "./PayItemDetail";
import {DayData} from "./DayData";

export class FinanceReport {
  /**
   * 时间范围
   */
  minTime: number;//开始时间
  maxTime: number;//结束时间

  operatingIncome: string;//营业收入
  operatingExpenses: string;//营业支出
  cardSalesAmount: string;//售卡金额
   // productCardAmount:string;//耗卡金额 //此处需求改动 直接显示 会员卡支付金额 + 划卡次数
  chargeBackAmount: string;//退单金额

  rechargeAmount: string;//充值金额
  donationAmount: string;//充值赠送金额
  memberCardPayAmount: string;//会员卡支付金额

  saleProductCardCount: string;//次卡售出数量
  delimitCardCount: string;//划卡次数

  payItemDetails: Array<PayItemDetail>;//营业收入（支付排序）
  dayDataList: Array<DayData>;//时间段内的每日数据统计

}
