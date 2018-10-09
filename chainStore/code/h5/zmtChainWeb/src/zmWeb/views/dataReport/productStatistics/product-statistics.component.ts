import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {ProductStatisticsService} from "./product-statistics.service";
import {ProductStatisticsViewData} from "./product-statistics.viewData";

import {AppUtils} from "../../../comModule/AppUtils";
import {ProductStatisticsMgr} from "../../../bsModule/dataReport/productStatistics/ProductStatisticsMgr";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {ChainViewDataMgr} from "../../chain/ChainViewDataMgr";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {StoreListViewData} from "../../chain/storeList/storeList";
import {ShopModelComponent} from "../shopModel/shop-model.component";
import {StoreCacheUtils} from "../StoreCacheUtils";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";

@Component({
  selector: 'product-statistics',
  templateUrl: './product-statistics.component.html',
  styleUrls: ['./product-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ProductStatisticsComponent implements OnInit {

  public viewData: ProductStatisticsViewData = ProductStatisticsViewData.newInstance();


  private productDataService: ProductStatisticsService;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private productStatisticsMgr: ProductStatisticsMgr,
              private storeConfigMgr:StoreConfigMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.productDataService = new ProductStatisticsService(this.productStatisticsMgr);

  }

// teb切换
  // 热销
  hotSell(index) {
    this.viewData.salesTabIndex = index;
    //热销排行
    this.viewData.buildSalesData(1);
  }

  // 滞销
  dullSell(index) {

    this.viewData.unsalesTabIndex = index;
    this.viewData.buildUnSalesData(1);
  }

  pieSell(index) {
    this.viewData.pieTabIndex = index;
    this.viewData.buildPieData();

  }

  // 昨日今日
  chooseTime(index) {
    switch (index) {
      case 0:
        this.setTodayTime();
        break;
      case 1:
        this.setYesterdayTime();
        break;
      case 2:
        this.setCurrMonthTime();
        break;
      case 3:
        this.setLastMonthTime();
        break;
    }
    this.buildDateQueryForm();
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
  setCurrMonthTime() {
    let nowDate = new Date();
    this.viewData.minTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: 1};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: nowDate.getDate()};
  }

  /**
   * 页面点击事件 上月
   */
  setLastMonthTime() {
    let date = new Date();
    let day = date.getDate();
    let lastMonthTime = date.getTime() - 1000 * 60 * 60 * 24 * day;
    let lastMonthDate = new Date(lastMonthTime);
    this.viewData.minTime = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: 1};
    this.viewData.maxTime = {
      year: lastMonthDate.getFullYear(),
      month: lastMonthDate.getMonth() + 1,
      day: lastMonthDate.getDate()
    };
  }

  buildDateQueryForm() {
    let minTime = [this.viewData.minTime.year, this.viewData.minTime.month, this.viewData.minTime.day];
    let maxTime = [this.viewData.maxTime.year, this.viewData.maxTime.month, this.viewData.maxTime.day];
    let minDate = new Date(minTime.join("/") + " 00:00:00");
    let maxDate = new Date(maxTime.join("/") + " 23:59:59");
    this.viewData.queryForm.minTime = minDate.getTime().toString();
    this.viewData.queryForm.maxTime = maxDate.getTime().toString();
    this.calculateDuration(minDate);
    if (minDate.getTime() > maxDate.getTime()) {
      AppUtils.showWarn("提示", "开始时间必须大于结束时间！");
      return;
    }
    this.getStoreCacheUtils().getStoreListViewData((storeListViewData: StoreListViewData) => {
      this.initStoreIds(storeListViewData);
      this.getProductData();
    });
  }


  private calculateDuration(minDate) {
    let nowDate = new Date();
    let nowTime = nowDate.getTime();
    if (nowTime <= minDate.getTime()) {
      this.viewData.unsalseDuration = 0;
    } else {
      let duration = nowTime - minDate.getTime();
      let durationDay: number = duration / (24 * 60 * 60 * 1000);
      this.viewData.unsalseDuration = Math.round(durationDay);
    }
  }

  getMonthData() {

    let data = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    return data.getDate();

  }

  ngOnInit() {
    this.setTime();
    this.buildDateQueryForm();
  }

  async getProductData() {
    if (AppUtils.isNullOrWhiteSpace(this.viewData.queryForm.storeIds)) {
      return;
    }
    await this.productDataService.findProductStatistics(this.viewData.queryForm, success => {
      if (success) {
        this.viewData.productStatisticsData = success;
        this.viewData.buildViewData();
        this.cdRef.markForCheck();

      } else {
        AppUtils.showError("提示", "获取报表失败，清稍后重试！")
      }

      this.viewData.loadingFinish = true;

    });
    this.cdRef.markForCheck();
  }


// 选择日期方法
  findConsumeByTime() {
    this.buildDateQueryForm();
  }

  /**
   * 热销排行榜分页
   * @param pageNo
   */
  getHotPageData(pageNo) {
    this.viewData.buildSalesData(pageNo);

  }

  /**
   * 滞销排行榜分页
   * @param pageNo
   */
  getUnSalesPageData(pageNo) {
    this.viewData.buildUnSalesData(pageNo);
  }


  getStoreCacheUtils(): StoreCacheUtils {
    return StoreCacheUtils.getInstance(this.chainViewDataMgr, this.chainMgr, this.chainSynDataHolder, this.storeMgr,this.storeConfigMgr);
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
        this.getProductData();
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

}
