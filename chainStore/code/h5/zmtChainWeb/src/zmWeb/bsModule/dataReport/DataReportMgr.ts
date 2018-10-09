import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {MemberDataCount} from "./apiData/MemberDataCount";
import {ReqMap} from "../../comModule/AppUtils";
import {DataReport} from "./apiData/DataReport";
import {DataReportQueryForm} from "./apiData/DataReportQueryForm";
import {AppCfg} from "../../comModule/AppCfg";
import {FinanceReport} from "./apiData/FinanceReport";
import {TradingFlow} from "./apiData/TradingFlow";
import {TradingFlowReportQueryForm} from "./apiData/TradingFlowReportQueryForm";
import {PageResp} from "../../comModule/PageResp";

@Injectable()
export class DataReportMgr {
  private memberDataCountDao: MemberDataCountDao;
  private dataReportDao: DataReportDao;
  private financeReportDao: FinanceReportDao;
  private tradingFlowReportDao: TradingFlowReportDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.memberDataCountDao = new MemberDataCountDao(restProxy);
    this.dataReportDao = new DataReportDao(restProxy);
    this.financeReportDao = new FinanceReportDao(restProxy);
    this.tradingFlowReportDao = new TradingFlowReportDao(restProxy);
  }

  /**
   * 查询店铺总会员数与总订单数
   * @param {string} storeIds
   * @returns {Promise<MemberDataCount>}
   */
  public getMemberDataCount(storeIds: string): Promise<MemberDataCount> {
    let findPath = "getMemberDataCount";
    let reqMap = new ReqMap();
    reqMap.add("storeIds", storeIds);
    return this.memberDataCountDao.findOneWithReqParam(findPath, reqMap);
  }

  /**
   * 根据条件查询销售统计数据
   * @param {DataReportQueryForm} queryForm
   * @returns {Promise<Array<DataReport>>}
   */
  public findDataReprotList(queryForm: DataReportQueryForm): Promise<Array<DataReport>> {
    let findPath = "findDataReprotList";
    let pageItemCount = 100000;
    let pageNo = 1;
    let reqMap = new ReqMap()
      .add("storeIds", queryForm.storeIds)
      .add("maxTime", queryForm.maxTime)
      .add("minTime", queryForm.minTime);
    return this.dataReportDao.findListWithReqParam(findPath, reqMap, pageItemCount, pageNo);
  }

  /**
   * 根据条件查询财务统计数据
   * @param {DataReportQueryForm} queryForm
   * @returns {Promise<FinanceReport>}
   */
  public getFinanceReport(queryForm: DataReportQueryForm): Promise<Array<FinanceReport>> {
    let findPath = "getChainFinancialStatics";
    let pageItemCount = 100000;
    let pageNo = 1;
    let reqMap = new ReqMap()
      .add("storeIds", queryForm.storeIds)
      .add("maxTime", queryForm.maxTime)
      .add("minTime", queryForm.minTime);
    return this.financeReportDao.findListWithReqParam(findPath, reqMap,pageItemCount,pageNo);
  }
  /**
   * 根据条件查询交易流水统计数据
   * @param {TradingFlowReportQueryForm} queryForm
   * @returns {Promise<FinanceReport>}
   */
  public getTradingFlow(queryForm: TradingFlowReportQueryForm): Promise<PageResp> {
    let findPath = "getChainTradingFlowReport";
    let reqMap = new ReqMap()
      .add("storeIds", queryForm.storeIds)
      .add("maxTime", queryForm.maxTime)
      .add("minTime", queryForm.minTime)
      .add("pageNo", queryForm.pageNo +"")
      .add("pageItemCount", queryForm.pageItemCount +"")
      .add("queryName",queryForm.queryName)
      .add("payType",queryForm.payType.join(","))
      .add("tradeType",queryForm.tradeType.join(","));
    return this.tradingFlowReportDao.findOneWithReqParam(findPath, reqMap);
  }
}


export class MemberDataCountDao extends AsyncRestDao<MemberDataCount> {
  constructor(restProxy: AsyncRestProxy) {
    let table = "dataReport";
    super(MemberDataCount, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

export class DataReportDao extends AsyncRestDao<DataReport> {
  constructor(restProxy: AsyncRestProxy) {
    let table = "dataReport";
    super(DataReport, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

/**
 * 财务统计
 */
export class FinanceReportDao extends AsyncRestDao<FinanceReport> {

  constructor(restProxy: AsyncRestProxy) {
    let table = "dataReport";
    super(FinanceReport, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

/**
 * 交易流水
 */
export class TradingFlowReportDao extends AsyncRestDao<PageResp> {

  constructor(restProxy: AsyncRestProxy) {
    let table = "dataReport";
    super(PageResp, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

