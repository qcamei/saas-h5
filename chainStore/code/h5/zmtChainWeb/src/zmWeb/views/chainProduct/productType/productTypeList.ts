import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainProductViewDataMgr} from "../chainProductViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {ProductTypeListService, ProductTypeListViewData} from "./productTypeListService";
import {Popup} from "../../common/popup/popup";
import {ChainProductMgr} from "../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductSynDataHolder} from "../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ProductType} from "../../../bsModule/chainProduct/data/ProductType";
import {ChainProduct} from "../../../bsModule/chainProduct/data/ChainProduct";
import {Product} from "../../../bsModule/chainProduct/data/Product";
import {RemoveProductTypeData} from "../../../bsModule/chainProduct/apiData/RemoveProductTypeData";
import {ProductTypeComp} from "./addProductTypeModal";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";


@Component({
  template: `
  <view-body-comp [headerArr]="['项目分类']" >
        <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
        <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
          <div fxLayout="row "  fxLayoutGap="20px" >
            <div  fxFlexAlign="center"  >
              <zm_search_box [label]=" '分类查询'" [placeholder]="'分类名称'" [(zmValue)]="viewData.typeName" (callBack)="queryTypeListByName()"></zm_search_box>
            </div>
          </div>
          <div fxLayout="row "  fxLayoutGap="20px" >
        
            <div fxFlexAlign="center" ><zm_btn_new [name]="'新建'" (zmbtnClick)="newModal()"></zm_btn_new></div>
          </div>
     
        </mat-toolbar-row>
     </mat-toolbar>
     
        <ng-template #tdA let-item="item"> {{item.name}}</ng-template>
        <ng-template #tdB let-item="item">
          <a class="zmCurHand" style="margin-right: 5px;" (click)="compileModal(item.id)">编辑</a>
          <a class="zmCurHand" style="margin-right: 5px;" (click)="deleteType(item)">删除</a>
        </ng-template>
        <zm-mat-table  [tdTemplateList]="[tdA,tdB]" [thNameList]="['分类名称','操作']" [itemList]="viewData.prdTypeListShow"></zm-mat-table>
     
      
      <no_data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.prdTypeListShow" [text]=" '没有数据' " [showImg]="'noData'"></no_data>

      <zm_page [totalSize]="viewData.recordCount" [curPage]="viewData.curPage" (pageChange) = "getPageData($event)"></zm_page>
      
  </view-body-comp>

`,
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class ProductTypeListPage implements OnInit,OnDestroy {

  private service: ProductTypeListService;
  public viewData: ProductTypeListViewData;
  private viewDataSub: any;

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ProductTypeListService(
      this.chainProductMgr,
      this.chainProductSynDataHolder,
      this.chainProductViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.chainProductViewDataMgr.subscribeProductTypeListVD((viewDataP: ProductTypeListViewData) => {
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

    ZmModalMgr.getInstance().newSmallModal(ProductTypeComp, modalData, callBack);
  }

  /**
   * 编辑模态框
   */
  compileModal(typeId) {
    let modalData = {modalHeader: '编辑分类', typeId: typeId};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(ProductTypeComp, modalData, callBack);

  }

  /**
   * 删除项目分类
   */
  deleteType(type: ProductType) {
    let tmp = this;
    Popup.getInstance().open("删除项目分类", "确定删除#" + type.name + "#?", () => {

      //判断项目分类下面是否有项目
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

  private async checkHasUsed(type: ProductType) {
    let canDelete = true;//可以删
    let chainId = SessionUtil.getInstance().getChainId();
    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    let productList: Array<Product> = chainProduct.getValidProductMap().values();
    let typeIds: Array<string> = new Array<string>();
    productList.forEach((item) => {
      typeIds.push(item.typeId);
    });
    if (AppUtils.arrayContains(typeIds, type.id)) {
      canDelete = false;
    }
    return canDelete;
  }

  private removeType(type: ProductType) {
    let removeTypeData = new RemoveProductTypeData();
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
    Popup.getInstance().open("提示", "该分类下还有项目，请移除后再进行删除", () => {
    });
  }


  /**
   * 根据名称查询项目分类 点击事件
   */
  queryTypeListByName() {
    let queryParam = AppUtils.trimBlank(this.viewData.typeName);
    this.service.queryTypeListReq(this.viewData, queryParam, (viewDataTmp: ProductTypeListViewData) => {
      this.handleResult(viewDataTmp)
    });
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    let data = this.viewData.prdTypeListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.prdTypeListShow = pageData;
  }

  private  handleResult(viewDataTmp: ProductTypeListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.prdTypeListTmp = viewDataTmp.prdTypeListTmp;
      this.viewData.recordCount = viewDataTmp.recordCount;
      this.viewData.prdTypeListShow = viewDataTmp.prdTypeListShow;
      this.viewData.curPage = 1;
    }
    this.chainProductViewDataMgr.setProductTypeListViewData(this.viewData);

  }

}






