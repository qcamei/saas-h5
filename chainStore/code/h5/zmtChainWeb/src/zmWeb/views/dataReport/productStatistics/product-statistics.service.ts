
import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {ProductStatisticsData} from "../../../bsModule/dataReport/apiData/ProductStatisticsData";
import {ProductStatisticsMgr} from "../../../bsModule/dataReport/productStatistics/ProductStatisticsMgr";

export class ProductStatisticsService {


  constructor(private productStatisticsMgr:ProductStatisticsMgr ){

  }


  public async findProductStatistics(queryForm:DataReportQueryForm , laodingViewData:(success:ProductStatisticsData) =>void){

    let restResp = await this.productStatisticsMgr.findProductStatistics(queryForm);
    laodingViewData(restResp);

  }




}
