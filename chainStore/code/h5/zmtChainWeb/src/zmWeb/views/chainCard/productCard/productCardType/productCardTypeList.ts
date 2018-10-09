import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";
import {ProductCardTypeListService, ProductCardTypeListViewData} from "./productCardTypListService";
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {AppUtils} from "../../../../comModule/AppUtils";
import {AddProductCardTypeModal} from "./addProductCardTypeCompl";
import {Popup} from "../../../common/popup/popup";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {PrdCardTypeRemoveForm} from "../../../../bsModule/chainCard/apiData/PrdCardTypeRemoveForm";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {ProductCard} from "../../../../bsModule/chainCard/data/ProductCard";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";


@Component({
  template: `
<view-body-comp [headerArr]="['次卡分类']" >
        <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
            <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
               <zm_search_box [label]=" '分类查询'" [placeholder]="'分类名称'" [(zmValue)]="viewData.typeName" (callBack)="queryTypeListByName()"></zm_search_box>
              <zm_btn_new [name]="'新建'" (zmbtnClick)="newModal()"></zm_btn_new>
            </mat-toolbar-row>
        </mat-toolbar>
        
        <ng-template #tdA let-item="item">{{item.name}}</ng-template>
        <ng-template #tdB let-item="item">
          <a class="zmCurHand" style="margin-right: 5px;" (click)="compileModal(item.id)">编辑</a>
          <a class="zmCurHand" style="margin-right: 5px;"  (click)="deleteType(item)">删除</a>
        </ng-template>

        <zm-mat-table  [tdTemplateList]="[tdA,tdB]" [thNameList]="['分类名称','操作']" [itemList]="viewData.productCardTypeListShow"></zm-mat-table>
    
        <no_data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.productCardTypeListShow" [text]="'没有数据'" [showImg]="'noData'"></no_data>
       <zm_page [totalSize]="viewData.recordCount" [curPage]="viewData.curPage" (pageChange) = "getPageData($event)"></zm_page>
   
  </view-body-comp>     

`,
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class ProductCardTypeListPage implements OnInit,OnDestroy {

  private service: ProductCardTypeListService;
  public viewData: ProductCardTypeListViewData;
  private viewDataSub: any;

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new ProductCardTypeListService(this.chainCardMgr, this.chainCardSynDataHolder, this.chainCardViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.chainCardViewDataMgr.subscribeProductCardTypeListVD((viewDataP: ProductCardTypeListViewData) => {
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
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddProductCardTypeModal,modalData,callBack);

  }

  /**
   * 编辑模态框
   */
  compileModal(typeId) {
    let modalData = {modalHeader: '新建分类',typeId:typeId};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddProductCardTypeModal,modalData,callBack);
  }

  /**
   * 删除次卡分类
   */
  deleteType(type: PrdCardType) {
    let tmp = this;
    Popup.getInstance().open("删除次卡分类", "确定删除#" + type.name + "#?", () => {

      //判断次卡分类下面是否有次卡
      this.checkHasUsed(type).then(
        (canDelete) => {
          if (canDelete) {//true
            tmp.removeType(type);
          } else {
            tmp.showMsg();
          }
        }
      );

    });

  }

  private async checkHasUsed(type: PrdCardType) {
    let canDelete = true;//可以删
    let chainId = SessionUtil.getInstance().getChainId();
    let chainCard: ChainCard = await this.chainCardSynDataHolder.getData(chainId);
    let productCardList: Array<ProductCard> = chainCard.getValidProductCardMap().values();
    let typeIds: Array<string> = new Array<string>();
    productCardList.forEach((item) => {
      typeIds.push(item.typeId);
    });
    if (AppUtils.arrayContains(typeIds, type.id)) {
      canDelete = false;
    }
    return canDelete;
  }

  private removeType(type: PrdCardType) {
    let chainId = SessionUtil.getInstance().getChainId();
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

  private showMsg() {
    Popup.getInstance().open("提示", "该分类下还有次卡，请移除后再进行删除", () => {
    });
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
    this.chainCardViewDataMgr.setProductCardTypeListViewData(this.viewData);

  }

}






