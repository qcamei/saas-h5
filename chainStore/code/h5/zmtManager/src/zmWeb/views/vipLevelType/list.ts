import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VipLevelTypeListService, VipLevelTypeListViewData} from "./listService";
import {Popup} from "../common/popup/popup";
import {VipLevelType} from "../../bsModule/vipLevelType/data/VipLevelType";
import {VipLevelTypeMgr} from "../../bsModule/vipLevelType/VipLevelTypeMgr";
import {VipLevelTypeViewDataMgr} from "./vipLevelTypeViewDataMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {VipLevelTypeComp} from "./comp/VipLevelTypeComp";
import {Constants} from "../common/Util/Constants";
import {VipLevel} from "../../bsModule/vipLevel/data/VipLevel";
import {VipLevelMgr} from "../../bsModule/vipLevel/VipLevelMgr";
import {QueryVipLevelForm} from "../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {PageResp} from "../../comModule/PageResp";
import {RemoveVipLevelTypeForm} from "../../bsModule/vipLevelType/apiData/RemoveVipLevelTypeForm";


@Component({
  template: `
<view-header-comp [headerArr]="['等级分类']"></view-header-comp>
<view-body-comp>
  <content>
    <div class="d-flex justify-content-between mb-3">
      <zm_search_box [label]=" '分类查询'" [placeholder]="'分类名称'" [(zmValue)]="viewData.name"
                     (callBack)="queryListByName()"></zm_search_box>
      <zm_btn_new [name]="'新建'" (zmbtnClick)="newModal()"></zm_btn_new>
    </div>

    <zm_table>
      <thead class="bg-th">
      <th>序号</th>
      <th width="30%">分类名称</th>
      <th>操作</th>
      </thead>
      <tbody>
      <tr *ngFor="let item of viewData.typeList;let i = index;">
        <td>{{i+1}}</td>
        <td>{{item.name}}</td>
        <td>
          <span class="mr-2 text-primary cur-hand" (click)="compileModal(item.id)">编辑</span>
          <span class="text-primary cur-hand" (click)="deleteType(item)">删除</span>
        </td>
      </tr>
      </tbody>
    </zm_table>

    <no_data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.typeList" [text]="'没有数据'"
             [showImg]="'noData'"></no_data>
    <pagination-comp [recordCount]="viewData.recordCount" [page]="viewData.curPage"
                     (callback)="getPageData($event)"></pagination-comp>
  </content>
</view-body-comp>

`,
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class VipLevelTypeListPage implements OnInit,OnDestroy {

  private service: VipLevelTypeListService;
  public viewData: VipLevelTypeListViewData;
  private viewDataSub: any;

  constructor(private modalService: NgbModal,
              private vipLevelTypeMgr:VipLevelTypeMgr,
              private vipLevelMgr:VipLevelMgr,
              private vipLevelTypeViewDataMgr:VipLevelTypeViewDataMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new VipLevelTypeListService(
      this.vipLevelTypeMgr,
      this.vipLevelTypeViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.vipLevelTypeViewDataMgr.subscribeVipLevelTypeListVD((viewDataP: VipLevelTypeListViewData) => {
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
  newModal() {
    const activeModal = this.modalService.open(VipLevelTypeComp, {backdrop: 'static'});
    activeModal.componentInstance.modalHeader = '新建分类';
    let tmp = this;
    activeModal.componentInstance.callback = () => {
      tmp.service.initViewData();//回调刷新列表
    };
  }

  /**
   * 编辑模态框
   */
  compileModal(typeId) {
    const activeModal = this.modalService.open(VipLevelTypeComp, {backdrop: 'static'});
    activeModal.componentInstance.modalHeader = '编辑分类';
    activeModal.componentInstance.typeId = typeId;
    let tmp = this;
    activeModal.componentInstance.callback = () => {
      tmp.service.initViewData();//回调刷新列表
    };
  }


  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.getPageData(curPage,this.viewData);
  }

  queryListByName(){
    if (!AppUtils.isNullObj(this.viewData.name)) {
      this.viewData.name = AppUtils.trimBlank(this.viewData.name);
    }
    this.service.getPageData(Constants.DEFAULT_PAGENO, this.viewData);
  }

  /**
   * 删除项目分类
   */
  deleteType(type:VipLevelType) {
    let tmp = this;
    Popup.getInstance().open("删除等级分类", "确定删除#"+type.name+"#?", () => {

      //判断项目分类下面是否有项目
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

  private async checkHasUsed(type:VipLevelType){
    let canDelete = true;//可以删
    let queryForm:QueryVipLevelForm = new QueryVipLevelForm();
    let pageResp:PageResp = await this.vipLevelMgr.getAllList(queryForm);

    let typeIds:Array<string> = new Array<string>();
    if(pageResp && pageResp.list && pageResp.list.length>0){
      pageResp.list.forEach((item)=>{
        typeIds.push(item.typeId);
      });
    }

    if(AppUtils.arrayContains(typeIds,type.id)){
      canDelete = false;
    }
    return canDelete;
  }

  private removeType(type:VipLevelType){
    let removeTypeForm = new RemoveVipLevelTypeForm();
    removeTypeForm.id = type.id;
    this.vipLevelTypeMgr.removeVipLevelType(removeTypeForm).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess("提示", "删除成功");
          this.service.initViewData();
        } else {
          AppUtils.showError("提示", "删除失败");
        }
      }
    );
  }

  private showMsg(){
    Popup.getInstance().open("提示", "该分类下还有项目，请移除后再进行删除", () => {});
  }



}






