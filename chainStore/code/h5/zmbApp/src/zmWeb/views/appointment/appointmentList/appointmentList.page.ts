import {IonicPage, NavParams} from "ionic-angular";
import { ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {AppointmentListViewdata} from "./appointmentList.viewdata";
import {AppointmentListService} from "./appointmentList.service";
import {AppointmentListViewDataMgr} from "./appointmentListViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {TimeSlotEnum} from "../../zmComp/form/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/form/date/timeSlot/TimeSlot";
import {AppUtils} from "../../../comModule/AppUtils";
import {PickerDataItem} from "../../zmBSComp/zmb/picker/zmbPicker/PickerData";
import {AppointmentUpdateStatusApiForm} from "../../../bsModule/appointment/apiData/AppointmentUpdateStatusApiForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppointmentStatusEnum} from "../../../bsModule/appointment/data/AppointmentStatusEnum";
import {CancelReason} from "../../../bsModule/appointment/data/CancelReason";
import {SysInitReason} from "../../../bsModule/storeConfig/data/appoint/SysInitReasonEnum";

@IonicPage({
  name: "appointmentList",
  segment: 'appointmentList'
})

@Component({
  template: `

    <zm-page-header title="预约列表" [operation]="true" [edit]="'添加'" (zmbBtnClick)="goAppointmentAddPage($event)" ></zm-page-header>
    <zm-page-content>
      <zm-select-timePeriod [timeSlotEnums]="timeSlotEnums"
                            (action)="findAppointmentList($event)"></zm-select-timePeriod>

      <div mb-100-p>
        <div w-100 style="z-index:9999; top:44px;left:0;">
          <zm-tabs-custom [tabList]="viewData.appointTabList" [(zmValue)]="viewData.selectedAppointTab"
                          (onChange)="switchAppointTab()"></zm-tabs-custom>
        </div>
        <div border-gray></div>
        <!--<div style="height:70vh;overflow:auto;">-->
        <!--<div *ngIf="animateItems">-->
        <div *ngFor="let item of viewData.appointListShow">
          <zmbAppoint-list [appoint]="item" (click)="goDetailPage(item.appointment.id)"></zmbAppoint-list>
          <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="5px" style="padding:10px">
            <zm-btn-small *ngIf="isCanDelete(item.appointment.status)" [outline]="true" [name]="'删除预约'" (zmbtnClick)="deleteAppointment(item.appointment.id)"></zm-btn-small>
            <zm-btn-small *ngIf="isCanCancel(item.appointment.status)" [outline]="true" [name]="'取消预约'" (zmbtnClick)="cancelAppointment(item.appointment.id)"></zm-btn-small>
            <zm-btn-small *ngIf="isCanChangeToWf(item.appointment.status)" [name]="'转为收银'" (zmbtnClick)="changeToWF(item.appointment.id)"></zm-btn-small>
            <zm-btn-small *ngIf="isCanReceive(item.appointment.status)" [name]="'接受预约'" (zmbtnClick)="changeToWF(item.appointment.id)"></zm-btn-small>
          </div>
        </div>
        <zm-no-data
          *ngIf="viewData.loadingFinish && viewData.appointListShow && viewData.appointListShow.length==0"></zm-no-data>
      </div>
      <zmb-picker-select #pickerSelect [pickerData]="viewData.cancelReasonList" [level]="1" (done)="onCancelReasonSelected($event)"></zmb-picker-select>
      <!--</div>-->
    </zm-page-content>
  `,
  styles: [`
    [text-indent] {
      text-indent: 25px;
    }
  `],
})

export class AppointmentListPage {


  public timeSlotEnums = new Array<TimeSlotEnum>();

  public viewData: AppointmentListViewdata = new AppointmentListViewdata();
  private service: AppointmentListService;

  constructor(private cdRef: ChangeDetectorRef,
              public navParams: NavParams) {

    //init
    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.TOMORROW);
    this.timeSlotEnums.push(TimeSlotEnum.NEXT_SEVEN_DAYS);

    this.service = new AppointmentListService();
    let initViewData = new AppointmentListViewdata();
    AppointmentListViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewWillEnter() {
    let isFromHomePage:boolean = AppRouter.getInstance().getTargetObj(this.navParams);
    if(!AppUtils.isNullObj(isFromHomePage) && isFromHomePage==true){
      this.viewData.isFromHomePage = isFromHomePage;
    }

    this.service.buildViewData(this.viewData);
  }


  findAppointmentList(timeSlot: TimeSlot) {
    this.viewData.queryForm.minTime = timeSlot.getMinTime();
    this.viewData.queryForm.maxTime = timeSlot.getMaxTime();
    this.service.buildViewData(this.viewData);
  }

  /**
   * 跳转到添加预约页面
   * @param event
   */
  goAppointmentAddPage(event){
    AppRouter.getInstance().goAppointmentAddPage();
  }

  //是否能被删除
  isCanDelete(status:number):boolean{
    let canDelete:boolean = true;
    //所有状态都能被删除
    return canDelete;
  }

  //是否可以转为收银
  isCanChangeToWf(status:number):boolean{
    let canChangeToWf:boolean = false;
    if (status == AppointmentStatusEnum.RECEIVE) {
      canChangeToWf = true;
    }
    return canChangeToWf;
  }

  //是否可以接受预约
  isCanReceive(status:number):boolean{
    let canReceive:boolean = false;
    if (status == AppointmentStatusEnum.NEW) {
      canReceive = true;
    }
    return canReceive;
  }

  //是否可以接受预约
  isCanCancel(status:number):boolean{
    let canCancel:boolean = false;
    if (status == AppointmentStatusEnum.NEW || status == AppointmentStatusEnum.RECEIVE) {
      canCancel = true;
    }
    return canCancel;
  }

  /**
   * 切换tab
   */
  switchAppointTab() {
    if (!AppUtils.isNullObj(this.viewData.selectedAppointTab)) {
      let status: number = this.viewData.selectedAppointTab.value;
      this.viewData.status = status;
      this.service.buildViewData(this.viewData);
    }
  }

  /**
   * 跳转详情
   * @param appointmentId
   */
  goDetailPage(appointmentId: string) {
    AppRouter.getInstance().goAppointDetailPage(appointmentId);
  }

  /**
   * 删除预约
   * @param appointmentId
   */
  deleteAppointment(appointmentId: string) {
    // AlertUtils.getInstance().showConfirm('温馨提示', '删除预约？', (appointmentId)=>{
    //
    // }, null);
    this.service.deleteAppointment(appointmentId, () => {
      this.service.buildViewData(this.viewData);
    });
  }

  /**
   * 取消预约按钮点击事件
   * @param {string} appointmentId
   */
  cancelAppointment(appointmentId: string) {
    this.viewData.currentSelectedAppointId = appointmentId;
    this.showPickerSelect();
  }

  /**
   * 取消预约
   * @param reasonStr
   */
  doCancelAppointment(appointmentId: string, reasonStr:string) {
    let appointmentUpdateStatusApiForm: AppointmentUpdateStatusApiForm = new AppointmentUpdateStatusApiForm();
    appointmentUpdateStatusApiForm.operatorId = SessionUtil.getInstance().getUserId();
    appointmentUpdateStatusApiForm.operatorName = SessionUtil.getInstance().getUserName();
    appointmentUpdateStatusApiForm.status = AppointmentStatusEnum.CANCEL;
    appointmentUpdateStatusApiForm.cancelReason = CancelReason.newInstance(reasonStr);

    this.service.cancelAppointment(
      appointmentId,
      appointmentUpdateStatusApiForm,
      ()=>{this.service.buildViewData(this.viewData);}
    );
  }

  /**
   * 转为收银
   * @param appointmentId
   */
  changeToWF(appointmentId: string) {
    this.service.changeToWF(appointmentId, () => {
      this.service.buildViewData(this.viewData);
    });
  }

  /******************** 取消预约原因选择begin *************************/
  @ViewChild('pickerSelect') pickerSelect;
  showPickerSelect() {
    this.pickerSelect.open();
  }

  onCancelReasonSelected(data:PickerDataItem) {
    let curSelectedAppointId = this.viewData.currentSelectedAppointId;
    let reasonStr = data.text;
    if(reasonStr == SysInitReason.OTHER){
      AppRouter.getInstance().goAppointCancelReasonPage(curSelectedAppointId);
    }else{
      this.doCancelAppointment(curSelectedAppointId, reasonStr);
    }

  }
  /******************** 取消预约原因选择end *************************/

}
