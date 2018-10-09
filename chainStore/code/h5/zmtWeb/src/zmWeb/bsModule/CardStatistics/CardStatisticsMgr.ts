import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {MemberStatisticsData} from "../memberStatistics/data/MemberStatisticsData";
import {AppCfg} from "../../comModule/AppCfg";
import {CardStatisticsData} from "./Data/CardStatisticsData";
import {ReqMap} from "../../comModule/AppUtils";
import {Injectable} from '@angular/core';

@Injectable()
export class CardStatisticsMgr {


  private cardStatisticsDao:CardStatisticsDao;
  constructor(restProxy: AsyncRestProxy){

    this.cardStatisticsDao = new CardStatisticsDao(restProxy);

  }

  public findCardStatistics(storeId:string):Promise<CardStatisticsData>{

    let uriPath = "findCardStatisticsData";
    let reqMap = new ReqMap().add("storeId",storeId);
    return this.cardStatisticsDao.findOneWithReqParam(uriPath,reqMap);

  }



}

class CardStatisticsDao extends AsyncRestDao<CardStatisticsData> {

  constructor(restProxy: AsyncRestProxy) {

    var table: string = "dataReport";
    super(CardStatisticsData, restProxy, table);

  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
