import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {TimeSlot} from "../../zmComp/form/date/timeSlot/TimeSlot";
import {WFListVD} from "./WFListVD";
import {AppUtils} from "../../../comModule/AppUtils";
import {WFService} from "../WFService";
import {TimeSlotEnum} from "../../zmComp/form/date/timeSlot/TimeSlotEnum";
import {AppRouter} from "../../zmComUtils/AppRouter";


@IonicPage({
  name: "workFlowList",
  segment: 'workFlowList'
})

@Component({
  template: `
    <zm-page-header title="开单管理" [operation]="true" [edit]="'开单'" (zmbBtnClick)="toOpenWf($event)"></zm-page-header>
    <zm-page-content [ftShow]="viewData.totalCount > viewData.pageItemCount">

      <zm-select-timePeriod [timeSlotEnums]="timeSlotEnums" (action)="onTimeChange($event)"></zm-select-timePeriod>

      <zm-tabs-custom
        [tabList]="tabList"
        [(zmValue)]="selectedStatus" (onChange)="getPageData()"></zm-tabs-custom>
      <div class="order-pull-h" [ngClass]="{'orderViewHeight':viewData.totalCount < viewData.pageItemCount}">
        <div *ngFor="let item of viewData.wfList;let i = index;">
          <div *ngIf="i == 0" border-gray></div>
          <zmbWfItem [workFlowData]="item"></zmbWfItem>
          <div border-gray></div>
        </div>
        <zm-no-data
         *ngIf="isNoData()"></zm-no-data>
      </div>

    </zm-page-content>
    <ion-footer *ngIf="viewData.totalCount > viewData.pageItemCount" class="bg-white">
      <zm-page [totalSize]="viewData.totalCount" [curPage]="viewData.curPage" [pageSize]="viewData.pageItemCount"
               (pageChange)="getPageData($event)"></zm-page>
    </ion-footer>
  `,
  styles:[`

`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkFlowListPage {
  tabList = [{name: '全部', value: -1}, {name: '待提交', value: 0}, {name: '待收款', value: 1}, {
    name: '已完成',
    value: 3
  }, {name: '已作废', value: 2}]
  selectedStatus: any = this.tabList[0];
  viewData: WFListVD = new WFListVD();
  public timeSlotEnums = new Array<TimeSlotEnum>();

  constructor(private cdRef: ChangeDetectorRef) {
    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.THIS_MONTH);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_MONTH);
  }

  onTimeChange(timeSlot: TimeSlot) {
    if (AppUtils.isNullObj(timeSlot)) return;
    this.viewData.timeSlot = timeSlot;
    this.getPageData();
  }

  /**
   * 分页请求数据
   * @param {number} curPage
   */
  getPageData(curPage?: number) {
    this.viewData.status = this.getStatus();
    this.viewData.loadingFinish = false;
    if (AppUtils.isNullObj(curPage)) {
      this.viewData.curPage = 1;
    } else
      this.viewData.curPage = curPage;
    WFService.getInstance().getWFList(this.viewData).then((isSuccess: boolean) => {
      this.viewData.loadingFinish = true;
      this.cdRef.markForCheck();
    }).catch((reason => {
      this.viewData.loadingFinish = true;
      AppUtils.showError("提示", "加载数据失败");
    }));
  }

  isNoData(): boolean {
    return this.viewData.loadingFinish && this.viewData.wfList && this.viewData.wfList.length == 0;
  }

  /**
   * 获取要查询的状态
   * @returns {string}
   */
  private getStatus(): string {
    if (this.selectedStatus.value == -1) {
      return '0,1,2,3';
    }
    return this.selectedStatus.value.toString();
  }

  /**
   * 跳转到开单收银
   */
  toOpenWf() {
    AppRouter.getInstance().goOpenWFPage();
  }

  isShowFooter(): boolean {
    if (AppUtils.isNullObj(this.viewData)) return false;
    return this.viewData.totalCount > this.viewData.pageItemCount;
  }
}




