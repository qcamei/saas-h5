import {Component, Input, OnDestroy, OnInit, Output, Inject} from '@angular/core';

import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ExpandAttributeAddForm} from "../../../bsModule/storeConfig/apiData/ExpandAttributeAddForm";
import {RestResp} from "../../../comModule/RestResp";
import {AppUtils} from "../../../comModule/AppUtils";
import {AttributeTypeEnum} from "../../../bsModule/storeConfig/data/leaguer/AttributeTypeEnum";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {ExpandAttributeUpdateForm} from "../../../bsModule/storeConfig/apiData/ExpandAttributeUpdateForm";
import {ExpandAttributeItem} from "./setAttributeViewData";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'expand-attribute',
  template: `


      <div animation-modal>
            <h2 mat-dialog-title>
               扩展信息管理
            </h2>
            <mat-dialog-content>
                   <zm-select  [noAll]="true" [label]="'属性类型'" nameValues="单行文本:0,多行文本:1"  [(zmValue)]="attributeType" ></zm-select>
            
                   <zm-input-text [label]="'属性名称'" [maxlength]="8" [(zmValue)]="label" [(zmPass)]="labelPass" [required]="true"></zm-input-text>
                  
                   <zm-input-text [label]="'输入提示'" [placeholder]="'显示在输入框里面的提示用户输入的灰色文字，如：请输入会员名称'" [maxlength]="12" [(zmValue)]="tips"  [required]="false"></zm-input-text>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                  <zm-btn-md  [disabled]="false" (click)="save()" name="保存"></zm-btn-md>
            </mat-dialog-actions>
      </div>
    
  `,
  styles:[`
  `]
})
export class ExpandAttributeComp implements OnInit{

  private activeModal: any;
  constructor(
              private storeConfigMgr:StoreConfigMgr,
              @Inject(MAT_DIALOG_DATA) dataInput:any,) {
      this.activeModal = dataInput.modalCtrl;
  }

  @Input() operation:OperationEnum;
  @Input() leaguerConfig:LeaguerConfig;
  @Input() expandAttributeItem:ExpandAttributeItem;
  @Output() action:any;

  public attributeType:number = AttributeTypeEnum.SingleLine;
  public label:string;
  public labelPass:boolean;
  public tips:string;

  ngOnInit() {
    if(this.operation == OperationEnum.ADD){

    }else if(this.operation == OperationEnum.EDIT){
      this.label = this.expandAttributeItem.label;
      this.attributeType = this.expandAttributeItem.attributeType;
      if(!this.attributeType){
        this.attributeType = AttributeTypeEnum.SingleLine;
      }
      this.tips = this.expandAttributeItem.tips;
    }
  }

  /**
   * 关闭弹框
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 保存按钮点击事件
   */
  save(){
    if(this.operation == OperationEnum.ADD){
      this.addExpandAttribute();
    }else if(this.operation == OperationEnum.EDIT){
      this.editExpandAttribute();
    }
  }

  /**
   * 新建扩展属性
   */
  private addExpandAttribute(){
    if(AppUtils.isNullObj(this.label)){
      AppUtils.showWarn("提示","属性名称不能为空");
    }else if(AppUtils.isNullOrWhiteSpace(this.label)){
      AppUtils.showWarn("提示","属性名称不能为空");
    }else{
      this.label = AppUtils.trimBlank(this.label);
      let storeId = SessionUtil.getInstance().getStoreId();
      let expandAttributeAddForm = new ExpandAttributeAddForm();
      expandAttributeAddForm.id = (parseInt(this.leaguerConfig.leaguerExpandAttributeIndex.toString())+1).toString();
      expandAttributeAddForm.attributeType = this.attributeType;
      expandAttributeAddForm.label = this.label;
      expandAttributeAddForm.tips = this.tips;
      this.storeConfigMgr.addExpandAttribute(storeId,expandAttributeAddForm).then((restResp:RestResp)=>{
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","保存成功");
          this.action();
          this.closeModal();
        }else{
          AppUtils.showError("提示",restResp.tips);
        }
      })
    }
  }

  /**
   * 编辑扩展属性
   */
  private editExpandAttribute(){
    if(AppUtils.isNullObj(this.label)){
      AppUtils.showWarn("提示","属性名称不能为空");
    }else if(AppUtils.isNullOrWhiteSpace(this.label)){
      AppUtils.showWarn("提示","属性名称不能为空");
    }else{
      this.label = AppUtils.trimBlank(this.label);
      let storeId = SessionUtil.getInstance().getStoreId();
      let expandAttributeUpdateForm = new ExpandAttributeUpdateForm();
      expandAttributeUpdateForm.id = this.expandAttributeItem.id;
      expandAttributeUpdateForm.attributeType = this.attributeType;
      expandAttributeUpdateForm.label = this.label;
      expandAttributeUpdateForm.tips = this.tips;
      this.storeConfigMgr.updateExpandAttribute(storeId,expandAttributeUpdateForm).then((restResp:RestResp)=>{
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","保存成功");
          this.action();
          this.closeModal();
        }else{
          AppUtils.showError("提示",restResp.tips);
        }
      })
    }
  }

}

