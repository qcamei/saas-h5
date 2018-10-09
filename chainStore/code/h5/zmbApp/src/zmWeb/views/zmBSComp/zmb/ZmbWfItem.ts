import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SimpleChanges} from "@angular/core";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../../zmComUtils/Constants";
import {WorkFlowDataStatusEnum} from "../../../bsModule/workFlow/data/WorkFlowDataStatusEnum";
import {WFService} from "../../workFlow/WFService";

//  <zmbWfItem [appointTime]="" [imgUrl]="" [userName]="" [sex]="'女'" [phone]="'1882000858858'" ></zmbWfItem>
@Component({
  selector: 'zmbWfItem',
  template: `

    <div style="position:relative;">
      <div *ngIf="isCanceled()" style="position:absolute;right:0;top:0;"><img src="assets/img/overdue.png"></div>
      <div fxLayout="row" fxLayoutAlign="space-between center" style="padding:10px">
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"><span
          style="color:#999;">{{getTime()}}</span></div>
        <div style="color:#4678fa;">{{getStatus()}}</div>

      </div>
      <zmbLeaguerInfo [id]="getLeaguerId()"></zmbLeaguerInfo>

      <div *ngIf="isShowContinueBtn()||isShowCancelBtn()"
           style="border-bottom:1px solid #f4f4f4; width:95%;margin: 0 auto"></div>

      <div *ngIf="isShowContinueBtn()||isShowCancelBtn()" fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="5px"
           style="padding:5px 10px">
        <zm-btn-small *ngIf="isShowCancelBtn()" [outline]="true" [name]="'作废'" (zmbtnClick)="toCancel()"></zm-btn-small>
        <zm-btn-small *ngIf="false" [outline]="true" [name]="'跟进记录'" (zmbtnClick)="click()"></zm-btn-small>
        <zm-btn-small *ngIf="isShowContinueBtn()" [name]="'继续'" (zmbtnClick)="toContinue()"></zm-btn-small>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

// assets/img/avatar.jpeg
export class ZmbWfItem {
  @Input() workFlowData: WorkFlowData;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let idP = changes['workFlowData'];
    if (!AppUtils.isNullObj(idP)) {
      this.cdRef.markForCheck();
    }
  }

  getTime(): string {
    if (AppUtils.isNullObj(this.workFlowData)) return '-';
    let time = this.workFlowData.lastUpdateTime;
    if (time == 0) return '-';
    return AppUtils.formatDate(new Date(time), Constants.DATE_FORMAT);
  }

  getStatus(): string {
    if (AppUtils.isNullObj(this.workFlowData)) return '-';
    switch (this.workFlowData.status) {
      case WorkFlowDataStatusEnum.OPEN:
        return "待提交";
      case WorkFlowDataStatusEnum.COMPLETE:
        return "待收款";
      case WorkFlowDataStatusEnum.CANCEL:
        return "";
      case WorkFlowDataStatusEnum.HASPAY:
        return "已完成";
      default :
        return '-';
    }
  }

  getLeaguerId(): string {
    if (AppUtils.isNullObj(this.workFlowData)) return null;
    let leaguerInfo = this.workFlowData.leaguerInfo;
    if (AppUtils.isNullObj(leaguerInfo)) return null;
    return leaguerInfo.leaguerId;
  }

  /**
   * true表示显示 继续 按钮
   * @returns {boolean}
   */
  isShowContinueBtn(): boolean {
    if (AppUtils.isNullObj(this.workFlowData)) return false;
    let status = this.workFlowData.status;
    return status == WorkFlowDataStatusEnum.OPEN || status == WorkFlowDataStatusEnum.COMPLETE;
  }

  /**
   * true表示显示 作废 按钮
   * @returns {boolean}
   */
  isShowCancelBtn(): boolean {
    if (AppUtils.isNullObj(this.workFlowData)) return false;
    let status = this.workFlowData.status;
    return status == WorkFlowDataStatusEnum.OPEN;
  }

  /**
   * 返回true 表示 已作废
   * @returns {boolean}
   */
  isCanceled(): boolean {
    if (AppUtils.isNullObj(this.workFlowData)) return false;
    return this.workFlowData.status === WorkFlowDataStatusEnum.CANCEL;
  }

  toCancel() {
    AppUtils.showSuccess("提示", "作废");
  }


  toContinue() {
    if (AppUtils.isNullObj(this.workFlowData)) return;
    WFService.getInstance().getWfById(this.workFlowData.id);
    // AppUtils.showSuccess("提示", "继续");
  }
}


