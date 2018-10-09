import {
  Component, OnInit, Input, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, Output,
  EventEmitter
} from '@angular/core';
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {PageResp} from "../../../../comModule/PageResp";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {LeaguerRecord} from "../../../../bsModule/leaguerRecord/data/LeaguerRecord";
import {LeaguerRecordQueryForm} from "../../../../bsModule/leaguerRecord/apiData/LeaguerRecordQueryForm";
import {Popup} from "../../../common/popup/popup";
import {LeaguerRecordMgr} from "../../../../bsModule/leaguerRecord/LeaguerRecordMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {RecordListViewDataMgr} from "./recordListViewDataMgr";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

/**
 * 流程跟进记录列表组件 新建编辑弹框
 */
@Component({
  selector: 'record-list-comp',
  template: `
        <mat-toolbar style="padding-top:15px;margin-top:15px;margin-bottom:15px;">
          <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" class="zmFullWidth">
            <span>跟进记录</span>
            <zm-btn-new [name]="'新建'"  (zmbtnClick)="addRecord()"></zm-btn-new>
          </mat-toolbar-row>
        </mat-toolbar>
          
          <div style="margin:20px 0px 20px 0px;" *ngFor="let item of viewData.leaguerRecordList">
              <div class="disFlex mb-3 fz-14" style="justify-content: space-between;">
                <div class="disFlex">
                  <span>{{item.createdTime | times}}</span>
                  <span class="mg-l-30 ml-4">{{item.creatorName}}</span>
                  
                  <span class="ml-4" *ngIf="item.relateOrder&&(item.relateOrder.orderId>0)" >关联订单：
                    <span style="color:#4678fa;" matTooltip="{{item.relateOrder.orderContent}}">{{item.relateOrder.orderContent}}</span>
                  </span>
                  
                  <div class="mg-l-30 ml-4" *ngIf="item.relateProduct&&item.relateProduct.prdIds&&(item.relateProduct.prdIds.length>0)">
                    关联项目：
                    <span style="width:30px;color:#03a9f4; margin-right:5px;" matTooltip="{{getRelateProduct(item.id).length>0?getRelateProduct(item.id).join('、'):''}}">{{getRelateProduct(item.id).length>0?getRelateProduct(item.id)[0]:"-"}}</span>
                    
                    <!--<span style="color:#4678fa; margin-right:5px;" *ngFor="let prdName of getRelateProduct(item.id)|slice:0:3; let i = index;">{{prdName}}</span>-->
                    <!--<b *ngIf="getRelateProduct(item.id)&&getRelateProduct(item.id).length>3" style="margin-left:-6px;color:#4678fa;">....</b>-->
                  </div>
                </div>

                <span fxLayout="row"fxLayoutGap="5px">
                  <a style="color:#4678fa;cursor: pointer" (click)="goEditRecordInfo(item.id)">编辑</a>
                  <a style="color:#4678fa;cursor: pointer" (click)="deleteRecordInfo(item.id)">删除</a>
                </span>
              </div>
              <div class="content fz-14 mb-3">
                <div><blockquote><p>{{item.content}}</p></blockquote></div>
                <zm-img-record [(imgArr)]="item.imgPaths" [delImg]="false"></zm-img-record>
              </div>
              <div style="border-bottom:1px solid #ebeef2;margin-top: 10px"></div>
          </div>
            
          <hr style="margin:0;" *ngIf="viewData.leaguerRecordList.length == 0">
          <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.leaguerRecordList" [text]=" '没有数据'" [showImg]="'noData'"></no-data>
          <zm-page [totalSize]="viewData.leaguerRecordCount" [curPage]="viewData.leaguerRecordPage" (pageChange) = "getLeaguerRecordPageData($event)"></zm-page>
`,
  styles: [`
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
`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordListComp implements OnInit,OnDestroy {

  @Input() leaguerId:string;
  @Input() workFlowDataId:string;
  @Input() orderId:string;
  @Output() addCallback:EventEmitter<any> = new EventEmitter<any>();
  @Output() editCallback:EventEmitter<string> = new EventEmitter<string>();

  private viewDataSub:any;
  private service:RecordListService;
  public viewData:RecordListViewData;

  constructor(private leaguerRecordMgr:LeaguerRecordMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private recordListViewDataMgr:RecordListViewDataMgr,
              private matDialog:MatDialog,
              private cdRef: ChangeDetectorRef) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new RecordListService(this.leaguerRecordMgr,this.storeProductInfoSynDataHolder,this.recordListViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.recordListViewDataMgr.subscribeListVD((viewDataP: RecordListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    if(!AppUtils.isNullObj(this.leaguerId) && !AppUtils.isNullOrWhiteSpace(this.leaguerId)){
      this.service.initViewData(this.leaguerId,this.workFlowDataId);
    }
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 新建记录弹框
   */
  addRecord(){
    this.addCallback.emit();
    // const activeModal = ZmModalMgr.getInstance().newStaticModal(AddRecordPopup,null,null);
    // activeModal.componentInstance.leaguerId = this.leaguerId;
    // activeModal.componentInstance.workFlowDataId = this.workFlowDataId;
    // if(!AppUtils.isNullOrWhiteSpace(this.orderId)){
    //   activeModal.componentInstance.orderId = this.orderId;
    //   activeModal.componentInstance.editRelate = true;
    // }else{
    //   activeModal.componentInstance.editRelate = false;
    // }
    // activeModal.componentInstance.callback.subscribe(() => {
    //   this.service.getLeaguerRecordPageData(1,this.viewData);
    // });
  }

  /**
   * 编辑跟进记录弹框
   * @param leaguerRecordId
   */
  goEditRecordInfo(leaguerRecordId:string){
    this.editCallback.emit(leaguerRecordId);
    // const activeModal = ZmModalMgr.getInstance().newModal(EditRecordPopup,null,null);
    // activeModal.componentInstance.leaguerRecordId = leaguerRecordId;
    // activeModal.componentInstance.orderId = this.orderId;
    // activeModal.componentInstance.callback.subscribe(() => {
    //   this.service.getLeaguerRecordPageData(1,this.viewData);
    // });
  }

  /**
   * 跳转跟进记录详情
   * @param leaguerRecordId
   */
  goRecordDetail(leaguerRecordId:string){
    AppRouter.goRecordDetail(leaguerRecordId);
  }

  /**
   * 删除跟进记录
   */
  deleteRecordInfo(leaguerRecordId:string){
    let tips = "删除后将无法恢复，是否确定删除";
    Popup.getInstance().open("删除跟进记录",tips,()=>{
      this.service.deleteLeaguerRecord(leaguerRecordId).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","删除成功");
          this.service.getLeaguerRecordPageData(1,this.viewData);
        }else{
          AppUtils.showError("提示","删除失败");
        }
      })
    })
  }

  /**
   * 获取跟进记录关联项目
   * @param prdIds
   */
  getRelateProduct(recordId:string):Array<string>{
    return this.viewData.relatePrdMap.get(recordId);
  }

  /**
   * 翻页
   * @param curPage
   */
  getLeaguerRecordPageData(curPage){
    this.service.getLeaguerRecordPageData(curPage,this.viewData);
  }

}

class RecordListService{
  constructor(private leaguerRecordMgr:LeaguerRecordMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private recordListViewDataMgr:RecordListViewDataMgr){}

  public initViewData(leaguerId:string,workFlowDataId:string){
    let viewDataTmp = new RecordListViewData();
    this.recordListViewDataMgr.setListViewData(viewDataTmp);

    this.buildViewData(leaguerId,workFlowDataId);
  }

  private async buildViewData(leaguerId:string,workFlowDataId:string){
    let viewDataTmp = new RecordListViewData();

    let storeId = SessionUtil.getInstance().getStoreId();
    //请求项目信息
    let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeProductInfo)){
      viewDataTmp.productInfoMap = storeProductInfo.getAllProductInfoMap();
    }

    //会员跟进记录
    viewDataTmp.leaguerRecordQueryForm.storeId = storeId;
    viewDataTmp.leaguerRecordQueryForm.leaguerId = leaguerId;
    viewDataTmp.leaguerRecordQueryForm.workFlowDataId = workFlowDataId;
    let leaguerRecordPageResp:PageResp = await this.leaguerRecordMgr.getLeaguerRecordPageInfo(viewDataTmp.leaguerRecordQueryForm);
    viewDataTmp.leaguerRecordPage = 1;
    viewDataTmp.leaguerRecordCount = leaguerRecordPageResp.totalCount;
    viewDataTmp.leaguerRecordList = leaguerRecordPageResp.list;
    viewDataTmp.relatePrdMap = this.getRecordRelateProductMap(viewDataTmp.leaguerRecordList,viewDataTmp.productInfoMap);
    viewDataTmp.loadingFinish = true;
    this.recordListViewDataMgr.setListViewData(viewDataTmp);
  }

  /**
   * 获取跟进记录分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getLeaguerRecordPageData(curPage:number,viewData:RecordListViewData){
    viewData.loadingFinish = false;
    viewData.leaguerRecordList = [];
    //请求会员跟进记录
    viewData.leaguerRecordQueryForm.pageNo = curPage;
    let leaguerRecordPageResp:PageResp = await this.leaguerRecordMgr.getLeaguerRecordPageInfo(viewData.leaguerRecordQueryForm);
    viewData.leaguerRecordPage = curPage;
    viewData.leaguerRecordCount = leaguerRecordPageResp.totalCount;
    viewData.leaguerRecordList = leaguerRecordPageResp.list;
    viewData.relatePrdMap = this.getRecordRelateProductMap(viewData.leaguerRecordList,viewData.productInfoMap);

    viewData.loadingFinish = true;
    this.recordListViewDataMgr.setListViewData(viewData);
  }

  /**
   * 删除跟进记录
   * @param leaguerRecordId
   * @returns {Promise<boolean>}
   */
  public deleteLeaguerRecord(leaguerRecordId:string):Promise<boolean>{
    return this.leaguerRecordMgr.deleteLeaguerRecord(leaguerRecordId);
  }

  /**
   * 组装跟进记录关联项目
   * @param leaguerRecordList
   * @param prdInfoMap
   * @returns {ZmMap<Array<string>>}
   */
  private getRecordRelateProductMap(leaguerRecordList,prdInfoMap):ZmMap<Array<string>> {
    let relatePrdMap = new ZmMap<Array<string>>();
    leaguerRecordList.forEach((record) => {
      if (!AppUtils.isNullObj(record.relateProduct) && !AppUtils.isNullObj(record.relateProduct.prdIds) && record.relateProduct.prdIds.length > 0) {
        let relatePrdArr = new Array<string>();
        if (!AppUtils.isNullObj(prdInfoMap)) {
          record.relateProduct.prdIds.forEach((id) => {
            let productInfo = prdInfoMap.get(id);
            if (!AppUtils.isNullObj(productInfo)) {
              relatePrdArr.push(productInfo.name);
            }
          })
        }
        relatePrdMap.put(record.id, relatePrdArr);
      }
    })
    return relatePrdMap;
  }

}

export class RecordListViewData{
  public leaguerRecordQueryForm:LeaguerRecordQueryForm = new LeaguerRecordQueryForm();
  public leaguerRecordList:Array<LeaguerRecord> = new Array<LeaguerRecord>();
  public relatePrdMap = new ZmMap<Array<string>>();
  public productInfoMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();

  public leaguerRecordPage:number;//当前页码
  public leaguerRecordCount:number;//总记录数

  public loadingFinish :boolean = false;
}


