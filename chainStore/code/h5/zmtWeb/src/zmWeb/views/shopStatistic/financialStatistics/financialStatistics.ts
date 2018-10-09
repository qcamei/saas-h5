import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FinancialStatisticsViewData} from "./financialStatisticsViewData";
import {DataReportMgr} from "../../../bsModule/dataReport/DataReportMgr";
import {FinanceReport} from "../../../bsModule/dataReport/apiData/FinanceReport";
import {AppUtils} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CurrentStore, StoreData, UserData} from "../../../comModule/session/SessionData";


@Component({
  selector: 'undefined-financialStatistics',
  templateUrl: './financialStatistics.html',
  styleUrls: ['./financialStatistics.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FinancialStatisticsPage implements OnInit {
// 模拟数据
  viewData: FinancialStatisticsViewData;

  constructor(private dataReportMgr: DataReportMgr, private cdRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
    this.viewData = FinancialStatisticsViewData.newInstance();
  }


  public isTab: boolean = false;

  // 昨日今日
  chooseTime(index) {

    switch (index) {
      case 0:
        this.viewData.buildTodayQueryForm();
        break;
      case 1:
        this.viewData.buildYesterdayQueryForm();
        break;
      case 2:
        this.viewData.buildCurrMonthQueryForm();
        break;
      case 3:
        this.viewData.buildLastMonthQueryForm();
        break;
    }
    this.buildDateQueryForm();
  }


// 选择日期方法
  findConsumeByTime() {
    this.buildDateQueryForm();
  }


  ngOnInit() {
    // console.log("ngOnInit.storeId:" + this.viewData.storeId);
    this.buildDateQueryForm();
  }


  getFinancesDataReport(): void {
    this.viewData.log();
    this.buildData(viewDataN => {
      this.viewData.loadingFinish = true;
      this.viewData.buildViewData();
      this.cdRef.markForCheck();
    });
  }


  buildDateQueryForm() {
    let minTime = [this.viewData.minTime.year, this.viewData.minTime.month, this.viewData.minTime.day];
    let maxTime = [this.viewData.maxTime.year, this.viewData.maxTime.month, this.viewData.maxTime.day];
    let minDate = new Date(minTime.join("/") + " 00:00:00");
    let maxDate = new Date(maxTime.join("/") + " 23:59:59");
    this.viewData.queryForm.minTime = minDate.getTime().toString();
    this.viewData.queryForm.maxTime = maxDate.getTime().toString();
    if (this.viewData.storeId) {
      this.viewData.queryForm.storeId = this.viewData.storeId;
    }
    if (minDate.getTime() > maxDate.getTime()) {
      AppUtils.showWarn("提示", "开始时间必须大于结束时间！")
    } else {
      this.getFinancesDataReport();
    }
  }

  public async buildData(callback: (viewDataN: FinancialStatisticsViewData) => void) {
    // this.buildDateQueryForm();
    let financeReport: FinanceReport = await this.dataReportMgr.getFinanceReport(this.viewData.queryForm);
    this.viewData.financeReport = financeReport;
    if (financeReport) {

      callback(this.viewData);
    } else {
      AppUtils.showError("提示", "获取报表失败");
    }
  }

  public getRate(a: any, b: any): any {
    if (b == 0)
      return 0;
    return a / b * 100;
  }

}

