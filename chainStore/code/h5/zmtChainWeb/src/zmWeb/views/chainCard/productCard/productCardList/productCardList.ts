import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {UpdProductCardStateData} from "../../../../bsModule/chainCard/apiData/UpdProductCardStateData";
import {BatchUpdProductCardStateData} from "../../../../bsModule/chainCard/apiData/BatchUpdProductCardStateData";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {Constants} from "../../../common/Util/Constants";
import {DelProductCardForm} from "../../../../bsModule/chainCard/apiData/DelProductCardForm";
import {PageResp} from "../../../../comModule/PageResp";
import {CardStatusEnum} from "../../../../bsModule/chainCard/data/CardStatusEnum";
import {Popup} from "../../../common/popup/popup";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {ProductCardDetailMgr} from "../../../../bsModule/chainCard/productCardDetailMgr";
import {ProductCardDetail} from "../../../../bsModule/chainCard/data/ProductCardDetail";
import {ProductCardDetailQueryForm} from "../../../../bsModule/chainCard/apiData/ProductCardDetailQueryForm";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductCardBatchAllotForm} from "../../../../bsModule/chainCard/apiData/ProductCardBatchAllotForm";
import {ProductCardAllotForm} from "../../../../bsModule/chainCard/apiData/ProductCardAllotForm";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {MgrPool} from "../../../../comModule/MgrPool";

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
  public isSelectedAll: boolean = false;

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private productCardDetailMgr: ProductCardDetailMgr,
              private storeMgr: StoreMgr,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ProductCardListService(
      this.chainCardMgr,
      this.chainCardViewDataMgr,
      this.productCardDetailMgr,
      this.storeMgr,);
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeProductCardListVD((viewDataP: ProductCardListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
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
   * 点击跳转事件
   */
  public goAddProductCard() {
    AppRouter.goAddProductCard();
  }

  public goAddProductCardType() {
    AppRouter.goProductCardType();
  }

  /**
   * 全/反选
   */
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
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.callbackRefreshData();
  }

  /**
   * 按条件查询
   */
  public getProductCardDetailListByReq() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.cardNameOrNumber)) {
      this.viewData.queryForm.cardNameOrNumber = AppUtils.trimBlank(this.viewData.queryForm.cardNameOrNumber);
    }
    this.callbackRefreshData();
  }



  public deletePrdCard(prdCard) {
    Popup.getInstance().open("删除次卡", "确定删除#" + prdCard.name + "#?", () => {
      let deleteForm: DelProductCardForm = new DelProductCardForm();
      deleteForm.id = prdCard.id;
      this.service.deletePrdCard(deleteForm).then((success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
          this.callbackRefreshData();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
        }
      });
    });

  }

  /**
   * 改变状态事件
   */
  changeState(productCardId, state) {
    let title = PromptMsg.PROMPT;
    let content = "";
    state == CardStatusEnum.OPEN ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    Popup.getInstance().open(title, "确定" + content + "吗?", () => {
      this.service.updateProductCardState(productCardId, state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.callbackRefreshData();
          } else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    });
  }

  buildIdArray() {
    for (let item of this.viewData.productCardList) {
      if (item.checked == true) {
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
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.callbackRefreshData();
          } else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    } else {
      AppUtils.showWarn("提示", "请至少选择一条数据");
    }

  }

  private callbackRefreshData() {
    this.service.getPageData();
  }


  /**
   * 分配
   */
  public allotStores(productCardDetail:ProductCardDetail) {
    this.viewData.storeList.forEach((item)=>{item.checked = false;});
    let ids = productCardDetail.applyStoreIds;
    if(ids){
      for(let id of ids){
        this.viewData.storeList.forEach((item)=>{
          if(item.id == id){
            item.checked = true;
          }
        });
      }
    }
    const activeModal = this.modalService.open(StoreListComp, {size: 'lg', backdrop: 'static'});
    activeModal.componentInstance.storeList = this.viewData.storeList;
    activeModal.componentInstance.callback = this.getSelectedStore.bind(this,productCardDetail);
  }

  private getSelectedStore(item:ProductCardDetail,storeList:Array<StoreVD>){
    if(storeList && storeList.length>0){
      this.viewData.selectStoreList = null;
      this.viewData.selectStoreList = storeList;
      this.viewData.selectStoreIds = storeList.map((item)=>{
        return item.id;
      });
    }

    this.service.allotStore(item.id,this.viewData.selectStoreIds).then((success)=>{
      if(success){
        AppUtils.showSuccess("提示","分配成功");
        this.callbackRefreshData();
      }else{
        AppUtils.showError("提示","分配失败");
      }
    });
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

  curPage: number = 1;
  queryForm: ProductCardDetailQueryForm = new ProductCardDetailQueryForm();
  status: number = Constants.DEFAULT_STATE_VALUE;
  defaultImg: string = Constants.PRDCARD_DEFAULT_IMG;


  productCardTypeList: Array<PrdCardType> = new Array<PrdCardType>();
  productCardTypeMap: ZmMap<PrdCardType>;


  //分配门店相关
  public storeList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();


}


class ProductCardListService {

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private productCardDetailMgr: ProductCardDetailMgr,
              private storeMgr:StoreMgr,) {
  }

  public initViewData(): void {
    this.chainCardViewDataMgr.setProductCardListViewData(ProductCardListViewData.getInstance());

    this.buildViewData().then((viewDataTmp: ProductCardListViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ProductCardListViewData) {
    this.chainCardViewDataMgr.setProductCardListViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param status:number
   * @returns Promise<ProductCardListViewData>
   */
  public async buildViewData(): Promise<ProductCardListViewData> {
    let viewDataTmp: ProductCardListViewData = ProductCardListViewData.getInstance();
    let chainId = SessionUtil.getInstance().getChainId();
    let storePageResp :PageResp = await this.storeMgr.findStoreByCond(chainId);
    if(storePageResp){
      viewDataTmp.storeList = storePageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }

    let chainCard: ChainCard = await this.chainCardMgr.getChainCard(chainId);
    if (chainCard) {
      viewDataTmp.productCardTypeMap = chainCard.getValidProductCardTypeMap();
      viewDataTmp.productCardTypeList = viewDataTmp.productCardTypeMap.values();
    }

    let queryForm: ProductCardDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.productCardDetailMgr.getProductCardDetailPageInfo(queryForm);
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.productCardList = pageResp.list;
    viewDataTmp.productCardList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.loadingFinish = true;
    return new Promise<ProductCardListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public async getPageData() {
    let viewDataTmp: ProductCardListViewData = ProductCardListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let queryForm: ProductCardDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.productCardDetailMgr.getProductCardDetailPageInfo(queryForm);
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.productCardList = pageResp.list;
    viewDataTmp.productCardList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewDataTmp: ProductCardListViewData) {
    let chainId = SessionUtil.getInstance().getChainId();
    let queryForm: ProductCardDetailQueryForm = new ProductCardDetailQueryForm();
    queryForm.chainId = chainId;
    queryForm.cardNameOrNumber = viewDataTmp.queryForm.cardNameOrNumber;
    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = "" : queryForm.typeId = viewDataTmp.queryForm.typeId;
    if(viewDataTmp.status != Constants.DEFAULT_STATE_VALUE){
      queryForm.statusSet.push(viewDataTmp.status);
    }
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }

  /**
   * 修改次卡状态
   * @param chainId:string
   * @param prdCardId:number
   * @param state:number
   * @returns Promise<boolean>
   */

  public updateProductCardState(productCardId: string, state: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let updateProductCardStateData = new UpdProductCardStateData();
    updateProductCardStateData.id = productCardId;
    updateProductCardStateData.state = state;
    return new Promise(resolve => {
      this.chainCardMgr.updateProductCardState(chainId, updateProductCardStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  /**
   * 批量修改次卡状态
   * @param chainId:string
   * @param prdCardIdSet:Array<string>
   * @param state:number
   * @returns Promise<boolean>
   */
  public batchUpdatePrdCardState(prdCardIdSet: Array<string>, state: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchUpdProductCardStateData = new BatchUpdProductCardStateData();
    batchUpdProductCardStateData.prdCardIdSet = prdCardIdSet;
    batchUpdProductCardStateData.state = state;
    return new Promise(resolve => {
      this.chainCardMgr.batchUpdateProductCardState(chainId, batchUpdProductCardStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public allotStore(goodsId:string, applyStoreIds:Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let allotForm = new ProductCardAllotForm();
    allotForm.id = goodsId;
    allotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainCardMgr.allotProductCard(chainId,allotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchAllotStore(ids:Array<string>, applyStoreIds:Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchAllotForm = new ProductCardBatchAllotForm();
    batchAllotForm.ids = ids;
    batchAllotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainCardMgr.batchAllotProductCard(chainId,batchAllotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public deletePrdCard(deleteForm: DelProductCardForm): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise(resolve => {
      this.chainCardMgr.deleteProductCard(chainId, deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

}
