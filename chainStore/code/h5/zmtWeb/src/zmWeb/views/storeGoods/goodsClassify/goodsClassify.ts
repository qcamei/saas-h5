import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {StoreGoodsMgr} from '../../../bsModule/storeGoods/StoreGoodsMgr';
import {StoreGoodsViewDataMgr} from '../StoreGoodsViewDataMgr';
import {GoodsType} from '../../../bsModule/storeGoods/data/GoodsType';
import {AppUtils} from '../../../comModule/AppUtils';
import {ModalComponent} from './goodsClassifyModalComp';
import {GoodsTypeRemoveForm} from '../../../bsModule/storeGoods/apiData/GoodsTypeRemoveForm';
import {BusinessUtil} from '../../common/Util/BusinessUtil';
import {PromptMsg} from "../../common/Util/PromptMsg";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {Popup} from "../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

@Component({
  selector: 'goodsClassify',
  template: `
    <view-body-comp [headerArr]="['商品分类']">

  <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
    <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
      <zm-search-box [label]=" '分类查询'" [placeholder]="'分类名称'" [(zmValue)]="typeName" (callBack)="queryTypeListByName()"></zm-search-box>
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

  <zm-mat-table  [tdTemplateList]="[tdA,tdB]" [thNameList]="['分类名称','操作']" [itemList]="viewData.goodsTypeListShow"></zm-mat-table>


  <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.goodsTypeListShow" [text]=" '没有数据'" [showImg]="'noData'"></no-data>
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

export class GoodsClassify implements OnInit,OnDestroy {
  private service: StoreGoodsTypeListService;
  public viewData: StoreGoodsTypeListViewData;
  private viewDataSub: any;
  typeName:string;//查询输入框的值
  private storeId = SessionUtil.getInstance().getStoreId();

  constructor(
              private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsSynDataholder:StoreGoodsSynDataHolder,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new StoreGoodsTypeListService(this.storeGoodsMgr, this.storeGoodsViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.storeGoodsViewDataMgr.subscribeStoreGoodsTypeListVD((viewDataP: StoreGoodsTypeListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy() {

  }

  //新建模态框
  newModal() {
    // const activeModal = this.modalService.open(ModalComponent,{backdrop:'static'});
    // activeModal.componentInstance.modalHeader = '新建分类';
    // let tmp = this;
    // activeModal.componentInstance.modalCloseFunc = () => {
    //   tmp.service.initViewData();//回调刷新列表
    // };

    let modalData = {modalHeader: '新建分类'};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };

    ZmModalMgr.getInstance().newSmallModal(ModalComponent,modalData,callBack);
  }

  //编辑模态框
  compileModal(typeId:string) {
    // const activeModal = this.modalService.open(ModalComponent,{backdrop:'static'});
    // activeModal.componentInstance.modalHeader = '编辑分类';
    // activeModal.componentInstance.typeId = typeId;
    // let tmp = this;
    // activeModal.componentInstance.modalCloseFunc = () => {
    //   tmp.service.initViewData();//回调刷新列表
    // };

    let modalData = {modalHeader: '编辑分类',typeId:typeId};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };

    ZmModalMgr.getInstance().newSmallModal(ModalComponent,modalData,callBack);
  }

  public deleteType(type:GoodsType) {
    let tmp = this;
    Popup.getInstance().open("删除商品分类", "确定删除#"+type.name+"#?", () => {

      //判断商品分类下面是否有商品
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
  private async checkHasUsed(type:GoodsType){
    let canDelete = true;//可以删
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeGoods:StoreGoods = await this.storeGoodsSynDataholder.getData(storeId);
    let goodsList: Array<Goods> = storeGoods.getValidGoodsList();
    let typeIds:Array<string> = new Array<string>();
    goodsList.forEach((item)=>{
      typeIds.push(item.typeId);
    });
    if(AppUtils.arrayContains(typeIds,type.id)){
      canDelete = false;
    }
    return canDelete;
  }

  private removeType(type:GoodsType){
    let removeTypeData = new GoodsTypeRemoveForm();
    removeTypeData.goodsTypeId = type.id;
    removeTypeData.storeId = this.storeId;
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
    Popup.getInstance().open("提示", "该分类下还有商品，请移除后再进行删除", () => {});
  }

  /**
   * 根据名称查询商品分类 (支持模糊查询)
   */
  queryTypeListByName() {
    this.service.queryTypeListReq(this.viewData, this.typeName, (viewDataTmp) => {
      this.handleResult(viewDataTmp);
    });
  }

  private  handleResult(viewDataTmp: StoreGoodsTypeListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.goodsTypeListTmp = viewDataTmp.goodsTypeListTmp;
      this.viewData.recordCount = viewDataTmp.recordCount;
      this.viewData.goodsTypeListShow = viewDataTmp.goodsTypeListShow;
      this.viewData.curPage = 1;
    }
    this.storeGoodsViewDataMgr.setStoreGoodsTypeListViewData(this.viewData);

  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    let data = this.viewData.goodsTypeListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.goodsTypeListShow = pageData;
  }


}

export class StoreGoodsTypeListViewData {
  goodsTypeList: Array<GoodsType> = new Array<GoodsType>();
  goodsTypeListTmp: Array<GoodsType> = new Array<GoodsType>();//临时数据
  recordCount: number;//分页记录数
  goodsTypeListShow: Array<GoodsType> = new Array<GoodsType>();//显示数据

  loadingFinish: boolean = false;
  public curPage = 1;


}


class StoreGoodsTypeListService {

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr) {
  }

  public initViewData() {
    this.storeGoodsViewDataMgr.setStoreGoodsTypeListViewData(new StoreGoodsTypeListViewData());

    let storeId = SessionUtil.getInstance().getStoreId();
    this.buildViewData(storeId).then(
      (viewDataTmp: StoreGoodsTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: StoreGoodsTypeListViewData) {
    this.storeGoodsViewDataMgr.setStoreGoodsTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StoreGoodsTypeListViewData>
   */
  public  buildViewData(storeId: string): Promise<StoreGoodsTypeListViewData> {
    return new Promise<StoreGoodsTypeListViewData>(resolve => {
      let goodsTypeListTmp: Array<GoodsType> = new Array<GoodsType>();
      let viewDataTmp: StoreGoodsTypeListViewData = new StoreGoodsTypeListViewData();
      this.storeGoodsMgr.getStoreGoods(storeId).then(
        (storeGoods) => {
          goodsTypeListTmp = storeGoods.getValidGoodsTypeList();
          viewDataTmp.goodsTypeList = goodsTypeListTmp;//原始数据
          goodsTypeListTmp = BusinessUtil.sortListObject(goodsTypeListTmp);//排序
          viewDataTmp.goodsTypeListTmp = goodsTypeListTmp;
          viewDataTmp.recordCount = goodsTypeListTmp.length;
          viewDataTmp.goodsTypeListShow = AppUtils.getPageData(1, goodsTypeListTmp);
          viewDataTmp.loadingFinish = true;
          resolve(viewDataTmp);
        }
      );
    });
  };

  /**
   * 根据名称查询分类列表
   * @param storeId:string
   * @param name:string
   * @param handleCallBack:(goodsTypeListTmp:Array<GoodsType>)
   **/

  public async queryTypeListReq(viewData:StoreGoodsTypeListViewData, name: string, handleCallBack: (viewDataTmp: StoreGoodsTypeListViewData) => void) {
    name = AppUtils.trimBlank(name);
    let viewDataTmp: StoreGoodsTypeListViewData = new StoreGoodsTypeListViewData();
    let goodsTypeListTmp: Array<GoodsType> = this.filterByName(viewData.goodsTypeList, name);
    goodsTypeListTmp = BusinessUtil.sortListObject(goodsTypeListTmp);//排序
    viewDataTmp.goodsTypeListTmp = goodsTypeListTmp;
    viewDataTmp.recordCount = goodsTypeListTmp.length;
    viewDataTmp.goodsTypeListShow = AppUtils.getPageData(1, goodsTypeListTmp);
    handleCallBack(viewDataTmp);
  };

  /**根据名称过滤商品分类列表*/
  private filterByName(goodsTypeList: Array<GoodsType>, name: string) {
    let goodsTypeListTmp: Array<GoodsType> = new Array<GoodsType>();
    goodsTypeListTmp = goodsTypeList.filter(itemTmp => {
      if (itemTmp.name.indexOf(name) != -1) {
        return true;
      } else {
        return false;
      }
    });
    return goodsTypeListTmp;
  }

  public deleteType(removeForm: GoodsTypeRemoveForm) {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise<boolean>(resolve => {
      this.storeGoodsMgr.deleteGoodsType(storeId, removeForm).then(
        (success) => {
          resolve(success);
        });

    });
  }

}
