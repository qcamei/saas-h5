import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {CardStatisticService} from "./card-statistic.service";
import {CardStatisticsMgr} from "../../../bsModule/dataReport/CardStatistics/CardStatisticsMgr";
import {CardMapData} from "../../../bsModule/dataReport/CardStatistics/Data/CardMapData";
import {ChainViewDataMgr} from "../../chain/ChainViewDataMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {StoreCacheUtils} from "../StoreCacheUtils";
import {StoreListViewData} from "../../chain/storeList/storeList";
import {AppUtils} from "../../../comModule/AppUtils";
import {CardStatisticViewData} from "./card-statistic.viewData";
import {ShopModelComponent} from "../shopModel/shop-model.component";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";

@Component({
  selector: 'card-statistic',
  template: `
    <view-body-comp [headerArr]="['次卡统计']">
      <div class="container" fxLayout="column" fxLayoutAlign="left" fxLayoutGap="10px" fxLayout.xs="column"
           fxLayoutGap.xs="0">
        <zm-card [showHeader]="false" fxFlex="100" [expanded]="true" [withCollapse]="false">
          <header fxLayout="row wrap" fxLayoutAlign="start center">
            <label style="width:140px;color:#2a2a2a;font-size:16px;">相关门店</label>
            <div class="nameDiv fz-14 zmCurHand" (click)="selectCustomer($event)">
              <span *ngIf="!true">点击弹框回传的name</span>

              <span *ngIf="true" style="color: #A4ABB3">请选择门店</span>

              <i class="fa fa-plus" style="color:#03a9f4;position:absolute;right:0px;top: 10px;"></i>
            </div>

          </header>
        </zm-card>
        <zm-card [expanded]="true" [withCollapse]="false" [showHeader]="false" fxFlex="100">
          <div>
            <ng-template #colA let-item="item">{{item.position}}</ng-template>
            <ng-template #colB let-item="item">{{item.name}}</ng-template>
            <ng-template #colC let-item="item">{{item.number}}</ng-template>
            <ng-template #colD let-item="item">
              <span *ngIf="item.numberOfConsumption == -1" class="align-middle">无限次</span>
              <span *ngIf="item.numberOfConsumption != -1" class="align-middle">{{item.numberOfConsumption}}次</span>
            </ng-template>
            <zm-mat-table [tdTemplateList]="[colA,colB,colC,colD]"
                          [thNameList]="['序号','名称','有效张数','未消费卡内次数']"
                          [itemList]="viewData.cardMapDataList"
                          [elevation]="false"></zm-mat-table>
            <no_data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.cardMapDataList" [text]="'没有数据'"
                     [showImg]="'noData'"
                     [elevation]="false"></no_data>
            <zm_page [pageSize]="viewData.pageSize" [totalSize]="viewData.totalSize" [curPage]="viewData.pageNumber"
                     (pageChange)="getPageData($event)"
                     [elevation]="false"></zm_page>
          </div>
        </zm-card>
      </div>
    </view-body-comp>
  `,
  styles: [`
    .nameDiv {
      display: inline-block;
      width: 200px;
      border: 2px solid #03a9f4;
      border-radius: 6px;
    / / padding: 8 px 10 px;
      padding-left: 15px;
      height: 35px;
      line-height: 32px;
      position: relative;
    }

  `],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardStatisticComponent implements OnInit {

  private cardService: CardStatisticService;

  viewData: CardStatisticViewData;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private cardStatisticsMgr: CardStatisticsMgr,
              private storeConfigMgr: StoreConfigMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.viewData = new CardStatisticViewData();
    this.cardService = new CardStatisticService(this.cardStatisticsMgr);
  }

// 分页
  getPageData(pageNo) {
    // if (this.viewData.totalSize > 10) {
    //   if ($event * 10 < this.viewData.totalSize) {
    //     this.viewData.cardMapDataList = this.viewData.cardViewData.cardMapDataList.slice(($event - 1) * 10, $event * 10);
    //   } else {
    //     this.viewData.cardMapDataList = this.viewData.cardViewData.cardMapDataList.slice(($event - 1) * 10, this.viewData.totalSize - ($event - 1) * 10 + ($event - 1) * 10);
    //   }
    // } else {
    //   this.viewData.cardMapDataList = this.viewData.cardViewData.cardMapDataList.slice(0, this.viewData.cardViewData.cardMapDataList.length);
    // }
    this.viewData.cardMapDataList = AppUtils.getPageData(pageNo, this.viewData.cardViewData.cardMapDataList);
    this.mapData();
  }

  private mapData() {

    for (let i = 0; i < this.viewData.cardMapDataList.length; i++) {
      let cardMapData: CardMapData = this.viewData.cardMapDataList[i];
      cardMapData.position = this.viewData.pageSize * (this.viewData.pageNumber - 1) + i + 1;
    }
  }

  ngOnInit() {
    this.loadViewData();
  }

  loadViewData() {
    this.getStoreCacheUtils().getStoreListViewData((storeListViewData: StoreListViewData) => {
      if (!AppUtils.isNullObj(storeListViewData)) {
        this.initStoreIds(storeListViewData);
        this.getCardStatistics();
      }
    });
  }

  private getCardStatistics() {
    if (AppUtils.isNullOrWhiteSpace(this.viewData.storeIds)) {
      return;
    }
    this.cardService.cardStatistics(this.viewData.storeIds, success => {
      if (success != null) {
        this.viewData.loadingFinish = true;
        this.viewData.cardViewData = success;
        if (AppUtils.isNullObj(success.cardMapDataList)) {
          this.viewData.cardMapDataList = [];
        } else {
          this.viewData.cardMapDataList = AppUtils.getPageData(1, this.viewData.cardViewData.cardMapDataList);
        }
        this.viewData.totalSize = AppUtils.isNullObj(success.cardMapDataList) ? 0 : this.viewData.cardViewData.cardMapDataList.length;
        this.mapData();
      }
      this.cdRef.markForCheck();

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
      this.viewData.storeIds = storeIdArr.join(",");
    }
  }

  getStoreCacheUtils(): StoreCacheUtils {
    return StoreCacheUtils.getInstance(this.chainViewDataMgr, this.chainMgr, this.chainSynDataHolder, this.storeMgr, this.storeConfigMgr);
  }


  selectCustomer(event) {
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
        this.viewData.storeIds = storeIds.join(",");
        this.loadViewData();
      }

    });
  }
}

