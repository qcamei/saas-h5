import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {UpdProductCardStateData} from "../../../../bsModule/storeCardInfo/apiData/UpdProductCardStateData";
import {BatchUpdProductCardStateData} from "../../../../bsModule/storeCardInfo/apiData/BatchUpdProductCardStateData";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {Constants} from "../../../common/Util/Constants";
import {DelProductCardForm} from "../../../../bsModule/storeCardInfo/apiData/DelProductCardForm";
import {ProductCardDetail} from "../../../../bsModule/productCardDetail/data/ProductCardDetail";
import {ProductCardDetailQueryForm} from "../../../../bsModule/productCardDetail/apiData/ProductCardDetailQueryForm";
import {ProductCardDetailMgr} from "../../../../bsModule/productCardDetail/productCardDetailMgr";
import {PageResp} from "../../../../comModule/PageResp";
import {CardStatusEnum} from "../../../../bsModule/storeCardInfo/data/CardStatusEnum";
import {Popup} from "../../../common/popup/popup";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {MgrPool} from "../../../../comModule/MgrPool";
import {CancelPrdCardTop} from "../../../../bsModule/storeCardInfo/apiData/CancelPrdCardTop";
import {AddPrdCardTop} from "../../../../bsModule/storeCardInfo/apiData/AddPrdCardTop";

@Component({
  selector: 'page-storeCard-productCardList',
  templateUrl: 'productCardList.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductCardListPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ProductCardListService;
  public viewData: ProductCardListViewData;
  private prdCardIdArray = new Array<string>();//batchChangeState
  public isSelectedAll:boolean = false;

  constructor(private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private productCardDetailMgr:ProductCardDetailMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ProductCardListService(
      this.storeCardInfoMgr,
      this.storeCardInfoViewDataMgr,
      this.productCardDetailMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeProductCardListVD((viewDataP: ProductCardListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    this.storeCardInfoViewDataMgr.setProductCardListViewData(ProductCardListViewData.getInstance());
    this.service.initViewData();
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.paramsSub.unsubscribe();
    }
  }

  /**
   * 是否显示获取总部数据
   * @returns {boolean}
   */
  public getPullDataPerm():boolean{
    return SessionUtil.getInstance().getUserPermData().showSynData;
  }

  /**
   * 跳转获取总部数据
   */
  public goPullCard(){
    AppRouter.goPullCard();
  }

  public selectAll() {
    let listTmp: Array<ProductCardDetail> = new Array<ProductCardDetail>();
    let list = this.viewData.productCardList;
    for (let item of list) {
      let productCardDetail = new ProductCardDetail();
      AppUtils.copy(productCardDetail, item);
      productCardDetail.checked = this.isSelectedAll;
      listTmp.push(productCardDetail);
    }
    this.viewData.productCardList = listTmp;
  }

  public checkList() {
    let checkList = new Array<boolean>();
    let list = this.viewData.productCardList;
    for (let item of  list) {
      checkList.push(item.checked);
    }
    if (AppUtils.arrayContains(checkList, false)) {
      this.isSelectedAll = false;
    } else {
      this.isSelectedAll = true;
    }
  }


  /**
   * 点击事件 跳转新建会员卡页面
   */
  public goAddProductCard(){
    AppRouter.goAddProductCard();
  }

  public goUpdatePage(cardId){
    AppRouter.goEditProductCard(cardId);
  }

  public goDetailPage(cardId){
    AppRouter.goProductCardDetail(cardId);
  }



  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.initViewData();
  }

  /**
   * 按条件查询
   */
  public getProductCardDetailListByReq() {
    if(!AppUtils.isNullObj(this.viewData.queryForm.cardNameOrNumber)){
      this.viewData.queryForm.cardNameOrNumber = AppUtils.trimBlank(this.viewData.queryForm.cardNameOrNumber);
    }
    this.service.initViewData();
  }

  public deletePrdCard(prdCard){
    Popup.getInstance().open("删除次卡","确定删除#"+prdCard.name+"#?",()=>{
      let deleteForm:DelProductCardForm = new DelProductCardForm();
      deleteForm.id = prdCard.id;
      this.service.deletePrdCard(deleteForm).then((success)=>{
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
          this.handleSuccessResult();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
        }
      });
    });

  }

  private handleSuccessResult(){
    this.service.initViewData();
  }

  productCardToTop(productCardDetail:ProductCardDetail){
    Popup.getInstance().open("提示", "确定将#"+productCardDetail.name+"#置顶吗？", () => {
      this.service.updateProductCardToTop(productCardDetail.id).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, "置顶成功");
            this.service.initViewData();
          }
          else {
            AppUtils.showError(PromptMsg.PROMPT,"置顶失败");
          }
        }
      );
    });
  }

  productCardCancelTop(productCardDetail:ProductCardDetail){
    Popup.getInstance().open("提示", "确定将#"+productCardDetail.name+"#取消置顶吗？", () => {
      this.service.updateProductCardCancelTop(productCardDetail.id).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, "取消置顶成功");
            this.service.initViewData();
          }
          else {
            AppUtils.showError(PromptMsg.PROMPT,"取消置顶失败");
          }
        }
      );
    });
  }

  /**
   * 改变状态事件
   */
  changeState(productCardId, state) {
    let title = PromptMsg.PROMPT;
    let content = "";
    state == CardStatusEnum.OPEN?content = PromptMsg.ENABLED:content = PromptMsg.DISABLED;
    Popup.getInstance().open(title, "确定" + content + "吗?", () => {
      this.service.updateProductCardState(productCardId, state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.handleSuccessResult();

          } else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    });
  }

  buildIdArray(){
    for(let item of this.viewData.productCardList){
      if(item.checked == true){
        this.prdCardIdArray.push(item.id);
      }
    }
  }

  /**
   * 批量改变状态事件
   */
  batchChangeState(state) {
    let content = "";
    state === CardStatusEnum.OPEN ? content = "上架" : content = "下架";

    this.buildIdArray();

    if (this.prdCardIdArray.length > 0) {
      this.service.batchUpdatePrdCardState(this.prdCardIdArray, state).then(
        (success) => {
          if (success) {
            this.prdCardIdArray = new Array<string>();
            AppUtils.showSuccess(PromptMsg.PROMPT, content+"成功");
            this.handleSuccessResult();

          }else{
            AppUtils.showError(PromptMsg.PROMPT, content+"失败");
          }
        }
      );
    } else {
      AppUtils.showWarn("提示", "请至少选择一条数据");
    }

  }


}


export class ProductCardListViewData {

  public static getInstance():ProductCardListViewData{
    let target = MgrPool.getInstance().get("ProductCardListViewData",ProductCardListViewData);
    if(AppUtils.isNullObj(target)){
      target = new ProductCardListViewData();
    }
    return target;
  }
  public initData(){
    MgrPool.getInstance().setNull("ProductCardListViewData",ProductCardListViewData);
  }

  productCardList: Array<ProductCardDetail> = new Array<ProductCardDetail>();
  recordCount: number;//总记录数
  loadingFinish: boolean = false;

  curPage:number = 1;
  queryForm:ProductCardDetailQueryForm = new ProductCardDetailQueryForm();
  status:number = Constants.DEFAULT_STATE_VALUE;

  defaultImg:string = Constants.PRDCARD_DEFAULT_IMG;


  productCardTypeList: Array<PrdCardType> = new Array<PrdCardType>();
  productCardTypeMap:ZmMap<PrdCardType>;


}


class ProductCardListService {

  constructor(private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private productCardDetailMgr:ProductCardDetailMgr,) {
  }

  public initViewData(): void {

    this.buildViewData().then((viewDataTmp: ProductCardListViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ProductCardListViewData) {
    this.storeCardInfoViewDataMgr.setProductCardListViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param status:number
   * @returns Promise<ProductCardListViewData>
   */
  public async buildViewData(): Promise<ProductCardListViewData> {
    let viewDataTmp = ProductCardListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let storeId = SessionUtil.getInstance().getStoreId();
    let storeCardInfo:StoreCardInfo = await this.storeCardInfoMgr.getStoreCardInfo(storeId);
    if(storeCardInfo){
      viewDataTmp.productCardTypeMap = storeCardInfo.getAllProductCardTypeMap();
      viewDataTmp.productCardTypeList = viewDataTmp.productCardTypeMap.values();
    }

    let queryForm: ProductCardDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.productCardDetailMgr.getProductCardDetailPageInfo(queryForm);
    if(pageResp && pageResp.list){
      viewDataTmp.productCardList = pageResp.list;
      viewDataTmp.productCardList.sort(function (item1, item2) {
        let a = item1.number;
        let b = item2.number;
        return a.localeCompare(b);
      });
      viewDataTmp.recordCount = pageResp.totalCount;

    }

    viewDataTmp.loadingFinish = true;
    return new Promise<ProductCardListViewData>(resolve => {
        resolve(viewDataTmp);
    });

  }

  private buildQueryForm(viewDataTmp:ProductCardListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let queryForm: ProductCardDetailQueryForm = new ProductCardDetailQueryForm();
    queryForm.storeId = storeId;
    queryForm.cardNameOrNumber = viewDataTmp.queryForm.cardNameOrNumber;
    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = "" : queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.statusSet.push(viewDataTmp.status);
    AppUtils.uniquelize(viewDataTmp.queryForm.statusSet);
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }

  /**
   * 修改次卡状态
   * @param storeId:string
   * @param prdCardId:number
   * @param state:number
   * @returns Promise<boolean>
   */

  public updateProductCardState(productCardId: string, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let updateProductCardStateData = new UpdProductCardStateData();
    updateProductCardStateData.id = productCardId;
    updateProductCardStateData.state = state;
    updateProductCardStateData.storeId = storeId;
    return new Promise(resolve => {
      this.storeCardInfoMgr.updateProductCardState(storeId,updateProductCardStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  /**
   * 批量修改次卡状态
   * @param storeId:string
   * @param prdCardIdSet:Array<string>
   * @param state:number
   * @returns Promise<boolean>
   */
  public batchUpdatePrdCardState(prdCardIdSet: Array<string>, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let batchUpdProductCardStateData = new BatchUpdProductCardStateData();
    batchUpdProductCardStateData.prdCardIdSet = prdCardIdSet;
    batchUpdProductCardStateData.state = state;
    batchUpdProductCardStateData.storeId = storeId;
    return new Promise(resolve => {
      this.storeCardInfoMgr.batchUpdateProductCardState(storeId,batchUpdProductCardStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public deletePrdCard(deleteForm:DelProductCardForm): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise(resolve => {
      this.storeCardInfoMgr.deletePrdCard(storeId, deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  goEditPage(cardId){
    AppRouter.goEditProductCard(cardId);
  }

  public updateProductCardToTop(productCardId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let toTopData = new AddPrdCardTop();
    toTopData.id = productCardId;
    return new Promise(resolve => {
      this.storeCardInfoMgr.toTop(storeId,toTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public updateProductCardCancelTop(productCardId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let cancelTopData = new CancelPrdCardTop();
    cancelTopData.id = productCardId;
    return new Promise(resolve => {
      this.storeCardInfoMgr.cancelTop(storeId,cancelTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };
}
