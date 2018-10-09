import {MemberDataCount} from "../../../bsModule/dataReport/data/member-data-count";
import {AppUtils} from "../../../comModule/AppUtils";
import {ManageItem} from "../../zmBSComp/zmb/manage/itemInGroup/ManageItem";

/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/25
 */
export class DataReportMainViewData {

  memberDataCount: MemberDataCount;
  itemGroup: Array<ManageItem>;

  public static newInstance(): DataReportMainViewData {
    let newInstance: DataReportMainViewData = new DataReportMainViewData();
    newInstance.itemGroup = [];
    let cusItem = ManageItem.newItem("客户统计", "assets/icon/appointment.svg", 0, "customerStatistic");
    let salesItem = ManageItem.newItem("销售统计", "assets/icon/appointment.svg", 0, "");
    let settleItem = ManageItem.newItem("结算统计", "assets/icon/appointment.svg", 0, "");
    newInstance.itemGroup.push(cusItem);
    newInstance.itemGroup.push(salesItem);
    newInstance.itemGroup.push(settleItem);
    return newInstance;
  }


  constructor() {

  }

  get memberCount(): number {
    if (AppUtils.isNullObj(this.memberDataCount)) {
      return 0;
    } else {
      return this.memberDataCount.memberCount;
    }
  }

  get orderCost(): number {
    if (AppUtils.isNullObj(this.memberDataCount)) {
      return 0;
    } else {
      return this.memberDataCount.orderCost;
    }
  }

}
