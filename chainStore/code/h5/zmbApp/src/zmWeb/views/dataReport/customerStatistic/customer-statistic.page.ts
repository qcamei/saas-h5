/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/26
 */

import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {IonicPage, Platform} from "ionic-angular";
import {CustomerStatisticViewData} from "./customer-statistic.viewData";
import {CustomerStatisticViewDataMgr} from "./customer-statistic.viewData.mgr";
import {TimeSlotEnum} from "../../zmComp/form/date/timeSlot/TimeSlotEnum";
import {LineEChartsOptionsData} from "../../zmComp/charts/lineCharts/ZmLineCharts";


@IonicPage({
    name: "customerStatistic",
    segment: "customerStatistic"
  }
)
@Component({
  template: `
    <zm-page-header title="客户统计"></zm-page-header>
    <zm-page-content style="background-color: #f7f7f7">
      <ion-row>
        <zm-select-timePeriod [timeSlotEnums]="viewData.timeSlotEnums"
                              (action)="dateChange($event)"></zm-select-timePeriod>
      </ion-row>
      <!--<date-pic style="float: left"  [(currentValue)]="viewData.minTime" [placeholder]="'开始时间'"></date-pic>-->
      <!--</ion-col>-->
      <!--<ion-col col-5>-->
      <!--<date-pic style="float: left" [label]="'至'" [(currentValue)]="viewData.maxTime" [placeholder]="'结束时间'"></date-pic>-->
      <!--</ion-col>-->

      <ion-row style="padding-top:20px;height:110px;background-color: #4678FA">


        <ion-col col-5>
          <zm-btn-count title="新增客户" value="{{viewData.newMemberCount}}"></zm-btn-count>
        </ion-col>
        <div col-2 style="  position:relative;">
          <div style="height: 60px;width: 1px;background-color: white;margin:auto 50%;display:block"></div>
        </div>
        <ion-col col-5>
          <zm-btn-count title="新增消费次数" value="{{viewData.newCostTimes}}"></zm-btn-count>
        </ion-col>
      </ion-row>
      <ion-row style="height: 50px;">
        <ion-col col-5>
          <zm-btn-count [blackColor]="true" title="消费客户" value="{{viewData.newMemberCount}}"></zm-btn-count>
        </ion-col>
        <div col-2 style="  position:relative;">
          <div style=" height: 50px;width: 1px;background-color: #DDDDDD;margin:0 50%;display:block"></div>
        </div>
        <ion-col col-5>
          <zm-btn-count [blackColor]="true" title="平均客单价" value="{{viewData.newCostTimes}}"></zm-btn-count>
        </ion-col>
      </ion-row>
      <!--<ion-row>-->
      <!--<ion-tabs class="row">-->
      <!--<ion-tab tabIcon="contact" [root]="'tab1'"></ion-tab>-->
      <!--<ion-tab tabIcon="compass" [root]="'tab2'"></ion-tab>-->
      <!--<ion-tab tabIcon="analytics" [root]="'tab3'"></ion-tab>-->
      <!--<ion-tab tabIcon="settings" [root]="'tab4'"></ion-tab>-->
      <!--</ion-tabs>-->
      <!--</ion-row>-->
      <ion-row style="margin: 10px 10px 0 10px">
        <ion-segment [(ngModel)]="segmentTag">
          <ion-segment-button value="newCount">
            客户总数
          </ion-segment-button>
          <ion-segment-button value="newCost">
            消费次数
          </ion-segment-button>
        </ion-segment>
      </ion-row>
      <div [ngSwitch]="segmentTag">
        <ion-card *ngSwitchCase="'newCount'">
          <zm-line-charts [optionsData]="lineEChartsOptionsData"></zm-line-charts>

        </ion-card>
        <ion-card *ngSwitchCase="'newCost'">

          <img src="assets/img/noData.png"/>

          <ion-card-content>
            <ion-card-title>
              Nine Inch Nails Live
            </ion-card-title>
            <p>
             dasdha施工队框架爱干净哈为广大阿萨德刚卡接收到过卡几个 The most popular industrial group ever, and largely responsible for bringing the music to a mass audience.
            </p>
          </ion-card-content>

          <ion-row no-padding>
            <ion-col>
              <button ion-button clear small color="danger" icon-start>
                <ion-icon name='star'></ion-icon>
                Favorite
              </button>
            </ion-col>
            <ion-col text-center>
              <button ion-button clear small color="danger" icon-start>
                <ion-icon name='musical-notes'></ion-icon>
                Listen
              </button>
            </ion-col>
            <ion-col text-right>
              <button ion-button clear small color="danger" icon-start>
                <ion-icon name='share-alt'></ion-icon>
                Share
              </button>
            </ion-col>
          </ion-row>

        </ion-card>
      </div>
    </zm-page-content>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomerStatisticPage {
  segmentTag: string = "newCount";

  viewData: CustomerStatisticViewData;
  lineEChartsOptionsData:LineEChartsOptionsData;

  constructor(private cdRef: ChangeDetectorRef) {
    let xAlis: Array<string> = [];
    let yAlis: Array<string> = [];
    xAlis.push("11");
    xAlis.push("21");
    xAlis.push("31");
    xAlis.push("11");
    xAlis.push("31");
    xAlis.push("13");
    xAlis.push("23");

    yAlis.push("33");
    yAlis.push("13");
    yAlis.push("54");
    yAlis.push("3");
    yAlis.push("23");
    yAlis.push("13");
    yAlis.push("93");
    this.lineEChartsOptionsData = new LineEChartsOptionsData(xAlis,yAlis,['测试']);
    CustomerStatisticViewDataMgr.getInstance().onDataChanged(CustomerStatisticViewData.newInstance(), (viewDataT: CustomerStatisticViewData) => {
      this.viewData = viewDataT;
      this.cdRef.markForCheck();
    });
  }


  dateChange($event) {
    console.log(event);
    this.cdRef.markForCheck();
  }
}
