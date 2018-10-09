import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {MenberStatisticsMgr} from "../../../bsModule/memberStatistics/MenberStatisticsMgr";
import {MemberStatisticsViewData} from "./memberStatisticsViewData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MemberStatisticsData} from "../../../bsModule/dataReport/apiData/MemberStatisticsData";
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../../common/Util/Constants";

@Component({
  selector: 'undefined-menberStatistic',
  templateUrl: './menberStatistic.html',
  styleUrls: ['./menberStatistic.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenberStatisticPage implements OnInit {

  viewData: MemberStatisticsViewData;
  loadingFinish: boolean = false;

  constructor(private memberStatisticsMgr: MenberStatisticsMgr, private cdRef: ChangeDetectorRef) {
    this.viewData = MemberStatisticsViewData.newInstance();
  }

  ngOnInit() {
    this.setTime();
    this.laodViewData();
  }

  async laodViewData() {

    let storeId = SessionUtil.getInstance().getStoreId();
    let minArrTmp = [this.viewData.minTime.year, this.viewData.minTime.month, this.viewData.minTime.day];
    let minDate = new Date(minArrTmp.join("/") + " 00:00:00");
    let maxArrTmp = [this.viewData.maxTime.year, this.viewData.maxTime.month, this.viewData.maxTime.day];
    let maxDate = new Date(maxArrTmp.join("/") + " 23:59:59");

    let target: MemberStatisticsData = await this.memberStatisticsMgr.findMemberStatistics(minDate.getTime().toString(), maxDate.getTime().toString(), storeId);
    if (target) {
      this.viewData.memberStatisticsData = target;
      this.viewData.consumptionList = target.consumptionList;
      this.viewData.totalPage = AppUtils.getTotalPage( this.viewData.consumptionList.length, Constants.DEFAULT_PAGEITEMCOUNT);
      this.viewData.setCurrConsumptionList(AppUtils.getPageItemList(this.viewData.consumptionList , 1, Constants.DEFAULT_PAGEITEMCOUNT));
      this.viewData.buildOptions();
      this.loadingFinish = true;
      this.cdRef.markForCheck();
    }
  }


  changePageTab(tabIndex:any) {
    this.viewData.pageTabIndex = tabIndex.index;
    console.log( this.viewData.pageTabIndex);
    this.viewData.buildOptions();
    this.cdRef.markForCheck();
  }


  getPageData(pageNo) {
    this.viewData.curPage = pageNo;
    this.viewData.setCurrConsumptionList(AppUtils.getPageItemList(this.viewData.consumptionList, pageNo, Constants.DEFAULT_PAGEITEMCOUNT));
  }

// 昨日今日
  chooseTime(e) {
      this.viewData.itemActiveIndex = e;
    switch (e) {
      case 0:
        this.setTodayTime();
        break;
      case 1:
        this.setYesterdayTime();
        break;
      case 2:
        this.setToMonthTime();
        break;
      case 3:
        this.setYesterMonthTime();
        break;
    }
    this.laodViewData();
  }

  /**
   * 页面点击事件 今天
   */
  setTodayTime() {
    let date = new Date();
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};

  }

  /**
   * 页面点击事件 昨日
   */
  setYesterdayTime() {
    let nowDate = new Date();
    let yesterdayTime = nowDate.getTime() - 1000 * 60 * 60 * 24;
    let date = new Date(yesterdayTime);
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: date.getDate()};
  }


  setTime() {
    let nowDate = new Date();
    this.viewData.minTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: 1};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: nowDate.getDate()};
  }

  /**
   * 页面点击事件 本月
   */
  setToMonthTime() {
    let nowDate = new Date();
    this.viewData.minTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: 1};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: nowDate.getDate()};
  }

  /**
   * 页面点击事件 上月
   */
  setYesterMonthTime() {
    let date = new Date();
    let day = date.getDate();
    let lastMonthTime = date.getTime() - 1000 * 60 * 60 * 24 * day;
    let lastMonthDate = new Date(lastMonthTime);

    this.viewData.maxTime = {
      year: lastMonthDate.getFullYear(),
      month: lastMonthDate.getMonth() + 1,
      day: lastMonthDate.getDate()
    };
    this.viewData.minTime = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: 1};
  }


// 选择日期方法
  findConsumeByTime() {
    this.laodViewData();
  }


}
