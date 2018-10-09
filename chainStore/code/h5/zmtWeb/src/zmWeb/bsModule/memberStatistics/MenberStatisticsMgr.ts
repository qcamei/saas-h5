import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ProductData} from "../productStatistics/apiData/ProductData";
import {AppCfg} from "../../comModule/AppCfg";
import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {MemberStatisticsData} from "../dataReport/apiData/MemberStatisticsData";

@Injectable()
export class MenberStatisticsMgr {

  private memberStatisticsDao:MemberStatisticsDao;
  constructor(restProxy: AsyncRestProxy){

    this.memberStatisticsDao = new MemberStatisticsDao(restProxy);


  }


  public findMemberStatistics(startTime:string,endTime:string,storeId:string):Promise<MemberStatisticsData>{

    let uriPath = "findMenberStatisticsData";
    let reqMap = new ReqMap().add("storeId",storeId);
        reqMap.add("startTime",startTime);
        reqMap.add("endTime",endTime);
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
