/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/8/3
 */
import {MemberConsumptionData} from "./MemberConsumptionData";
import {DayData} from "./DayData";
import {LeaguerOriginData} from "./LeaguerOriginData";

export class MemberStatisticsData {

  //会员总数数
  totalMembershipCount: number;

  //同期新增人数
  newMembershipCount;

  //指定时间内的会员消费次数
  totalConsumptionTimes;

  //指定时间内散客消费次数
  outSiderConsumptionTimes;

  //消费排行
  consumptionList: Array<MemberConsumptionData>;
  //时间段内的每日数据统计
  dayDataList: Array<DayData>;

  leaguerOriginDatas: Array<LeaguerOriginData>;


  /**
   * 时间段内每日新增会员数据统计 包括消费金额、消费次数
   * 新增会员消费统计 amount
   * 新增会员消费频次 count
   */
  newMemberCostDataList: Array<DayData>;

  //新增会员频次
  newMemberAddDataList: Array<DayData>;

  constructor() {
  }

}
