import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {ChainGoodsViewDataMgr} from '../ChainGoodsViewDataMgr';
import {AppUtils, ZmMap} from '../../../comModule/AppUtils';
import {GoodsType} from '../../../bsModule/chainGoods/data/GoodsType';
import {GoodsUpdateStateForm} from '../../../bsModule/chainGoods/apiData/GoodsUpdateStateForm';
import {GoodsBatchUpdateStateForm} from '../../../bsModule/chainGoods/apiData/GoodsBatchUpdateStateForm';
import {GoodsStateEnum} from '../../../bsModule/chainGoods/data/GoodsStateEnum';
import {AppRouter} from "../../../comModule/AppRouter";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {GoodsRemoveForm} from "../../../bsModule/chainGoods/apiData/GoodsRemoveForm";
import {PageResp} from "../../../comModule/PageResp";
import {Popup} from "../../common/popup/popup";
import {Constants} from "../../common/Util/Constants";
import {GoodsDetail} from "../../../bsModule/chainGoods/data/GoodsDetail";
import {GoodsDetailQueryForm} from "../../../bsModule/chainGoods/apiData/GoodsDetailQueryForm";
import {GoodsDetailMgr} from "../../../bsModule/chainGoods/GoodsDetailMgr";
import {ChainGoods} from "../../../bsModule/chainGoods/data/ChainGoods";
import {ChainGoodsMgr} from "../../../bsModule/chainGoods/chainGoodsMgr";
import {StoreListComp} from "../../productionLibrary/Comp/storeListComp/StoreListComp";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {GoodsAllotForm} from "../../../bsModule/chainGoods/apiData/GoodsAllotForm";
import {GoodsBatchAllotForm} from "../../../bsModule/chainGoods/apiData/GoodsBatchAllotForm";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {MgrPool} from "../../../comModule/MgrPool";

@Component({
  selector:'goods-list',
  templateUrl:'goodsList.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class GoodsList implements OnInit,OnDestroy {

  private service: ChainGoodsListService;
  public  viewData: ChainGoodsListViewData;
  private paramsSub: any;
  private viewDataSub: any;
  public isSelectedAll:boolean = false;
  private goodsIdArray = new Array<string>();//batchChangeState

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private goodsDetailMgr:GoodsDetailMgr,
              private storeMgr:StoreMgr,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {
    this.service = new ChainGoodsListService(this.chainGoodsMgr, this.chainGoodsViewDataMgr,this.goodsDetailMgr,this.storeMgr);
  }


  ngOnInit() {

    this.viewDataSub = this.chainGoodsViewDataMgr.subscribeChainGoodsListVD((viewDataP: ChainGoodsListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();

  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.paramsSub)){
      this.paramsSub.unsubscribe();  //取消订阅 防止内存泄露
    }
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }

  }

  //GoodsDetail->id
  goGoodsDetail(goodsDetailId:number){
    AppRouter.goFindGoodsDetail(goodsDetailId);
  }


  goEditGoods(goodsDetailId:number){
    AppRouter.goEditGoods(goodsDetailId);
  }

  goAddGoods(){
    AppRouter.goAddChainGoods();
  }

  goAddGoodsType(){
    AppRouter.goAddChainGoodsType();
  }

  /**全/反选**/
  public selectAll() {
    let listTmp: Array<GoodsDetail> = new Array<GoodsDetail>();
    let list = this.viewData.goodsList;
    for (let item of list) {
      let goodsDetail = new GoodsDetail();
      AppUtils.copy(goodsDetail, item);
      goodsDetail.checked = this.isSelectedAll;
      listTmp.push(goodsDetail);
    }
    this.viewData.goodsList = listTmp;
  }

  public checkList() {
    let checkList = new Array<boolean>();
    let list = this.viewData.goodsList;
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
  getPageData(curPage){
    this.viewData.curPage = curPage;
    this.callbackRefreshData();
  }

  /**
   * 按条件查询
   */
  public getGoodsDetailListByReq() {
    if(!AppUtils.isNullObj(this.viewData.queryForm.numberOrName)){
      this.viewData.queryForm.numberOrName = AppUtils.trimBlank(this.viewData.queryForm.numberOrName);
    }
    this.callbackRefreshData();
  }

  /**
   * 改变状态事件
   */
  changeState(goodsId,state) {
    let content = "";
    state == GoodsStateEnum.Open?content= PromptMsg.ENABLED:content= PromptMsg.DISABLED;
    Popup.getInstance().open(PromptMsg.PROMPT,"确定"+content+"吗?",()=>{
      this.service.updateGoodsState(goodsId,state).then(
        (success) =>{
          if(success){
            AppUtils.showSuccess(PromptMsg.PROMPT,content+"成功");
            this.callbackRefreshData();
          }
          else{
            AppUtils.showError(PromptMsg.PROMPT,content+"失败");
          }
        }
      );
    });

  }

  /**
   * 批量改变状态事件
   */
  batchChangeState(state) {
    let content = "";
    state===GoodsStateEnum.Open?content = PromptMsg.ENABLED:content = PromptMsg.DISABLED;

    this.buildIdArray();

    if(this.goodsIdArray.length!=0){
      this.service.batchUpdateGoodsState(this.goodsIdArray,state).then(
        (success) =>{
          if(success){
            this.goodsIdArray = new Array<string>();
            AppUtils.showSuccess(PromptMsg.PROMPT,content+"成功");
            this.callbackRefreshData();
          }else{
            AppUtils.showError(PromptMsg.PROMPT,content+"失败");
          }
        }
      );
    }else{
      AppUtils.showWarn("提示","请至少选择一条数据");
    }
  }

  buildIdArray(){
    for(let item of this.viewData.goodsList){
      if(item.checked == true){
        this.goodsIdArray.push(item.id);
      }
    }
  }


  /**
   * 分配
   */
  public allotStores(goodsDetail:GoodsDetail) {
    this.viewData.storeList.forEach((item)=>{item.checked = false;});
    let ids = goodsDetail.applyStoreIds;
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
    activeModal.componentInstance.callback = this.getSelectedStore.bind(this,goodsDetail);
  }

  private getSelectedStore(item:GoodsDetail,storeList:Array<StoreVD>){
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


  /**删除商品*/
  removeGoods(goods:GoodsDetail) {
    Popup.getInstance().open("删除商品","确定删除#"+goods.name+"#?",()=>{
      let removeForm:GoodsRemoveForm = new GoodsRemoveForm();
      removeForm.id = goods.id;
      this.service.deleteGoods(removeForm).then((success)=>{
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
          this.callbackRefreshData();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
        }
      });
    });
  }

  private callbackRefreshData(){
    this.service.getPageData();
  }

}

export class ChainGoodsListViewData {
  public static getInstance():ChainGoodsListViewData{
    let target = MgrPool.getInstance().get("ChainGoodsListViewData",ChainGoodsListViewData);
    if(AppUtils.isNullObj(target)){
      target = new ChainGoodsListViewData();
    }
    return target;
  }

  public initData(){
    MgrPool.getInstance().setNull("ChainGoodsListViewData",ChainGoodsListViewData);
  }

  goodsTypeList: Array<GoodsType> = new Array<GoodsType>();
  goodsTypeMap:ZmMap<GoodsType>;
  queryForm:GoodsDetailQueryForm = new GoodsDetailQueryForm();
  curPage:number = 1;
  state:number = -1;

  goodsList: Array<GoodsDetail> = new Array<GoodsDetail>(); //原始数据
  recordCount:number;//总记录数
  loadingFinish:boolean = false;

  //分配门店相关
  public storeList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();

}

class ChainGoodsListService {

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private goodsDetailMgr:GoodsDetailMgr,
              private storeMgr:StoreMgr,) {
  }

  public initViewData() {
    this.chainGoodsViewDataMgr.setChainGoodsListViewData(ChainGoodsListViewData.getInstance());

    this.buildViewData().then(
      (viewDataTmp: ChainGoodsListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: ChainGoodsListViewData) {
    this.chainGoodsViewDataMgr.setChainGoodsListViewData(viewDataP);
  }

  /**
   * 组装ChainGoodsListViewData
   * @param chainId
   * @param status
   * @returns goodsmise<ChainGoodsListViewData>
   */

  public async buildViewData(): Promise<ChainGoodsListViewData>{

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: ChainGoodsListViewData = ChainGoodsListViewData.getInstance();
    let storePageResp = await this.storeMgr.findStoreByCond(chainId);
    if(storePageResp){
      viewDataTmp.storeList = storePageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }

    let chainGoods:ChainGoods = await this.chainGoodsMgr.getChainGoods(chainId);
    if(chainGoods){
      viewDataTmp.goodsTypeMap = chainGoods.getAllGoodsTypeMap();
      viewDataTmp.goodsTypeList = chainGoods.getValidGoodsTypeMap().values();
    }
    let queryForm:GoodsDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp:PageResp = await this.goodsDetailMgr.getGoodsDetailPageInfo(queryForm);

    viewDataTmp.goodsList = pageResp.list;
    viewDataTmp.goodsList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    return new Promise<ChainGoodsListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public async getPageData(){

    let viewDataTmp: ChainGoodsListViewData = ChainGoodsListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let queryForm:GoodsDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp:PageResp = await this.goodsDetailMgr.getGoodsDetailPageInfo(queryForm);
    viewDataTmp.goodsList = pageResp.list;
    viewDataTmp.goodsList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewDataTmp: ChainGoodsListViewData){
    let chainId = SessionUtil.getInstance().getChainId();
    let queryForm:GoodsDetailQueryForm = new GoodsDetailQueryForm();
    queryForm.chainId = chainId;
    queryForm.numberOrName = viewDataTmp.queryForm.numberOrName;

    if(viewDataTmp.state != Constants.DEFAULT_STATE_VALUE){
      queryForm.stateArray.push(viewDataTmp.state);
    }

    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ?queryForm.typeId = "":queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }


  /**
   * 修改商品状态
   * @param chainId:string
   * @param goodsId:number
   * @param state:number
   * @returns goodsmise<boolean>
   */

  public updateGoodsState(goodsId:string, state:number):Promise<boolean>{
    let chainId = SessionUtil.getInstance().getChainId();
    let updateGoodsStateData = new GoodsUpdateStateForm();
    updateGoodsStateData.id = goodsId;
    updateGoodsStateData.state = state;
    return new Promise(resolve =>{
      this.chainGoodsMgr.updateGoodsState(chainId,updateGoodsStateData).then(
        (success) =>{
          resolve(success);
        }
      );
    });

  };

  /**
   * 批量修改商品状态
   * @param chainId:string
   * @param goodIdset:Array<number>
   * @param state:number
   * @returns goodsmise<boolean>
   */
  public batchUpdateGoodsState(goodIdset:Array<string>, state:number):Promise<boolean>{
    let chainId = SessionUtil.getInstance().getChainId();
    let batchUpdateGoodsStateData = new GoodsBatchUpdateStateForm();
    batchUpdateGoodsStateData.goodIds = goodIdset;
    batchUpdateGoodsStateData.state = state;
    return new Promise(resolve =>{
      this.chainGoodsMgr.batchUpdateGoodsState(chainId, batchUpdateGoodsStateData).then(
        (success) =>{
          resolve(success);
        }
      );
    });

  };

  public allotStore(goodsId:string, applyStoreIds:Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let allotForm = new GoodsAllotForm();
    allotForm.id = goodsId;
    allotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainGoodsMgr.allotStore(chainId,allotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchAllotStore(ids:Array<string>, applyStoreIds:Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchAllotForm = new GoodsBatchAllotForm();
    batchAllotForm.ids = ids;
    batchAllotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainGoodsMgr.batchAllotStore(chainId,batchAllotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public deleteGoods(removeForm:GoodsRemoveForm): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise(resolve => {
      this.chainGoodsMgr.deleteGoods(chainId,removeForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

}
