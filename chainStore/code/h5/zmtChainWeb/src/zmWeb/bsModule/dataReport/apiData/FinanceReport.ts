/**
 *财务统计对象
 */
import {PayItemDetail} from "./PayItemDetail";
import {DayData} from "./DayData";

export class FinanceReport {
  storeId: string;
  /**
   * 时间范围
   */
  minTime: number = 0;//开始时间
  maxTime: number = 0;//结束时间

  operatingIncome: number = 0;//营业收入
  operatingExpenses: number = 0;//营业支出
  cardSalesAmount: number = 0;//售卡金额
  // productCardAmount:string;//耗卡金额 //此处需求改动 直接显示 会员卡支付金额 + 划卡次数
  chargeBackAmount: number = 0;//退单金额

  rechargeAmount: number = 0;//充值金额
  donationAmount: number = 0;//充值赠送金额
  memberCardPayAmount: number = 0;//会员卡支付金额

  saleProductCardCount: number = 0;//次卡售出数量
  delimitCardCount: number = 0;//划卡次数

  payItemDetails: Array<PayItemDetail> = [];//营业收入（支付排序）
  dayDataList: Array<DayData> = [];//时间段内的每日数据统计


  public add(target: FinanceReport) {
    this.operatingIncome = parseFloat(this.operatingIncome + "") + parseFloat(target.operatingIncome + "");
    this.operatingExpenses = parseFloat(this.operatingExpenses + "") + parseFloat(target.operatingExpenses + "");
    this.cardSalesAmount = parseFloat(this.cardSalesAmount + "") + parseFloat(target.cardSalesAmount + "");
    this.chargeBackAmount = parseFloat(this.chargeBackAmount + "") + parseFloat(target.chargeBackAmount + "");
    this.rechargeAmount = parseFloat(this.rechargeAmount + "") + parseFloat(target.rechargeAmount + "");
    this.donationAmount = parseFloat(this.donationAmount + "") + parseFloat(target.donationAmount + "");
    this.memberCardPayAmount = parseFloat(this.memberCardPayAmount + "") + parseFloat(target.memberCardPayAmount + "");
    this.saleProductCardCount = parseFloat(this.saleProductCardCount + "") + parseFloat(target.saleProductCardCount + "");
    this.delimitCardCount = parseFloat(this.delimitCardCount + "") + parseFloat(target.delimitCardCount + "");
    if (this.payItemDetails.length == 0) {
      this.payItemDetails = target.payItemDetails;
    } else {
      if (this.payItemDetails.length == target.payItemDetails.length) {
        for (let i: number = 0; i < this.payItemDetails.length; i++) {
          let payItemSelf: PayItemDetail = this.payItemDetails[i];
          for (let j: number = 0; j < target.payItemDetails.length; j++) {
            let payItemTarget: PayItemDetail = target.payItemDetails[j];
            if (payItemSelf.payType == payItemTarget.payType) {
              payItemSelf.cost = parseFloat(payItemSelf.cost + "") + parseFloat(payItemTarget.cost + "");
              break;
            }
          }
        }
      }
    }

    if (this.dayDataList.length == 0) {
      this.dayDataList = target.dayDataList;
    } else {
      if (this.dayDataList.length == target.dayDataList.length) {
        for (let i: number = 0; i < this.dayDataList.length; i++) {
          let dayDataSelf: DayData = this.dayDataList[i];
          for (let j: number = 0; j < target.dayDataList.length; j++) {
            let dayDataTarget: DayData = target.dayDataList[j];
            if (dayDataSelf.timeStr == dayDataTarget.timeStr) {
              dayDataSelf.amount = parseFloat(dayDataSelf.amount + "") + parseFloat(dayDataTarget.amount + "");
              dayDataSelf.count = parseFloat(dayDataSelf.count + "") + parseFloat(dayDataTarget.count + "");
              break;
            }
          }
        }
      }
    }
  }

}

