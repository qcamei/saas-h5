import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {FinancialStatisticsViewData} from "./finance-report.viewData";
import {DataReportMgr} from "../../../bsModule/dataReport/DataReportMgr";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {FinanceReport} from "../../../bsModule/dataReport/apiData/FinanceReport";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {ShopModelComponent} from "../shopModel/shop-model.component";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {ChainViewDataMgr} from "../../chain/ChainViewDataMgr";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {StoreCacheUtils} from "../StoreCacheUtils";
import {StoreListViewData} from "../../chain/storeList/storeList";
import {MatDialog} from "@angular/material";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";

@Component({
  selector: 'finance-report',
  templateUrl: './finance-report.component.html',
  styleUrls: ['./finance-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FinanceReportComponent {

  viewData: FinancialStatisticsViewData;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private dataReportMgr: DataReportMgr,
              private storeConfigMgr:StoreConfigMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
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
    this.buildDateQueryForm();
  }


  getFinancesDataReport(): void {

    this.getStoreCacheUtils().getStoreListViewData((storeListViewData: StoreListViewData) => {

      this.initStoreIds(storeListViewData);
      //获取报表数据
      this.buildData(viewDataN => {
        this.viewData.loadingFinish = true;
        this.viewData.buildViewData();
        this.cdRef.markForCheck();
      });
    });

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

  buildDateQueryForm() {
    let minTime = [this.viewData.minTime.year, this.viewData.minTime.month, this.viewData.minTime.day];
    let maxTime = [this.viewData.maxTime.year, this.viewData.maxTime.month, this.viewData.maxTime.day];
    let minDate = new Date(minTime.join("/") + " 00:00:00");
    let maxDate = new Date(maxTime.join("/") + " 23:59:59");
    this.viewData.queryForm.minTime = minDate.getTime().toString();
    this.viewData.queryForm.maxTime = maxDate.getTime().toString();
    // if (this.viewData.storeId) {
    //   this.viewData.queryForm.storeIds = this.viewData.storeId;
    // }
    if (minDate.getTime() > maxDate.getTime()) {
      AppUtils.showWarn("提示", "开始时间必须大于结束时间！")
    } else {
      this.getFinancesDataReport();
    }
  }

  public async buildData(callback: (viewDataN: FinancialStatisticsViewData) => void) {
    // this.buildDateQueryForm();
    if (AppUtils.isNullOrWhiteSpace(this.viewData.queryForm.storeIds)) {
      return;
    }
    let financeReports: Array<FinanceReport> = await this.dataReportMgr.getFinanceReport(this.viewData.queryForm);
    this.viewData.financeReports = financeReports;
    if (financeReports) {

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


  getStoreCacheUtils(): StoreCacheUtils {
    return StoreCacheUtils.getInstance(this.chainViewDataMgr, this.chainMgr, this.chainSynDataHolder, this.storeMgr,this.storeConfigMgr);
  }
}
