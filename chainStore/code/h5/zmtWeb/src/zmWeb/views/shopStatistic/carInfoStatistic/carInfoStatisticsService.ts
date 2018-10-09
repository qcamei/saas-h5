import {CardStatisticsMgr} from "../../../bsModule/CardStatistics/CardStatisticsMgr";
import {CardStatisticsData} from "../../../bsModule/CardStatistics/Data/CardStatisticsData";

export class CarInfoStatisticsService {

  constructor(private cardStatisticsMgr:CardStatisticsMgr,){

  }

  public async cardStatistics(storeId:string ,laodingViewData:(success:CardStatisticsData) =>void){

      let restResp = await this.cardStatisticsMgr.findCardStatistics(storeId);


      laodingViewData(restResp);

    }


  }
