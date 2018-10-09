import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";

import {ProductCardTypeListService, ProductCardTypeListViewData} from "./productCardTypListService";
import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {AppUtils} from "../../../../comModule/AppUtils";
import {AddProductCardTypeModal} from "./addProductCardTypeCompl";
import {Popup} from "../../../common/popup/popup";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {PrdCardTypeRemoveForm} from "../../../../bsModule/storeCardInfo/apiData/PrdCardTypeRemoveForm";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {ProductCard} from "../../../../bsModule/storeCardInfo/data/ProductCard";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";



@Component({
  template: `
  <view-body-comp [headerArr]="['次卡分类']" >
        <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
            <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
               <zm-search-box [label]=" '分类查询'" [placeholder]="'分类名称'" [(zmValue)]="viewData.typeName" (callBack)="queryTypeListByName()"></zm-search-box>
              <zm-btn-new [name]="'新建'" (zmbtnClick)="newModal()"></zm-btn-new>
            </mat-toolbar-row>
        </mat-toolbar>
        
        <ng-template #tdA let-item="item" style="position: relative;">
          <span *ngIf="item.origin==1" class="px-8 mr-8 chainMark">总部</span>{{item.name}}
        </ng-template>
        <ng-template #tdB let-item="item">
          <a class="zmCurHand" style="margin-right: 5px;" (click)="compileModal(item.id)">编辑</a>
          <a class="zmCurHand" style="margin-right: 5px;"  (click)="deleteType(item)">删除</a>
        </ng-template>

        <zm-mat-table  [tdTemplateList]="[tdA,tdB]" [thNameList]="['分类名称','操作']" [itemList]="viewData.productCardTypeListShow"></zm-mat-table>
    
        <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.productCardTypeListShow" [text]="'没有数据'" [showImg]="'noData'"></no-data>
       <zm-page [totalSize]="viewData.recordCount" [curPage]="viewData.curPage" (pageChange) = "getPageData($event)"></zm-page>
   
  </view-body-comp>     
        <!--<div class="d-flex justify-content-between mb-3">-->
            <!--<zm-search-box [label]=" '分类查询'" [placeholder]="'分类名称'" [(zmValue)]="viewData.typeName" (callBack)="queryTypeListByName()"></zm-search-box>-->
            <!--<zm-btn-new [name]="'新建'" (zmbtnClick)="newModal()"></zm-btn-new>-->
        <!--</div>-->
        <!---->
        <!--<zm-table>-->
            <!--<thead  class="bg-th">-->
                <!--<th>序号</th>-->
                <!--<th width="30%">分类名称</th>-->
                <!--<th>操作</th>-->
            <!--</thead>-->
          <!--<tbody>-->
              <!--<tr *ngFor="let item of viewData.productCardTypeListShow;let i = index;">-->
                 <!--<td >{{i+1}}</td>-->
                <!--<td>{{item.name}}</td>-->
                  <!--<td>-->
                    <!--<span   class="mr-2 text-primary cur-hand" (click)="compileModal(item.id)">编辑</span>-->
                    <!--<span   class="text-primary cur-hand" (click)="deleteType(item)">删除</span>-->
                  <!--</td>-->
              <!--</tr>-->
          <!--</tbody>-->
        <!--</zm-table>-->
        


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

export class ProductCardTypeListPage implements OnInit,OnDestroy {

  private service: ProductCardTypeListService;
  public viewData: ProductCardTypeListViewData;
  private viewDataSub: any;

  constructor(
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ProductCardTypeListService(this.storeCardInfoMgr, this.storeCardInfoSynDataHolder, this.storeCardInfoViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeProductCardTypeListVD((viewDataP: ProductCardTypeListViewData) => {
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
    // const activeModal = this.modalService.open(AddProductCardTypeModal, {backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newSmallModal(AddProductCardTypeModal,null,null);
    activeModal.componentInstance.modalHeader = '新建分类';
    let tmp = this;
    activeModal.componentInstance.addFunc = () => {
      tmp.service.initViewData();//回调刷新列表
    };

  }

  /**
   * 编辑模态框
   */
  compileModal(typeId) {
    // const activeModal = this.modalService.open(AddProductCardTypeModal, {backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newSmallModal(AddProductCardTypeModal,null,null);
    activeModal.componentInstance.modalHeader = '编辑分类';
    activeModal.componentInstance.typeId = typeId;
    let tmp = this;
    activeModal.componentInstance.editFunc = () => {
      tmp.service.initViewData();//回调刷新列表
    };

  }

  /**
   * 删除次卡分类
   */
  deleteType(type:PrdCardType) {
    let tmp = this;
    Popup.getInstance().open("删除次卡分类", "确定删除#"+type.name+"#?", () => {

      //判断次卡分类下面是否有次卡
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

  private async checkHasUsed(type:PrdCardType){
    let canDelete = true;//可以删
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    let productCardList: Array<ProductCard> = storeCardInfo.getValidProductCardMap().values();
    let typeIds:Array<string> = new Array<string>();
    productCardList.forEach((item)=>{
      typeIds.push(item.typeId);
    });
    if(AppUtils.arrayContains(typeIds,type.id)){
      canDelete = false;
    }
    return canDelete;
  }

  private removeType(type:PrdCardType){
    let storeId = SessionUtil.getInstance().getStoreId();
    let removeTypeData = new PrdCardTypeRemoveForm();
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
    Popup.getInstance().open("提示", "该分类下还有次卡，请移除后再进行删除", () => {});
  }


  /**
   * 根据名称查询次卡分类 点击事件
   */
  queryTypeListByName() {
    let queryParam = AppUtils.trimBlank(this.viewData.typeName);
    this.service.queryTypeListReq(this.viewData, queryParam, (viewDataTmp: ProductCardTypeListViewData) => {
      this.handleResult(viewDataTmp)
    });
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    let data = this.viewData.productCardTypeListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.productCardTypeListShow = pageData;
  }

  private  handleResult(viewDataTmp: ProductCardTypeListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.productCardTypeListTmp = viewDataTmp.productCardTypeListTmp;
      this.viewData.recordCount = viewDataTmp.recordCount;
      this.viewData.productCardTypeListShow = viewDataTmp.productCardTypeListShow;
      this.viewData.curPage = 1;
    }
    this.storeCardInfoViewDataMgr.setProductCardTypeListViewData(this.viewData);

  }

}






