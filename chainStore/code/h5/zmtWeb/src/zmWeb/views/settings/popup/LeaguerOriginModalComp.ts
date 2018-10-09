import {Component, Input, OnInit, OnDestroy, Output, Inject} from '@angular/core';

import {LeaguerOriginOperationEnum} from "../setSource/leaguerOriginOperationEnum";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LeaguerOriginAddForm} from "../../../bsModule/storeConfig/apiData/LeaguerOriginAddForm";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {AppUtils} from "../../../comModule/AppUtils";
import {LeaguerOriginUpdateForm} from "../../../bsModule/storeConfig/apiData/LeaguerOriginUpdateForm";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {RestResp} from "../../../comModule/RestResp";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 新建、编辑会员来源模态框
 */
@Component({
  selector: 'leaguer-origin-modal',
  template: `


      <div animation-modal>
            <h2 mat-dialog-title>
               {{label}}
            </h2>
            <mat-dialog-content>
                 <zm-input-text [label]="'来源名称'" [maxlength]="8" [(zmValue)]="originName" [(zmPass)]="originNamePass" [required]="true"></zm-input-text>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                  <zm-btn-md  [disabled]="!originNamePass" (click)="save()" name="保存"></zm-btn-md>
            </mat-dialog-actions>
      </div>
      
    
  `,
  styleUrls:['./popup.scss']
})
export class LeaguerOriginModalComp implements OnInit,OnDestroy{
  private activeModal: any;
  constructor(
              private storeConfigMgr:StoreConfigMgr,
              @Inject(MAT_DIALOG_DATA) dataInput:any,) {
    this.activeModal = dataInput.modalCtrl;
  }

  @Input() operation: LeaguerOriginOperationEnum;
  @Input() leaguerConfig: LeaguerConfig;
  @Input() leaguerOriginConfig: LeaguerOriginConfig;
  @Output() action:any;

  public label:string;
  public originName:string;
  public originNamePass:boolean;

  ngOnInit(): void {
    if(this.operation == LeaguerOriginOperationEnum.ADD){
      this.label = "添加来源";
    }else if(this.operation == LeaguerOriginOperationEnum.EDIT){
      this.label = "编辑来源";
      this.originName = this.leaguerOriginConfig.originName;
    }
  }

  ngOnDestroy(): void {

  }

  /**
   * 关闭弹窗
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 保存按钮点击事件
   */
  save(){
    if(this.operation == LeaguerOriginOperationEnum.ADD){
      this.addLeaguerOrigin();
    }else if(this.operation == LeaguerOriginOperationEnum.EDIT){
      this.editLeaguerOrigin();
    }
  }

  private addLeaguerOrigin(){
    if(AppUtils.isNullObj(this.originName)){
      AppUtils.showWarn("提示","来源不能为空");
    }else if(AppUtils.isNullOrWhiteSpace(this.originName)){
      AppUtils.showWarn("提示","来源不能为空");
    }else{
      this.originName = AppUtils.trimBlank(this.originName);
      let storeId = SessionUtil.getInstance().getStoreId();
      let leaguerOriginAddForm = new LeaguerOriginAddForm();
      leaguerOriginAddForm.id = (parseInt(this.leaguerConfig.leaguerOriginConfigIndex.toString()) + 1).toString();
      leaguerOriginAddForm.originName = this.originName;
      this.storeConfigMgr.addLeaguerOrigin(storeId,leaguerOriginAddForm).then((restResp:RestResp)=>{
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","新建成功");
          this.action();
          this.closeModal();
        }else{
          AppUtils.showError("提示",restResp.tips);
        }
      })
    }
  }

  private editLeaguerOrigin(){
    if(AppUtils.isNullObj(this.originName)){
      AppUtils.showWarn("提示","来源不能为空");
    }else if(AppUtils.isNullOrWhiteSpace(this.originName)){
      AppUtils.showWarn("提示","来源不能为空");
    }else if(this.originName == this.leaguerOriginConfig.originName){
      this.closeModal();
    }else{
      this.originName = AppUtils.trimBlank(this.originName);
      let storeId = SessionUtil.getInstance().getStoreId();
      let leaguerOriginUpdateForm = new LeaguerOriginUpdateForm();
      leaguerOriginUpdateForm.id = this.leaguerOriginConfig.id;
      leaguerOriginUpdateForm.originName = this.originName;
      this.storeConfigMgr.updateLeaguerOrigin(storeId,leaguerOriginUpdateForm).then((restResp:RestResp)=>{
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","修改成功");
          this.action();
          this.closeModal();
        }else{
          AppUtils.showError("提示",restResp.tips);
        }
      })
    }
  }

}

