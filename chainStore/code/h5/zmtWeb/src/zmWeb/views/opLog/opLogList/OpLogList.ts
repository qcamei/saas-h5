import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {OpLogListViewData} from "./OpLogListViewData";
import {OplogViewDataMgr} from "../OplogViewDataMgr";
import {OplogService} from "./OplogService";
import {OpLogMgr} from "../../../bsModule/opLog/OpLogMgr";
import {OpLogTypeEnum} from "../../../bsModule/opLog/data/OpLogTypeEnum";
import {AppUtils} from "../../../comModule/AppUtils";

@Component({
  selector: 'opLog-list',
  templateUrl: 'opLogList.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OpLogListPage {

  viewData: OpLogListViewData;
  private oplogService: OplogService;
  selectList: Array<any> = [{name: '会员档案', value: 0}, {name: '产品管理', value: 1}
    , {name: '员工管理', value: 2}, {name: '预约管理', value: 3}, {name: '订单管理', value: 4}];

  @Input() timeSlotEnums: Array<TimeSlotEnum> = new Array<TimeSlotEnum>();

  constructor(private opLogMgr: OpLogMgr, private oplogViewDataMgr: OplogViewDataMgr, private cdRef: ChangeDetectorRef) {
    //默认情况是，今天、昨天、过去的七天内
    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.THIS_MONTH);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_MONTH);
    this.oplogViewDataMgr.setOpLogListViewData(OpLogListViewData.getInstance());

    this.oplogViewDataMgr.subscribeLogListVD((viewDataP: OpLogListViewData) => {
      if (AppUtils.isNullObj(viewDataP)) return;
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.oplogService = new OplogService(this.opLogMgr, this.oplogViewDataMgr);
  }

  /**
   * 获取列表
   */
  getPageData(curPage?: number) {
    if (AppUtils.isNullObj(this.viewData)) return;
    this.viewData.curPage = curPage || this.viewData.curPage;
    this.oplogService.getPageData(this.viewData);
  }

  /**
   * 时间段选择组件回调
   * @param {TimeSlot} timeSlot
   */
  onTimeSlotCb(timeSlot: TimeSlot): void {
    if (AppUtils.isNullObj(this.viewData) || AppUtils.isNullObj(timeSlot)) return;
    this.viewData.minTime = timeSlot.getMinTime();
    this.viewData.maxTime = timeSlot.getMaxTime();
    this.getPageData();
  }

  /**
   * 根据type,转为string
   * @param {number} type
   * @returns {string}
   */
  type2String(type: number): string {
    let strType: string = "未知来源";
    switch (type) {
      case OpLogTypeEnum.Leaguer:
        strType = "会员档案";
        break;
      case OpLogTypeEnum.Product:
        strType = "产品管理";
        break;
      case OpLogTypeEnum.Clerk:
        strType = "员工管理";
        break;
      case OpLogTypeEnum.Appoint:
        strType = "预约管理";
        break;
      case OpLogTypeEnum.Order:
        strType = "订单管理";
        break;
    }
    return strType;
  }
}

