import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {TransactionViewData} from "./TransactionViewData";
import {AppUtils} from "../../../comModule/AppUtils";
import {DataReportMgr} from "../../../bsModule/dataReport/DataReportMgr";
import {PageResp} from "../../../comModule/PageResp";
import {AppRouter} from "../../../comModule/AppRouter";

@Component({
  selector: 'undefined-transaction',
  templateUrl: './transaction.html',
  styleUrls: ['./transaction.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionPage implements OnInit {

  public viewData: TransactionViewData;
  public isActive: number = 0;

  constructor(private dataReportMgr: DataReportMgr, private cdRef: ChangeDetectorRef) {
    this.viewData = TransactionViewData.getInstance();
    console.log(this.viewData);
    console.log("constructor");
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.buildDateQueryForm();
  }


// 选择日期方法
  findConsumeByTime() {
    this.buildDateQueryForm();
  }


  buildDateQueryForm() {
    let minTime = [this.viewData.minTime.year, this.viewData.minTime.month, this.viewData.minTime.day];
    let maxTime = [this.viewData.maxTime.year, this.viewData.maxTime.month, this.viewData.maxTime.day];
    let minDate = new Date(minTime.join("/") + " 00:00:00");
    let maxDate = new Date(maxTime.join("/") + " 23:59:59");
    this.viewData.queryForm.minTime = minDate.getTime().toString();
    this.viewData.queryForm.maxTime = maxDate.getTime().toString();
    if (minDate.getTime() > maxDate.getTime()) {
      AppUtils.showWarn("提示", "开始时间必须大于结束时间！")
    } else {
      this.getTradingFlowReport();
    }
  }


  getTradingFlowReport(): void {
    this.buildData(viewDataN => {
      this.cdRef.markForCheck();
    });
  }


  public async buildData(callback: (viewDataN: TransactionViewData) => void) {
    let pageRest: PageResp = await this.dataReportMgr.getTradingFlow(this.viewData.queryForm);
    this.viewData.setPageResp(pageRest);
    this.viewData.recordCount = pageRest.totalCount;
    this.viewData.pageNo = pageRest.pageNo;
    this.viewData.pageSize = pageRest.pageItemCount;
    this.viewData.loadingFinish = true;
    if (pageRest) {
      callback(this.viewData);
    } else {
      AppUtils.showError("提示", "获取交易流水失败");
    }
  }


  // 昨日今日
  chooseTime(index) {
    this.viewData.chooseTime(index);
    this.buildDateQueryForm();
  }

  changePayType(index) {
    console.log("changePayType：" + index);
    this.isActive = 1;
    this.viewData.changePayType(index);
    this.getTradingFlowReport();
  }

  changeTradeType(index) {
    this.isActive = 2;
    this.viewData.changeTradeType(index);
    this.getTradingFlowReport();
  }


  getPageData(pageNo) {
    this.viewData.queryForm.pageNo = pageNo;
    this.getTradingFlowReport();
  }

  checkAll() {
    this.isActive = 0;
    this.viewData.queryForm.tradeType = [];
    this.viewData.queryForm.payType = [];
    this.viewData.payFilterItems = [];
    this.viewData.tradeFilterItems = [];
    this.refreshData();
  }

  private refreshData() {
    this.viewData.resetPage();
    this.getTradingFlowReport();
  }

  goOrderDetail(orderId) {
    AppRouter.goOrderConsumeDetail(orderId);
  }


  removeFilter(filterItem) {
    this.viewData.removeFilter(filterItem);
    this.refreshData();
  }
}
