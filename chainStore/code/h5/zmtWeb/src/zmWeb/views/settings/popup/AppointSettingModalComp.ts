import {Component, Input, OnInit, OnDestroy, Output, Inject} from '@angular/core';

import {CancelAppointOperationEnum} from "../setAppointment/cancelAppointOperationEnum";
import {AppointConfig} from "../../../bsModule/storeConfig/data/AppointConfig";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CancelAppointAddForm} from "../../../bsModule/storeConfig/apiData/CancelAppointAddForm";
import {RestResp} from "../../../comModule/RestResp";
import {CancelAppointUpdateForm} from "../../../bsModule/storeConfig/apiData/CancelAppointUpdateForm";
import {CancelAppointConfig} from "../../../bsModule/storeConfig/data/appoint/CancelAppointConfig";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 预约设置模态框
 */
@Component({
  selector: 'appoint-setting-modal',
  template: `

      <div animation-modal>
        <h2 mat-dialog-title>
          预约取消原因
        </h2>
            <mat-dialog-content>
               <div class="modal-body input-group  form-group c-input-group " fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center">
                 <label style="margin-bottom: 0;"><span style="color:#ff355d;"> *</span>{{label}}</label>
                  <input type="text" maxlength="8" placeholder="请输入取消原因" name="typeName" required #typeName="ngModel"  class="ml-16 form-control" [(ngModel)]="cancelReason"/>
               </div>
            </mat-dialog-content>
            <mat-dialog-actions style="margin-top: 20px" fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="end">
                  <zm-btn  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn>
                  <zm-btn  [disabled]="false" (click)="save()" name="保存"></zm-btn>
            </mat-dialog-actions>
      </div>
    
  `,
  styleUrls:['./popup.scss']

})
export class AppointSettingModalComp implements OnInit,OnDestroy{

  private activeModal: any;
  constructor(
              private storeConfigMgr:StoreConfigMgr,
              @Inject(MAT_DIALOG_DATA) dataInput:any,) {
       this.activeModal = dataInput.modalCtrl;
  }

  @Input() operation: CancelAppointOperationEnum;
  @Input() appointConfig:AppointConfig;
  @Input() cancelAppointConfig:CancelAppointConfig;
  @Output() action:any;

  public label:string;
  public cancelReason:string;

  ngOnInit(): void {
    if(this.operation == CancelAppointOperationEnum.ADD){
      this.label = "添加原因";
    }else if(this.operation == CancelAppointOperationEnum.EDIT){
      this.label = "编辑原因";
      this.cancelReason = this.cancelAppointConfig.reason;
    }
  }

  ngOnDestroy(): void {

  }

  /**
   * 关闭弹窗点击事件
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 确定按钮点击事件
   */
  save(){
    if(this.operation == CancelAppointOperationEnum.ADD){
      this.addCancelReason();
    }else if(this.operation == CancelAppointOperationEnum.EDIT){
      this.updateCancelReason();
    }
  }

  /**
   * 添加取消预约原因
   */
  private addCancelReason(){
    if(AppUtils.isNullObj(this.cancelReason)){
      AppUtils.showWarn("提示","原因不能为空");
    }else if(AppUtils.isNullOrWhiteSpace(this.cancelReason)){
      AppUtils.showWarn("提示","原因不能为空");
    }else{
      this.cancelReason = AppUtils.trimBlank(this.cancelReason);
      let storeId = SessionUtil.getInstance().getStoreId();
      let cancelAppointAddForm = new CancelAppointAddForm();
      cancelAppointAddForm.id = (parseInt(this.appointConfig.cancelAppointIndex.toString()) + 1).toString();
      cancelAppointAddForm.reason = this.cancelReason;
      this.storeConfigMgr.addCancelReason(storeId,cancelAppointAddForm).then((restResp:RestResp)=>{
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","添加成功");
          this.action();
          this.closeModal();
        }else{
          AppUtils.showError("提示",restResp.tips);
        }
      })
    }
  }

  private updateCancelReason(){
    if(AppUtils.isNullObj(this.cancelReason)){
      AppUtils.showWarn("提示","原因不能为空");
    }else if(AppUtils.isNullOrWhiteSpace(this.cancelReason)){
      AppUtils.showWarn("提示","原因不能为空");
    }else if(this.cancelReason == this.cancelAppointConfig.reason){
      this.closeModal();
    }else{
      this.cancelReason = AppUtils.trimBlank(this.cancelReason);
      let storeId = SessionUtil.getInstance().getStoreId();
      let cancelAppointUpdateForm = new CancelAppointUpdateForm();
      cancelAppointUpdateForm.id = this.cancelAppointConfig.id;
      cancelAppointUpdateForm.reason = this.cancelReason;
      this.storeConfigMgr.updateCancelReason(storeId,cancelAppointUpdateForm).then((restResp:RestResp)=>{
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","编辑成功");
          this.action();
          this.closeModal();
        }else{
          AppUtils.showError("提示",restResp.tips);
        }
      })
    }
  }

}

