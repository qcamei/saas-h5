import {AsyncRestProxy} from "../../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../../comModule/AppCfg";
import {Injectable} from '@angular/core';
import {ReqMap} from "../../../comModule/AppUtils";
import {MemberStatisticsData} from "../apiData/MemberStatisticsData";

@Injectable()
export class MemberStatisticsMgr {

  private memberStatisticsDao:MemberStatisticsDao;
  constructor(restProxy: AsyncRestProxy){

    this.memberStatisticsDao = new MemberStatisticsDao(restProxy);


  }


  public findMemberStatistics(startTime:string,endTime:string,storeIds:string):Promise<MemberStatisticsData>{

    let uriPath = "getChainMemberStatisticsData";
    let reqMap = new ReqMap().add("storeIds",storeIds);
        reqMap.add("minTime",startTime);
        reqMap.add("maxTime",endTime);
    return this.memberStatisticsDao.findOneWithReqParam(uriPath,reqMap);
  }


}

class MemberStatisticsDao extends AsyncRestDao<MemberStatisticsData> {

  constructor(restProxy: AsyncRestProxy) {

    var table: string = "dataReport";
    super(MemberStatisticsData, restProxy, table);

  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
