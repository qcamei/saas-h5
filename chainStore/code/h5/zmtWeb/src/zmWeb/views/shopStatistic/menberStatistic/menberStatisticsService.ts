import {MenberStatisticsMgr} from "../../../bsModule/memberStatistics/MenberStatisticsMgr";
import {ProductData} from "../../../bsModule/productStatistics/apiData/ProductData";
import {MemberStatisticsData} from "../../../bsModule/memberStatistics/data/MemberStatisticsData";
import {RestResp} from "../../../comModule/RestResp";

export class MenberStatisticsService {

  constructor(private memberStatisticsMgr:MenberStatisticsMgr,){

  }

  public async memberStatistics(startTime:string,endTime:string,storeId:string ,laodingViewData:(success:MemberStatisticsData) =>void){

  let memberStatistics = await this.memberStatisticsMgr.findMemberStatistics(startTime,endTime,storeId);


  // laodingViewData(memberStatistics);

  }


}
