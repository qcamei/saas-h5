import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";

import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {AppUtils} from "../../../comModule/AppUtils";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {PackageProjectTypeRemoveForm} from "../../../bsModule/storePackageProject/apiData/PackageProjectTypeRemoveForm";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {AddPackageTypeComponent} from "./addPackageTypeModal";
import {PackageTypeListService, PackageTypeListViewData} from "./packageTypeListService";
import {StorePackageProjectViewDataMgr} from "../StorePackageProjectViewDataMgr";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProjectMgr} from "../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {Popup} from "../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";


@Component({
  template: `
  <view-body-comp [headerArr]="['套餐分类']">
        <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
            <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
              <zm-search-box [label]=" '分类查询'" [placeholder]="'分类名称'" [(zmValue)]="viewData.typeName" (callBack)="queryTypeListByName()"></zm-search-box>
              <zm-btn-new [name]="'新建'" (zmbtnClick)="addPackageType()"></zm-btn-new>
            </mat-toolbar-row>
        </mat-toolbar>
        
        <ng-template #tdA let-item="item" style="position: relative">
          <span *ngIf="item.origin==1" class="px-8 mr-8 chainMark" >总部</span>{{item.name}}
        </ng-template>
        <ng-template #tdB let-item="item">
          <a class="zmCurHand" style="margin-right: 5px;" (click)="editPackageType(item.id)">编辑</a>
          <a class="zmCurHand" style="margin-right: 5px;"  (click)="deleteType(item)">删除</a>
        </ng-template>

        <zm-mat-table  [tdTemplateList]="[tdA,tdB]" [thNameList]="['分类名称','操作']" [itemList]="viewData.packageTypeListShow"></zm-mat-table>

    
        <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.packageTypeListShow" [text]="'没有数据'" [showImg]="'noData'"></no-data>
        <zm-page [totalSize]="viewData.recordCount" [curPage]="viewData.curPage" (pageChange) = "getPageData($event)"></zm-page>
  </view-body-comp>

`,
  styles:[`
  .chainMark{
      border-radius:20px;
      background:#03a9f4;
      color:#ffffff;
      position: absolute;
       top:auto;
       left:100px
    }  

  `],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class PackageTypeListComp implements OnInit,OnDestroy {

  private service: PackageTypeListService;
  public viewData: PackageTypeListViewData;
  private viewDataSub: any;

  constructor(
              private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new PackageTypeListService(this.storePackageProjectMgr, this.storePackageProjectViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.storePackageProjectViewDataMgr.subscribePackageTypeListVD((viewDataP: PackageTypeListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy() {

    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }

  }

  /**
   * 新建模态框
   */
  addPackageType() {
    // const activeModal = this.modalService.open(AddPackageTypeComponent, {backdrop: 'static'});
    // activeModal.componentInstance.modalHeader = '新建分类';
    // let tmp = this;
    // activeModal.componentInstance.addFunc = () => {
    //   tmp.service.initViewData();//回调刷新列表
    // };

    let modalData = {modalHeader: '新建分类'};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };

    ZmModalMgr.getInstance().newSmallModal(AddPackageTypeComponent,modalData,callBack);
  }

  /**
   * 编辑模态框
   */
  editPackageType(typeId) {
    // const activeModal = this.modalService.open(AddPackageTypeComponent, {backdrop: 'static'});
    // activeModal.componentInstance.modalHeader = '编辑分类';
    // activeModal.componentInstance.typeId = typeId;
    // let tmp = this;
    // activeModal.componentInstance.editFunc = () => {
    //   tmp.service.initViewData();//回调刷新列表
    // };

    let modalData = {modalHeader: '编辑分类',typeId:typeId};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };

    ZmModalMgr.getInstance().newSmallModal(AddPackageTypeComponent,modalData,callBack);
  }

  /**
   * 删除套餐分类
   */
  deleteType(type:PackageProjectType) {
    let tmp = this;
    Popup.getInstance().open("删除套餐分类", "确定删除#"+type.name+"#?", () => {

      //判断套餐分类下面是否有套餐
      this.checkHasUsed(type).then(
        (canDelete)=>{
          if(canDelete){//true
            tmp.removeType(type);
          }else{
            tmp.showMsg();
          }
        }
      );

    });

  }

  private async checkHasUsed(type:PackageProjectType){
    let canDelete = true;//可以删
    let storeId = SessionUtil.getInstance().getStoreId();
    let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    let packageProjectList: Array<PackageProject> = storePackageProject.getValidPackageProjectMap().values();
    let typeIds:Array<string> = new Array<string>();
    packageProjectList.forEach((item)=>{
      typeIds.push(item.typeId);
    });
    if(AppUtils.arrayContains(typeIds,type.id)){
      canDelete = false;
    }
    return canDelete;
  }

  private removeType(type:PackageProjectType){
    let removeTypeData = new PackageProjectTypeRemoveForm();
    removeTypeData.id = type.id;
    this.service.deleteType(removeTypeData).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE_SUCCESS);
          this.service.initViewData();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE_ERROR);
        }
      }
    );
  }

  private showMsg(){
    Popup.getInstance().open("提示", "该分类下还有套餐，请移除后再进行删除", () => {});
  }


  /**
   * 根据名称查询套餐分类 点击事件
   */
  queryTypeListByName() {
    let queryParam = AppUtils.trimBlank(this.viewData.typeName);
    this.service.queryTypeListReq(this.viewData, queryParam, (viewDataTmp: PackageTypeListViewData) => {
      this.handleResult(viewDataTmp)
    });
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    let data = this.viewData.packageTypeListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.packageTypeListShow = pageData;
  }

  private  handleResult(viewDataTmp: PackageTypeListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.packageTypeListTmp = viewDataTmp.packageTypeListTmp;
      this.viewData.recordCount = viewDataTmp.recordCount;
      this.viewData.packageTypeListShow = viewDataTmp.packageTypeListShow;
      this.viewData.curPage = 1;
    }
    this.storePackageProjectViewDataMgr.setPackageTypeListViewData(this.viewData);

  }

}




