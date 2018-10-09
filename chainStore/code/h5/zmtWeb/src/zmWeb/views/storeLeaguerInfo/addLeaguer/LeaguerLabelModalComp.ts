import {Component, Input, OnInit, OnDestroy, Output, ViewChild, ElementRef, Renderer2, Inject} from '@angular/core';

import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LeaguerLabelAddForm} from "../../../bsModule/storeLeaguerInfo/apiData/LeaguerLabelAddForm";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 会员标签模态框
 */
@Component({
  selector: 'leaguer-label-modal',
  template: `

              <div animation-modal>
                  <h2 mat-dialog-title>
                    添加标签
                  </h2>
                  <mat-dialog-content>
                        <div class="tags" style="margin-bottom:40px;">
                              <p *ngFor="let tag of selectedLabelArr;let i=index" class="dib pos-r  cur-hand" style="padding-right: 5px; padding-top:5px; margin-right:10px;">
                                  <span class="dib fz-14 text-center tag" >{{tag}}</span>
                                  <img (click)="deleteTag(i)" class="pos-a cur-hand" style="width:14px; height:14px; top:0; right:0; " src="assets/images/icon/deleteTag.png"/>    
                              </p >
                        </div>
                        <div style="margin-bottom:40px;">
                          <div class="tagInput disFlex">
                            <input class="form-control" type="text" style="width:280px;border-right: none;border-top-right-radius: 0;border-bottom-right-radius: 0;" [(ngModel)]="labelName" (ngModelChange)="filterLabel($event)">
                            <button type="button" class="btn c-btn-blue c-btn-modal" style="border-top-left-radius: 0;border-bottom-left-radius: 0;width:120px;" (click)="addTag(labelName)">添加标签</button>
                          </div>
                          <div class="text-danger fz-12" *ngIf="tagValid">
                          <span>标签最多支持8个字，已经超过{{overstr}}个字</span>
                          </div>
                        </div>
                        <div class="historyTags ">
                          <div class="fz-14 mg-b-15" style="color:#999999;" *ngIf="allLabelList.length>0">历史标签</div>
                          <!--<div class="fz-14 mg-b-15" style="color:#999999;" >历史标签</div>-->
                          <p class="dib cur-hand" style="margin-right:10px;" *ngFor="let item of allLabelList;" [class.choose]="checkHas(item)"><span class="dib tag fz-14 text-center" (click)="toogleTab(item.name)">{{item.name}}</span></p>
                        </div>
                  </mat-dialog-content>
                  <mat-dialog-actions fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="end">
                        <button type="button" class="btn c-btn-modal c-close-btn-modal"  style="margin-right: 20px;" (click)="closeModal()">取消</button>
                        <button type="button" class="btn c-btn-blue c-btn-modal" (click)="save()">确定</button>
                  </mat-dialog-actions>
              </div>


                  <!--<div animation-modal>-->
                      <!--<div class="modal-header">-->
                        <!--<h4 class="modal-title">添加标签</h4>-->
                        <!--<button type="button" class="close cur-hand" aria-label="Close" (click)="closeModal()">-->
                          <!--<span aria-hidden="true">&times;</span>-->
                        <!--</button>-->
                      <!--</div>-->
                      <!--<div class="modal-body">-->
                        <!--<div class="tags" style="margin-bottom:40px;">-->
                              <!--<p *ngFor="let tag of selectedLabelArr;let i=index" class="dib pos-r  cur-hand" style="padding-right: 5px; padding-top:5px; margin-right:10px;">-->
                                  <!--<span class="dib fz-14 text-center tag" >{{tag}}</span>-->
                                  <!--<img (click)="deleteTag(i)" class="pos-a cur-hand" style="width:14px; height:14px; top:0; right:0; " src="assets/images/icon/deleteTag.png"/>    -->
                              <!--</p >-->
                        <!--</div>-->
                        <!--<div style="margin-bottom:40px;">-->
                          <!--<div class="tagInput disFlex">-->
                            <!--<input class="form-control" type="text" style="width:280px;border-right: none;border-top-right-radius: 0;border-bottom-right-radius: 0;" [(ngModel)]="labelName" (ngModelChange)="filterLabel($event)">-->
                            <!--<button type="button" class="btn c-btn-blue c-btn-modal" style="border-top-left-radius: 0;border-bottom-left-radius: 0;width:120px;" (click)="addTag(labelName)">添加标签</button>-->
                          <!--</div>-->
                          <!--<div class="text-danger fz-12" *ngIf="tagValid">-->
                          <!--<span>标签最多支持8个字，已经超过{{overstr}}个字</span>-->
                          <!--</div>-->
                        <!--</div>-->
                        <!--<div class="historyTags ">-->
                          <!--<div class="fz-14 mg-b-15" style="color:#999999;" *ngIf="allLabelList.length>0">历史标签</div>-->
                          <!--&lt;!&ndash;<div class="fz-14 mg-b-15" style="color:#999999;" >历史标签</div>&ndash;&gt;-->
                          <!--<p class="dib cur-hand" style="margin-right:10px;" *ngFor="let item of allLabelList;" [class.choose]="checkHas(item)"><span class="dib tag fz-14 text-center" (click)="toogleTab(item.name)">{{item.name}}</span></p>-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="modal-footer">-->
                        <!--<button type="button" class="btn c-btn-modal c-close-btn-modal"  style="margin-right: 20px;" (click)="closeModal()">取消</button>-->
                        <!--<button type="button" class="btn c-btn-blue c-btn-modal" (click)="save()">确定</button>-->
                      <!--</div>-->
                  <!--</div>-->
    
  `,
  styles:[`
    .modal-title{
      font-size: 18px;
      font-weight: bold !important;
      color: #333 !important;
    } 
    .cur-hand{
      cursor: pointer;
    }
    .dib{
      display: inline-block;
    } 
    .text-center {
      text-align: center;
    }
    .c-input-group{
      align-items: center !important;
      .form-control{
        border-radius: 0.375rem !important;
      }
    }
    .form-control{
      padding: 0.75rem 0.75rem;
      border: 2px solid #ced4da;
    }
    .form-control:focus{
      box-shadow: none;
    }
    .fz-14{
      font-size: 14px;
    }
    .fz-12{
      font-size: 12px;
    }
    .pos-r {
      position: relative
    }
    .pos-a {
      position: absolute;
    } 
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .flex {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      -webkit-flex: 1;
         -moz-box-flex: 1;
              flex: 1;
    }
    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    }
    
    .mg-b-15{
      margin-bottom:15px;
    }    
    .c-btn-modal{
      width: 168px;
      padding: 12px 0 !important;
      outline: none;
      cursor: pointer;
    }
    .c-close-btn-modal{
      border: 2px solid#03a9f4 !important;
      color:#03a9f4 !important;
      background-color: #fff;
      cursor: pointer;
    }
    
    .c-btn-blue{
      color: #fff;
      border-color:#03a9f4 !important;
      background-color:#03a9f4 !important;
      cursor: pointer;
    }

    .tag {
      width:auto;
      padding:0 5px;
      height:28px;
      line-height:25px;
      border:2px solid#03a9f4;
      border-radius: 6px;
      color:#03a9f4;
    }
    .historyTags .tag{
      color: #999999;
      border:2px solid #999999;
    }
    .choose .tag{
      border:2px solid#03a9f4;
      color:#03a9f4;
    }
    
  `]
})
export class LeaguerLabelModalComp implements OnInit{

  constructor(
              private storeLeaguerInfoSynDataHolder:StoreLeaguerInfoSynDataHolder,
              private storeLeaguerInfoMgr:StoreLeaguerInfoMgr,
              @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
  }
  private activeModal;
  public operation:OperationEnum;
  public selectedLeaguerLabelList:Array<LeaguerLabel>;
  public action:any;

  public allLabelMap:ZmMap<LeaguerLabel>;
  public allLabelNameMap:ZmMap<LeaguerLabel>;
  public allLabelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();
  public selectedLabelArr:Array<string>;
  public labelName:string;
  public storeLeaguerInfo:StoreLeaguerInfo;
  public tagValid:boolean = false;
  public overstr:number;

  ngOnInit(): void {
    if(this.operation == OperationEnum.ADD){

    }else if(this.operation == OperationEnum.EDIT){

    }
    this.selectedLabelArr = this.selectedLeaguerLabelList.map((item:LeaguerLabel)=>{
      return item.name;
    });
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeLeaguerInfoSynDataHolder.getData(storeId).then((storeLeaguerInfo:StoreLeaguerInfo)=>{
      if(!AppUtils.isNullObj(storeLeaguerInfo)){
        this.storeLeaguerInfo = storeLeaguerInfo;
        this.allLabelMap = this.storeLeaguerInfo.getValidLeaguerLabelMap();
        this.allLabelNameMap = this.storeLeaguerInfo.getValidLeaguerLabelNameMap();
        this.allLabelList = this.storeLeaguerInfo.getValidLeaguerLabelMap().values();
      }
    })
  }

  /**
   * 标签输入监听过滤
   * @param label
   */
  filterLabel(label:string){
    if(!AppUtils.isNullObj(label)){
      label = AppUtils.trimBlank(label);
      if(AppUtils.isNullOrWhiteSpace(label)){
        this.allLabelList = this.allLabelMap.values();
      }else{
        this.allLabelList = this.allLabelMap.values().filter((item:LeaguerLabel)=>{
          if((item.name.indexOf(label) > -1) && !this.hasLabel(item.name)){
            return true;
          }else{
            return false;
          }
        })
      }
    }
    if(label.length>8){
      this.tagValid = true;
      this.overstr = label.length - 8;
    }else{
      this.tagValid = false;
    }
  }

  /**
   * 已选择的标签中是否包含
   * @param label
   * @returns {boolean}
   */
  private hasLabel(label:string):boolean{
    let has = false;
    for(let i=0;i<this.selectedLabelArr.length;i++){
      if(this.selectedLabelArr.indexOf(label) > -1){
        has = true;
        break;
      }
    }
    return has;
  }

  /**
   * 添加标签事件
   * @param label
   */
  addTag(label:string){
    if(AppUtils.isNullObj(label) || AppUtils.isNullOrWhiteSpace(label)){
      AppUtils.showWarn("提示","标签不能为空");
    }else if(label.length>8){
      AppUtils.showWarn("提示","标签最多支持8个字");
    }else if(this.allLabelNameMap.contains(label)){//已包含
      if(this.selectedLabelArr.indexOf(label) == -1){
        this.selectedLabelArr.push(label);
      }else{
        let index = this.selectedLabelArr.indexOf(label);
        if(index > -1){
          this.selectedLabelArr.splice(index,1);
          this.selectedLabelArr.push(label);
        }
      }
      this.labelName = undefined;
      this.allLabelList = this.allLabelMap.values();
    }else{
        label = AppUtils.trimBlank(label);
        let storeId = SessionUtil.getInstance().getStoreId();
        let leaguerLabelAddForm = new LeaguerLabelAddForm();
        leaguerLabelAddForm.index = (parseInt(this.storeLeaguerInfo.labelIndex.toString())+1).toString();
        leaguerLabelAddForm.name = label;
        this.storeLeaguerInfoMgr.addLeaguerLabel(storeId,leaguerLabelAddForm).then((success:boolean)=>{
          if(success){
            AppUtils.showSuccess("提示","添加成功");
            this.selectedLabelArr.push(label);
            this.labelName = undefined;
            //刷新会员标签数据
            this.storeLeaguerInfoSynDataHolder.getData(storeId).then((storeLeaguerInfo:StoreLeaguerInfo)=>{
              this.storeLeaguerInfo = storeLeaguerInfo;
              this.allLabelMap = this.storeLeaguerInfo.getValidLeaguerLabelMap();
              this.allLabelNameMap = this.storeLeaguerInfo.getValidLeaguerLabelNameMap();
              this.allLabelList = this.storeLeaguerInfo.getValidLeaguerLabelMap().values();
            })
          }else{
            AppUtils.showSuccess("提示","添加失败");
          }
        })
    }
  }

  /**
   * 删除标签
   * @param index
   */
  deleteTag(index:number){
    this.selectedLabelArr.splice(index,1);
  }

  /**
   * 点击历史标签
   * @param label
   */
  toogleTab(label:string){
    if(this.selectedLabelArr.indexOf(label) > -1){//已选标签包含则删除
      this.selectedLabelArr.splice(this.selectedLabelArr.indexOf(label),1);
    }else{//不包含则添加
      this.selectedLabelArr.push(label);
    }
  }

  /**
   * 是否已选择该标签
   * @param item
   * @returns {boolean}
   */
  checkHas(item:LeaguerLabel):boolean{
    if(this.selectedLabelArr.indexOf(item.name) > -1){
      return true;
    }else{
      return false;
    }
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
    if(this.operation == OperationEnum.ADD){
    }else if(this.operation == OperationEnum.EDIT){
    }
    this.selectedLeaguerLabelList = this.selectedLabelArr.map((item:string)=>{
      return this.allLabelNameMap.get(item);
    });
    this.action(this.selectedLeaguerLabelList);
    this.closeModal();
  }

}

