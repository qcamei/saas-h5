import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {MemberStatisticsViewData} from "./member-statistics.viewData";
import {MemberStatisticsData} from "../../../bsModule/dataReport/apiData/MemberStatisticsData";
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../../common/Util/Constants";
import {MemberStatisticsMgr} from "../../../bsModule/dataReport/memberStatistics/MemberStatisticsMgr";
import {ChainViewDataMgr} from "../../chain/ChainViewDataMgr";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {StoreCacheUtils} from "../StoreCacheUtils";
import {StoreListViewData} from "../../chain/storeList/storeList";
import {ShopModelComponent} from "../shopModel/shop-model.component";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";

@Component({
  selector: 'member-statistics',
  templateUrl: './member-statistics.component.html',
  styleUrls: ['./member-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberStatisticsComponent implements OnInit {

  viewData: MemberStatisticsViewData;
  loadingFinish: boolean = false;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private memberStatisticsMgr: MemberStatisticsMgr,
              private storeConfigMgr: StoreConfigMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.viewData = MemberStatisticsViewData.newInstance();
  }

  ngOnInit() {
    this.setTime();
    this.laodViewData();
  }

  async laodViewData() {

    this.getStoreCacheUtils().getStoreListViewData((storeListViewData: StoreListViewData) => {
      if (!AppUtils.isNullObj(storeListViewData)) {
        this.initStoreIds(storeListViewData);
        this.getMemberDataReport();
      }
    });

  }


  private initStoreIds(storeListViewData: StoreListViewData) {
    if (AppUtils.isNullObj(this.viewData.storeListViewData)) {
      this.viewData.storeListViewData = storeListViewData;
      let storeIdArr: Array<string> = [];
      storeListViewData.storeList.map((storeVD: StoreVD) => {
        if (!storeVD.isChain && storeVD.dataPermission)
          storeIdArr.push(storeVD.id);
      });
      this.viewData.queryForm.storeIds = storeIdArr.join(",");
    }
  }


  changePageTab(tabIndex: any) {
    this.viewData.pageTabIndex = tabIndex.index;
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


  getStoreCacheUtils(): StoreCacheUtils {
    return StoreCacheUtils.getInstance(this.chainViewDataMgr, this.chainMgr, this.chainSynDataHolder, this.storeMgr, this.storeConfigMgr);
  }


  selectCustomer($event) {
    if (AppUtils.isNullObj(this.viewData.storeListViewData)) {
      this.getStoreCacheUtils().getStoreListViewData((storeListViewData: StoreListViewData) => {
        this.initStoreIds(storeListViewData);
        this.showStoreDialog();
      });
    } else {
      this.showStoreDialog();
    }
  }

  private showStoreDialog() {
    let modalData = {
      storeList: this.viewData.storeListViewData.storeList.filter(storeVD => {
        return !storeVD.isChain;
      })
    };
    ZmModalMgr.getInstance().newModal(ShopModelComponent, modalData, (storeListTmp: Array<StoreVD>) => {
      if (!AppUtils.isNullObj(storeListTmp) && storeListTmp.length > 0) {
        let storeIds: Array<string> = [];
        storeListTmp.map((storeVD: StoreVD) => {
          storeIds.push(storeVD.id);
        });
        this.viewData.queryForm.storeIds = storeIds.join(",");
        this.getMemberDataReport();
      }


    });
  }


  private async getMemberDataReport() {
    if (AppUtils.isNullOrWhiteSpace(this.viewData.queryForm.storeIds)) {
      return;
    }
    let minArrTmp = [this.viewData.minTime.year, this.viewData.minTime.month, this.viewData.minTime.day];
    let minDate = new Date(minArrTmp.join("/") + " 00:00:00");
    let maxArrTmp = [this.viewData.maxTime.year, this.viewData.maxTime.month, this.viewData.maxTime.day];
    let maxDate = new Date(maxArrTmp.join("/") + " 23:59:59");
    let target: MemberStatisticsData = await this.memberStatisticsMgr.findMemberStatistics(minDate.getTime().toString(), maxDate.getTime().toString(), this.viewData.queryForm.storeIds);
    if (target) {
      this.viewData.memberStatisticsData = target;
      this.viewData.consumptionList = target.consumptionList;

      this.viewData.totalPage = AppUtils.getTotalPage(this.viewData.consumptionList.length, Constants.DEFAULT_PAGEITEMCOUNT);
      this.viewData.setCurrConsumptionList(AppUtils.getPageItemList(this.viewData.consumptionList, 1, Constants.DEFAULT_PAGEITEMCOUNT));
      this.viewData.buildOptions();
      this.loadingFinish = true;
      this.cdRef.markForCheck();
    }
  }


}
