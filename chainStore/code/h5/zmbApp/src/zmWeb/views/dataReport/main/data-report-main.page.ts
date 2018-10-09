import {IonicPage} from "ionic-angular";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {DataReportMainViewDataMgr} from "./data-report-main.viewData.mgr";
import {DataReportMainViewData} from "./data-report-main.viewData";
import {AppRouter} from "../../zmComUtils/AppRouter";

@IonicPage({
    name: "dataReportHome",
    segment: "dataReportHome"
  }
)
@Component({
  template: `
    <zm-page-header title="数据统计"></zm-page-header>
    <zm-page-content>

      <ion-row style="padding-top:40px;height:150px;background-color: #4678FA">
        <ion-col col-6>
          <zm-btn-count title="客户总数" value="{{viewData.memberCount}}"
                        (zmbtnClick)="click()"></zm-btn-count>
        </ion-col>
        <ion-col col-6>
          <zm-btn-count title="销售总金额" value="{{viewData.orderCost}}"
                        (zmbtnClick)="click()"></zm-btn-count>
        </ion-col>
      </ion-row>
      <ion-row style="margin-top: 15px">

        <zm-btn-icon col-4 *ngFor="let item of viewData.itemGroup" [count]="item.msgCount" [title]="item.name"
                     [imgSrc]="item.imgUrl"
                     (zmbtnClick)="goCusStatistic(item.page)"></zm-btn-icon>
      </ion-row>
    </zm-page-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataReportMainPage {
  viewData: DataReportMainViewData;


  constructor(private cdRef: ChangeDetectorRef) {
    DataReportMainViewDataMgr.getInstance().onDataChanged(DataReportMainViewData.newInstance(), (viewDataN: DataReportMainViewData) => {
      if (viewDataN) {
        this.viewData = viewDataN;
        this.cdRef.markForCheck();
      }
    });
  }

  goCusStatistic(routerUrl: string) {
    console.log(routerUrl);
    AppRouter.getInstance().push(routerUrl);
  }
}
