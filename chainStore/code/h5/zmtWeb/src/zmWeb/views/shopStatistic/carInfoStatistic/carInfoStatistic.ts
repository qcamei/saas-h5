import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CarInfoStatisticsService} from "./carInfoStatisticsService";
import {CardStatisticsMgr} from "../../../bsModule/CardStatistics/CardStatisticsMgr";
import {CardStatisticsData} from "../../../bsModule/CardStatistics/Data/CardStatisticsData";
import {CardMapData} from "../../../bsModule/CardStatistics/Data/CardMapData";

@Component({
  selector: 'undefined-carInfoStatistic',
  template: `
    <view-body-comp [headerArr]="['次卡统计']">

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
                        [itemList]="cardMapDataList"></zm-mat-table>
          <no-data [loadingFinish]="loadingFinish" [dataList]="cardMapDataList" [text]="'没有数据'"
                   [showImg]="'noData'"></no-data>
          <zm-page [pageSize]="pageSize" [totalSize]="totalSize" [curPage]="pageNumber"
                   (pageChange)="getPageData($event)"></zm-page>
        </div>
      </zm-card>
    </view-body-comp>
  `,
  styles: [`
  `]

})
export class CarInfoStatisticPage implements OnInit {

  private cardService: CarInfoStatisticsService;
  public cardViewData: CardStatisticsData = new CardStatisticsData();
  public pageNumber: number = 1;
  public totalSize: number = 0;
  public pageSize: number = 10;
  public loadingFinish: boolean = false;
  public cardMapDataList: Array<CardMapData> = [];

  constructor(private cardStatisticsMgr: CardStatisticsMgr, private cdRef: ChangeDetectorRef) {
    this.cardService = new CarInfoStatisticsService(this.cardStatisticsMgr);
  }

// 分页
  getPageData($event) {
    if (this.totalSize > 10) {
      if ($event * 10 < this.totalSize) {
        this.cardMapDataList = this.cardViewData.cardMapDataList.slice(($event - 1) * 10, $event * 10);
      } else {
        this.cardMapDataList = this.cardViewData.cardMapDataList.slice(($event - 1) * 10, this.totalSize - ($event - 1) * 10 + ($event - 1) * 10);
      }
    } else {
      this.cardMapDataList = this.cardViewData.cardMapDataList.slice(0, this.cardViewData.cardMapDataList.length);
    }
    this.mapData();
  }

  private mapData() {
    for (let i = 0; i < this.cardMapDataList.length; i++) {
      let cardMapData: CardMapData = this.cardMapDataList[i];
      cardMapData.position = this.pageSize * (this.pageNumber - 1) + i + 1;
    }
  }

  ngOnInit() {
    this.laodViewData();
  }

  async laodViewData() {
    let storeId = SessionUtil.getInstance().getStoreId();
    await this.cardService.cardStatistics(storeId, success => {
      if (success != null) {
        this.loadingFinish = true;
        this.cardViewData = success;
        this.cardMapDataList = this.cardViewData.cardMapDataList.slice(0, 10);
        this.totalSize = this.cardViewData.cardMapDataList.length;
        this.mapData();
        this.cdRef.markForCheck();
      }

    });

  }

}
