import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {TransactionViewData} from "./TransactionViewData";
import {AppUtils} from "../../../comModule/AppUtils";
import {DataReportMgr} from "../../../bsModule/dataReport/DataReportMgr";
import {PageResp} from "../../../comModule/PageResp";
import {StoreListViewData} from "../../chain/storeList/storeList";
import {ShopModelComponent} from "../shopModel/shop-model.component";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {StoreCacheUtils} from "../StoreCacheUtils";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {ChainViewDataMgr} from "../../chain/ChainViewDataMgr";
import {MatDialog} from "@angular/material";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";

@Component({
  selector: 'transaction-flow',
  templateUrl: './transaction-flow.component.html',
  styleUrls: ['./transaction-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionFlowComponent implements OnInit {

  public viewData: TransactionViewData;
  public isActive: number = 0;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private dataReportMgr: DataReportMgr,
              private storeConfigMgr: StoreConfigMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.viewData = TransactionViewData.newInstance();
  }

  ngOnInit() {
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

    this.getStoreCacheUtils().getStoreListViewData((storeListViewData: StoreListViewData) => {
      this.initStoreIds(storeListViewData);
      this.buildData(viewDataN => {
        this.cdRef.markForCheck();
      });
    });
  }


  public async buildData(callback: (viewDataN: TransactionViewData) => void) {
    if (AppUtils.isNullOrWhiteSpace(this.viewData.queryForm.storeIds)) {
      return;
    }
    let pageRest: PageResp = await this.dataReportMgr.getTradingFlow(this.viewData.queryForm);
    this.viewData.setPageResp(pageRest);
    this.viewData.recordCount = pageRest.totalCount;
    // this.viewData.pageNo = pageRest.pageNo;
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
    // AppRouter.goOrderConsumeDetail(orderId);
  }


  removeFilter(filterItem) {
    this.viewData.removeFilter(filterItem);
    this.refreshData();
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
        this.buildDateQueryForm();
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
