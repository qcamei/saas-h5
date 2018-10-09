/**
 * @Description 会员消费记录统计 --会员消费排行榜
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/8/3
 */
export class MemberConsumptionData {
  position:number;
  //会员ID
  leagueId: string;

  //会员名字
  leagueName: string;

  leagueType: string;
  //总消费
  totalCost: number;

  constructor() {

  }
}
