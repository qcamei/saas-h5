/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/5
 */

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {StoreIncomeData, StoreStatisticsViewData} from "./store-statistics.viewData";
import {StoreStatisticsViewDataMgr} from "./store-statistics-view-data.mgr";
import {graphic} from 'echarts';
import {DataReportMgr} from "../../../bsModule/dataReport/DataReportMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {StoreListService, StoreListViewData} from "../../chain/storeList/storeList";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {ChainViewDataMgr} from "../../chain/ChainViewDataMgr";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {FinanceReport} from "../../../bsModule/dataReport/apiData/FinanceReport";
import {BarChartValue, GroupBarChartData} from "../../zmComp/charts/barChart/zm-group-bar-chart";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {StoreCacheUtils} from "../StoreCacheUtils";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";

@Component({
    templateUrl: 'store-statistics.component.html',
    styles: [`

    `],
    changeDetection: ChangeDetectionStrategy.OnPush
  }
)
export class StoreStatisticsComponent implements OnInit {
  options: {};
  timeSlotEnums: Array<TimeSlotEnum> = [TimeSlotEnum.TODAY, TimeSlotEnum.YESTERDAY, TimeSlotEnum.THIS_MONTH, TimeSlotEnum.LAST_MONTH];
  viewData: StoreStatisticsViewData;
  private service: StoreListService;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private dataReportMgr: DataReportMgr,
              private viewDataMgr: StoreStatisticsViewDataMgr,
              private storeConfigMgr: StoreConfigMgr,
              private cdRef: ChangeDetectorRef) {
    this.viewDataMgr.setStoreStatisticsViewData(StoreStatisticsViewData.getInstance());
    viewDataMgr.subscribeStoreStatisticsViewData((viewDataP => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    }));
    this.initStoreListService();
  }


  private initStoreListService() {
    this.service = new StoreListService(
      this.chainViewDataMgr,
      this.chainMgr,
      this.chainSynDataHolder,
      this.storeMgr,
    );
  }

  /**
   * 时间段选择组件回调
   * @param {TimeSlot} timeSlot
   */
  onTimeSlotCb(timeSlot: TimeSlot): void {
    if (AppUtils.isNullObj(this.viewData) || AppUtils.isNullObj(timeSlot)) return;
    this.viewData.queryForm.minTime = timeSlot.getMinTime().toString();
    this.viewData.queryForm.maxTime = timeSlot.getMaxTime().toString();
    this.prepareGetReport();
  }

  prepareGetReport() {
    this.viewData.loadingFinish = false;
    if (this.viewData.isNoLoadStoreList()) {
      this.getStoreCacheUtils().getStoreListViewData((storeListViewData: StoreListViewData) => {
        this.viewData.storeListViewData = storeListViewData;
        let storeIdArr: Array<string> = [];
        storeListViewData.storeList.map((storeVD: StoreVD) => {
          if (!storeVD.isChain && storeVD.dataPermission)
            storeIdArr.push(storeVD.id);
        });
        this.viewData.queryForm.storeIds = storeIdArr.join(",");
        this.getReport();
      });
    } else {
      this.getReport();
    }
  }

  async getReport() {
    if (AppUtils.isNullOrWhiteSpace(this.viewData.queryForm.storeIds)) {
      return;
    }
    let financeReportList: Array<FinanceReport> = await this.dataReportMgr.getFinanceReport(this.viewData.queryForm);

    let axisArray: Array<string> = [];
    let valueData: Array<BarChartValue> = [];
    let storeList: Array<StoreVD> = this.viewData.storeListViewData.storeList;
    let operatingIncomeValueData: Array<string> = [];//营业收入
    let cardSalesAmountValueData: Array<string> = [];//售卡金额
    let memberCardPayAmountValueData: Array<string> = [];//会员卡支付金额
    let chargeBackAmountValueData: Array<string> = [];//退单金额
    let storeIncomeDataArray: Array<StoreIncomeData> = [];

    // financeReportList.map(financeReport => {
    for (let n: number = 0; n < financeReportList.length; n++) {
      let financeReport: FinanceReport = financeReportList[n];
      let storeIncomeData: StoreIncomeData = new StoreIncomeData();
      storeIncomeData.position = n;
      storeIncomeData.storeId = financeReport.storeId;
      storeIncomeData.operatingIncome = financeReport.operatingIncome.toString();
      storeIncomeDataArray.push(storeIncomeData);
      for (let i: number = 0; i < storeList.length; i++) {
        let store: StoreVD = storeList[i];
        if (store.id == financeReport.storeId && !store.isChain) {
          axisArray.push(store.name);
          storeIncomeData.storeName = store.name;
          operatingIncomeValueData.push(financeReport.operatingIncome.toString());
          cardSalesAmountValueData.push(financeReport.cardSalesAmount.toString());
          memberCardPayAmountValueData.push(financeReport.memberCardPayAmount.toString());
          chargeBackAmountValueData.push(financeReport.chargeBackAmount.toString());
          break;
        }
      }
    }
    let operatingIncomeBbarChartValue: BarChartValue = new BarChartValue('营业收入', operatingIncomeValueData);
    let cardSalesAmountBarChartValue: BarChartValue = new BarChartValue('售卡金额', cardSalesAmountValueData);
    let memberCardPayAmountBarChartValue: BarChartValue = new BarChartValue('耗卡金额', memberCardPayAmountValueData);
    let chargeBackAmountBarChartValue: BarChartValue = new BarChartValue('退单金额', chargeBackAmountValueData);
    valueData.push(operatingIncomeBbarChartValue);
    valueData.push(cardSalesAmountBarChartValue);
    valueData.push(memberCardPayAmountBarChartValue);
    valueData.push(chargeBackAmountBarChartValue);


    let barChartData: GroupBarChartData = new GroupBarChartData(axisArray, valueData);
    this.viewData.barChartData = barChartData;
    this.viewData.storeIncomeDataArray = storeIncomeDataArray;
    this.viewData.currStoreIncomeDataArray = AppUtils.getPageData(this.viewData.curPage, storeIncomeDataArray);

    this.viewData.loadingFinish = false;
    this.cdRef.markForCheck();
  }

  getPageData($event) {


  }

  ngOnInit() {

  }


  getStoreCacheUtils(): StoreCacheUtils {
    return StoreCacheUtils.getInstance(this.chainViewDataMgr, this.chainMgr, this.chainSynDataHolder, this.storeMgr, this.storeConfigMgr);
  }

}
