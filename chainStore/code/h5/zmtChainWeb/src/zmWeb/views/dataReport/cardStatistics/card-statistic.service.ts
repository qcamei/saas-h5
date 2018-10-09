import {CardStatisticsMgr} from "../../../bsModule/dataReport/CardStatistics/CardStatisticsMgr";
import {CardStatisticsData} from "../../../bsModule/dataReport/CardStatistics/Data/CardStatisticsData";


export class CardStatisticService {

  constructor(private cardStatisticsMgr:CardStatisticsMgr){

  }

  public async cardStatistics(storeIds:string ,laodingViewData:(success:CardStatisticsData) =>void){

      let restResp = await this.cardStatisticsMgr.findCardStatistics(storeIds);


      laodingViewData(restResp);

    }


  }
