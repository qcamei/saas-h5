import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {AppointmentViewDataMgr} from "../AppointmentViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppointmentUpdateStatusApiForm} from "../../../bsModule/appointment/apiData/AppointmentUpdateStatusApiForm";
import {WorkFlowMgr} from "../../../bsModule/workFlow/WorkFlowMgr";
import {WorkFlowDataAddByAppoint} from "../../../bsModule/workFlow/apiData/WorkFlowDataAddByAppoint";
import {AppRouter} from "../../../comModule/AppRouter";
import {AppointmentDeleteForm} from "../../../bsModule/appointment/apiData/AppointmentDeleteForm";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";

import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {CancelAppointComp} from "../Comp/cancelAppointmentComp/cancelAppointmentComp";
import {CancelReason} from "../../../bsModule/appointment/data/CancelReason";
import {Popup} from "../../common/popup/popup";
import {AppointmentStatusEnum} from "../../../bsModule/appointment/data/AppointmentStatusEnum";
import {AppointmentListViewData} from "./AppointmentListViewData";
import {AppointmentListService} from "./AppointmentListService";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {Constants} from "../../common/Util/Constants";

@Component({
  selector: 'appointmentList',
  templateUrl: 'appointmentList.html',
  styleUrls: ['appointmentList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  //变化检测器的策略 CheckOnce ->Checked

})


export class AppointmentListPage implements OnInit {

  displayedColumns: string[] = ['appointTime', 'leaguerName', 'status', 'origin', 'operation'];

  private service: AppointmentListService;
  public viewData: AppointmentListViewData;
  public timeSlotEnums: Array<TimeSlotEnum> = new Array<TimeSlotEnum>();


  constructor(private appointmentMgr: AppointmentMgr,
              private appointmentViewDataMgr: AppointmentViewDataMgr,
              private workFlowMgr: WorkFlowMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storeConfigSynDataHolder: StoreConfigSynDataHolder,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_SEVEN_DAYS);

    this.service = new AppointmentListService(this.appointmentMgr, this.appointmentViewDataMgr, this.storeLeaguerInfoSynDataHolder, this.storeConfigSynDataHolder);
  }


  ngOnInit() {

    this.appointmentViewDataMgr.setAppointmentListViewData(new AppointmentListViewData());
    this.appointmentViewDataMgr.subscribeAppointmentListVD((viewDataP: AppointmentListViewData) => {
      if (AppUtils.isNullObj(viewDataP)) return;
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    // this.service.initViewData(this.curPage);
  }


  //组件默认回调初始化一次数据
  //时间切换
  onTimeSlotCb(timeSlot: TimeSlot): void {
    if (AppUtils.isNullObj(this.viewData) || AppUtils.isNullObj(timeSlot)) return;
    this.viewData.queryForm.minTime = timeSlot.getMinTime().toString();
    this.viewData.queryForm.maxTime = timeSlot.getMaxTime().toString();
    this.getAppointmentByReq();
  }

  /**
   * 分页组件回调
   * @param curPage:当前页
   */
  public getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.getAppointmentByReq();
  }



  /**
   * 按条件查询
   */
  public getAppointmentByReq() {

    if (!AppUtils.isNullObj(this.viewData.queryForm.leaguerName)) {
      this.viewData.queryForm.leaguerName = AppUtils.trimBlank(this.viewData.queryForm.leaguerName);
    }
    this.service.buildViewData(this.viewData);
  }


  /**
   * 接受预约 确认框
   */
  receiveAppoint(appointmentId: string) {
    Popup.getInstance().open("提示", "确定接受预约?", () => {
      this.changeState(appointmentId, AppointmentStatusEnum.RECEIVE);
    });
  }

  /**
   * 改变预约接受状态事件
   */
  changeState(appointmentId: string, state) {
    let updateStatusData = new AppointmentUpdateStatusApiForm();
    updateStatusData.status = state;
    this.service.updateAppointmentState(appointmentId, updateStatusData).then(
      (success) => {
        if (success) {
          this.getPageData(Constants.DEFAULT_PAGENO);
        }
      }
    );
  }

  /**
   * 取消预约 弹窗
   **/
  public cancelAppoint(appointmentId): void {

    let modalData = {};
    modalData["reasonsList"] = this.viewData.reasonsList;
    let callBack = this.selectReasonCallback.bind(this, appointmentId);

    ZmModalMgr.getInstance().newSmallModal(CancelAppointComp, modalData, callBack);
  }

  private selectReasonCallback(appointmentId: string, cancelReason: CancelReason) {
    let cancelForm: AppointmentUpdateStatusApiForm = new AppointmentUpdateStatusApiForm();
    cancelForm.status = AppointmentStatusEnum.CANCEL;
    cancelForm.cancelReason = cancelReason;
    this.service.updateAppointmentState(appointmentId, cancelForm).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess("提示", "取消成功");
          this.getPageData(Constants.DEFAULT_PAGENO);
        } else {
          AppUtils.showError("提示", "取消失败");
        }
      });
  }

  /**
   * 预约转收银
   */
  public async turnToConsume(appointmentId: string) {
    Popup.getInstance().open("提示", "是否确定转为开单", () => {
      let updateStatusForm: AppointmentUpdateStatusApiForm = new AppointmentUpdateStatusApiForm();
      updateStatusForm.status = AppointmentStatusEnum.SUCCESS;
      this.service.updateAppointmentState(appointmentId, updateStatusForm).then(
        (success) => {
          if (success) {
            let addForm: WorkFlowDataAddByAppoint = this.buildAddForm(appointmentId);
            this.workFlowMgr.addByAppoint(addForm).then(
              (workFlowData) => {
                this.dealResult(workFlowData);
              }
            );
          }
        }
      );
    });
  }

  /**组装AddForm*/
  private buildAddForm(appointmentId: string) {
    let creatorId = SessionUtil.getInstance().getUserId();
    let addForm = new WorkFlowDataAddByAppoint();
    addForm.appointmentId = appointmentId;
    addForm.creatorId = creatorId;
    return addForm;
  };

  /**判断添加工作流是否成功*/
  private dealResult(workFlowData) {
    if (!AppUtils.isNullObj(workFlowData)) {
      let workFlowId = workFlowData.id;
      AppRouter.goConsume(workFlowId);
      AppUtils.showSuccess("提示", "转为开单成功");
    } else {
      AppUtils.showError("提示", "转为开单失败");
    }
  }


  /**
   * 删除预约弹窗
   */
  deleteAppt(apptId) {
    Popup.getInstance().open("删除预约", "是否删除预约？", () => {
      this.deleteAppointment(apptId);
    });
  }

  /**
   * 删除预约
   */
  deleteAppointment(apptId) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let appointmentDeleteForm: AppointmentDeleteForm = new AppointmentDeleteForm();
    appointmentDeleteForm.appointmentId = apptId;

    this.appointmentMgr.deleteAppointment(storeId, appointmentDeleteForm).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess("提示", "删除成功");
          this.getPageData(Constants.DEFAULT_PAGENO);
        } else {
          AppUtils.showError("提示", "删除失败");
        }
      });
  }


  /**
   * 点击事件 跳转新建预约页面
   */
  public goAddAppointment() {
    AppRouter.goAddAppointment();
  }

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

