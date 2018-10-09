import {ProductStatisticsMgr} from "../../../bsModule/productStatistics/ProductStatisticsMgr";
import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {ProductStatisticsData} from "../../../bsModule/dataReport/apiData/ProductStatisticsData";

export class ProductStatisticsService {


  constructor(private productStatisticsMgr:ProductStatisticsMgr ){

  }


  public async findProductStatistics(queryForm:DataReportQueryForm , laodingViewData:(success:ProductStatisticsData) =>void){

    let restResp = await this.productStatisticsMgr.findProductStatistics(queryForm);
    laodingViewData(restResp);

  }




}
