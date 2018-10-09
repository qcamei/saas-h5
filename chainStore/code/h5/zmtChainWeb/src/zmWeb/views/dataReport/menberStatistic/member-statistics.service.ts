import {MemberStatisticsMgr} from "../../../bsModule/dataReport/memberStatistics/MemberStatisticsMgr";
import {MemberStatisticsData} from "../../../bsModule/dataReport/apiData/MemberStatisticsData";

export class MemberStatisticsService {

  constructor(private memberStatisticsMgr: MemberStatisticsMgr,) {

  }

  public async memberStatistics(startTime: string, endTime: string, storeId: string, laodingViewData: (success: MemberStatisticsData) => void) {

    let memberStatistics = await this.memberStatisticsMgr.findMemberStatistics(startTime, endTime, storeId);


    laodingViewData(memberStatistics);

  }


}
