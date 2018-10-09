import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy}from "@angular/core";

import {AppointSettingModalComp} from "../popup/AppointSettingModalComp";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {SettingsViewDataMgr} from "../SettingsViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {AppointConfig} from "../../../bsModule/storeConfig/data/AppointConfig";
import {ZmTimeData} from "../../zmComp/date/ZmTime";
import {AppointTimeUpdateForm} from "../../../bsModule/storeConfig/apiData/AppointTimeUpdateForm";
import {CancelAppointConfig} from "../../../bsModule/storeConfig/data/appoint/CancelAppointConfig";
import {CancelAppointOperationEnum} from "./cancelAppointOperationEnum";
import {CancelAppointRemoveForm} from "../../../bsModule/storeConfig/apiData/CancelAppointRemoveForm";
import {Popup} from "../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 预约设置
 */
@Component({
  selector:"setAppointment",
  templateUrl:"setAppointment.html",
  styleUrls:['setAppointment.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class SetAppointmentPage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private service:SetAppointmentService;
  public viewData:SetAppointmentViewData;

  constructor(
              private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingsViewDataMgr:SettingsViewDataMgr,
              private cdRef:ChangeDetectorRef,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new SetAppointmentService(this.storeConfigMgr,this.storeConfigSynDataHolder,this.settingsViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.settingsViewDataMgr.subscribeSetAppointVD((viewDataP:SetAppointmentViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 新建取消预约原因
   */
  addCancelReason() {
    if(this.viewData.appointConfig.getCancelAppointConfigMap().size()>=10){
      AppUtils.showWarn("提示","取消原因最多只能添加10条");
    }else if(AppUtils.isNullObj(this.viewData.appointConfig)){
      AppUtils.showWarn("提示","加载失败");
    }else{
      // const activeModal = this.modalService.open(AppointSettingModalComp,{backdrop:'static'});
      const activeModal = ZmModalMgr.getInstance().newSmallModal(AppointSettingModalComp, null,null);
      activeModal.componentInstance.operation = CancelAppointOperationEnum.ADD;
      activeModal.componentInstance.appointConfig = this.viewData.appointConfig;
      activeModal.componentInstance.action = this.successCallback.bind(this);
    }
  }

  /**
   * 编辑取消预约原因
   */
  editCancelReason(cancelAppointConfigP:CancelAppointConfig){
    // const activeModal = this.modalService.open(AppointSettingModalComp,{backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newSmallModal(AppointSettingModalComp, null,null);
    activeModal.componentInstance.operation = CancelAppointOperationEnum.EDIT;
    activeModal.componentInstance.cancelAppointConfig = cancelAppointConfigP;
    activeModal.componentInstance.action = this.successCallback.bind(this);
  }

  /**
   * 新建、编辑成功回调
   */
  successCallback(){
    this.service.initViewData();
  }

  /**
   * 删除取消预约原因
   */
  deleteCancelReason(cancelAppointConfigP:CancelAppointConfig){
    Popup.getInstance().open("删除", "确定删除原因“"+cancelAppointConfigP.reason+"”?", () => {
        this.service.removeCancelReason(cancelAppointConfigP.id).then((success:boolean)=>{
          if(success){
            AppUtils.showSuccess("提示","删除成功");
            this.service.initViewData();
          }else{
            AppUtils.showError("提示","删除失败");
          }
        })
    });
  }

  /**
   * 修改预约时间
   */
  updateAppointConfig(){
    if(AppUtils.isNullObj(this.viewData.startTime.hour)
      || AppUtils.isNullObj(this.viewData.startTime.minute)
      || AppUtils.isNullObj(this.viewData.endTime.hour)
      || AppUtils.isNullObj(this.viewData.endTime.minute)){
      AppUtils.showWarn("提示","请设置有效的时间段");
    }else if((this.viewData.startTime.hour>this.viewData.endTime.hour)
      || (this.viewData.startTime.hour==this.viewData.endTime.hour)&&(this.viewData.startTime.minute>=this.viewData.endTime.minute)){
      AppUtils.showWarn("提示","开始时间不得晚于结束时间，请重新设置后再保存");
    }else{
      this.service.updateAppointTime(this.viewData.startTime,this.viewData.endTime).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","保存成功");
          this.service.initViewData();
        }else{
          AppUtils.showError("提示","保存失败");
        }
      })
    }
  }

}

export class SetAppointmentService{
  constructor(private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingsViewDataMgr:SettingsViewDataMgr,){}


  public initViewData(){
    let viewDataTmp = new SetAppointmentViewData();
    this.settingsViewDataMgr.setAppointViewData(viewDataTmp);

    this.buildViewData((viewData:SetAppointmentViewData)=>{
      this.settingsViewDataMgr.setAppointViewData(viewData);
    })
  }

  public buildViewData(callback:(viewData:SetAppointmentViewData)=>void){
    let viewDataTmp = new SetAppointmentViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeConfigSynDataHolder.getData(storeId).then((storeConfig:StoreConfig)=>{
      if(!AppUtils.isNullObj(storeConfig)){
        let appointConfigTmp = new AppointConfig();
        AppUtils.copy(appointConfigTmp,storeConfig.appointConfig);
        viewDataTmp.appointConfig = appointConfigTmp;
        viewDataTmp.startTime = this.convert2ZmTimeData(viewDataTmp.appointConfig.appointTimeConfig.startTime);
        viewDataTmp.endTime = this.convert2ZmTimeData(viewDataTmp.appointConfig.appointTimeConfig.endTime);

        viewDataTmp.cancelAppointList = viewDataTmp.appointConfig.getCancelAppointConfigMap().values();
        viewDataTmp.cancelAppointList.sort((a:CancelAppointConfig,b:CancelAppointConfig)=>{
          return parseInt(b.id) - parseInt(a.id);
        })
      }else{
        AppUtils.showError("提示","加载失败");
      }
      callback(viewDataTmp);
    })
  }

  /**
   * 设置预约时间
   * @param startTimeP
   * @param endTimeP
   * @returns {Promise<boolean>}
   */
  public updateAppointTime(startTimeP:ZmTimeData,endTimeP:ZmTimeData):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let appointTimeUpdateForm = new AppointTimeUpdateForm();
    appointTimeUpdateForm.startTime = this.convert2AppointTime(startTimeP);
    appointTimeUpdateForm.endTime = this.convert2AppointTime(endTimeP);
    return this.storeConfigMgr.updateAppointTime(storeId,appointTimeUpdateForm);
  }

  /**
   * 删除取消预约原因
   * @param cancelAppointConfigId
   * @returns {Promise<boolean>}
   */
  public removeCancelReason(cancelAppointConfigId:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let cancelAppointRemoveForm = new CancelAppointRemoveForm();
    cancelAppointRemoveForm.id = cancelAppointConfigId;
    return this.storeConfigMgr.removeCancelReason(storeId,cancelAppointRemoveForm);
  }

  /**
   * 转换控件时间为保存字符串格式
   * @param appointTime
   * @returns {string}
   */
  public convert2AppointTime(appointTime:ZmTimeData):string{
    let uriPattern = "{0}:{1}";
    return AppUtils.format(uriPattern, appointTime.hour<10?"0"+appointTime.hour:appointTime.hour, appointTime.minute<10?"0"+appointTime.minute:appointTime.minute);
  }

  /**
   * 转化后台预约时间string为页面组件时间
   * @param appointTime
   * @returns {ZmTimeData}
   */
  private convert2ZmTimeData(appointTime:string):ZmTimeData{
    let zmTimeDataTmp = null;
    let separator = ":";
    try {
      let timeArr = appointTime.split(separator);
      zmTimeDataTmp = new ZmTimeData(parseInt(timeArr[0]),parseInt(timeArr[1]));
    }catch (e){
      AppUtils.showError("提示","时间转换错误");
    }
    return zmTimeDataTmp;
  }
}

export class SetAppointmentViewData{
  public appointConfig:AppointConfig;
  public startTime:ZmTimeData = new ZmTimeData(8,0);//开始时间
  public endTime:ZmTimeData = new ZmTimeData(18,0);//结束时间
  public cancelAppointList:Array<CancelAppointConfig> = new Array<CancelAppointConfig>();//预约取消原因列表
}
