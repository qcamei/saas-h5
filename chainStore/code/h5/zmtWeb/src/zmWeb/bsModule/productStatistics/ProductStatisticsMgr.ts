import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {BUser} from "../buser/apiData/BUser";
import {AppCfg} from "../../comModule/AppCfg";
import {ReqMap, ZmMap} from "../../comModule/AppUtils";
import {ProductData} from "./apiData/ProductData";
import {Injectable} from '@angular/core';
import {RankingOptionsData} from "./apiData/RankingOptionsData";
import {ProductStatisticsData} from "../dataReport/apiData/ProductStatisticsData";
import {DataReportQueryForm} from "../dataReport/apiData/DataReportQueryForm";

@Injectable()
export class ProductStatisticsMgr {

  private productStatisticsDao:ProductStatisticsDao;

  constructor(restProxy: AsyncRestProxy){
    this.productStatisticsDao = new ProductStatisticsDao(restProxy);

  }

  public findProductStatistics(queryForm:DataReportQueryForm):Promise<ProductStatisticsData>{

    let uriPath = "findProductStatistics";
    let reqMap = new ReqMap();
    reqMap.add("storeId",queryForm.storeId);
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

