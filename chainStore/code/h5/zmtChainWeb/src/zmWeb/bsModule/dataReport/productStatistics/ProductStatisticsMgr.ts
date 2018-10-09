import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../../comModule/asynDao/AsyncRestProxy";
import {ProductStatisticsData} from "../apiData/ProductStatisticsData";
import {DataReportQueryForm} from "../apiData/DataReportQueryForm";
import {ReqMap} from "../../../comModule/AppUtils";
import {AsyncRestDao} from "../../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../../comModule/AppCfg";


@Injectable()
export class ProductStatisticsMgr {

  private productStatisticsDao:ProductStatisticsDao;

  constructor(restProxy: AsyncRestProxy){
    this.productStatisticsDao = new ProductStatisticsDao(restProxy);

  }

  public findProductStatistics(queryForm:DataReportQueryForm):Promise<ProductStatisticsData>{

    let uriPath = "getChainProductStatistics";
    let reqMap = new ReqMap();
    reqMap.add("storeIds",queryForm.storeIds);
    reqMap.add("minTime",queryForm.minTime);
    reqMap.add("maxTime",queryForm.maxTime);
    return this.productStatisticsDao.findOneWithReqParam(uriPath,reqMap);
  }
}


class ProductStatisticsDao extends AsyncRestDao<ProductStatisticsData> {

  constructor(restProxy: AsyncRestProxy) {

    var table: string = "dataReport";
    super(ProductStatisticsData, restProxy, table);

  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

