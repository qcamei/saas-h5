import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {StoreGoodsMgr} from '../../../bsModule/storeGoods/StoreGoodsMgr';
import {StoreGoodsViewDataMgr} from '../StoreGoodsViewDataMgr';
import {AppUtils, ZmMap} from '../../../comModule/AppUtils';
import {GoodsType} from '../../../bsModule/storeGoods/data/GoodsType';
import {GoodsUpdateStateForm} from '../../../bsModule/storeGoods/apiData/GoodsUpdateStateForm';
import {GoodsBatchUpdateStateForm} from '../../../bsModule/storeGoods/apiData/GoodsBatchUpdateStateForm';
import {StoreGoods} from '../../../bsModule/storeGoods/data/StoreGoods';
import {GoodsStateEnum} from '../../../bsModule/storeGoods/data/GoodsStateEnum';
import {AppRouter} from "../../../comModule/AppRouter";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {GoodsRemoveForm} from "../../../bsModule/storeGoods/apiData/GoodsRemoveForm";
import {GoodsDetail} from "../../../bsModule/goodsDetail/data/GoodsDetail";
import {GoodsDetailMgr} from "../../../bsModule/goodsDetail/GoodsDetailMgr";
import {GoodsDetailQueryForm} from "../../../bsModule/goodsDetail/apiData/GoodsDetailQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {Popup} from "../../common/popup/popup";
import {Constants} from "../../common/Util/Constants";
import {MgrPool} from "../../../comModule/MgrPool";
import {GoodsAddToTopForm} from "../../../bsModule/storeGoods/apiData/GoodsAddToTopForm";
import {GoodsCancelTopForm} from "../../../bsModule/storeGoods/apiData/GoodsCancelTopForm";

@Component({
  selector: 'storeGoodsList',
  templateUrl: 'storeGoodsList.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StoreGoodsList implements OnInit,OnDestroy {

  private service: StoreGoodsListService;
  public viewData: StoreGoodsListViewData;
  private paramsSub: any;
  public isSelectedAll: boolean = false;
  private goodsIdArray = new Array<string>();//batchChangeState

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private goodsDetailMgr: GoodsDetailMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {
    this.service = new StoreGoodsListService(this.storeGoodsMgr, this.storeGoodsViewDataMgr, this.goodsDetailMgr);
  }


  ngOnInit() {

    this.storeGoodsViewDataMgr.subscribeStoreGoodsListVD((viewDataP: StoreGoodsListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.storeGoodsViewDataMgr.setStoreGoodsListViewData(StoreGoodsListViewData.getInstance());
    this.service.initViewData();

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.paramsSub)) {
      this.paramsSub.unsubscribe();  //取消订阅 防止内存泄露
    }
  }

  /**
   * 是否显示获取总部数据
   * @returns {boolean}
   */
  public getPullDataPerm(): boolean {
    return SessionUtil.getInstance().getUserPermData().showSynData;
  }

  /**
   * 跳转获取总部数据
   */
  public goPullGoods() {
    AppRouter.goPullGoods();
  }

  //GoodsDetail->id
  goGoodsDetail(goodsDetailId: number) {
    AppRouter.goFindGoodsDetail(goodsDetailId);
  }


  goEditGoods(goodsDetailId: number) {
    AppRouter.goEditGoods(goodsDetailId);
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
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.initViewData();
  }

  /**
   * 按条件查询
   */
  public getGoodsDetailListByReq() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.numberOrName)) {
      this.viewData.queryForm.numberOrName = AppUtils.trimBlank(this.viewData.queryForm.numberOrName);
    }
    this.service.initViewData();
  }


  /**删除商品*/
  removeGoods(goods: GoodsDetail) {
    Popup.getInstance().open("删除商品", "确定删除#" + goods.name + "#?", () => {
      let removeForm: GoodsRemoveForm = new GoodsRemoveForm();
      removeForm.goodsId = goods.goodsId;
      this.service.deleteGoods(removeForm).then((success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
          this.service.initViewData();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
        }
      });
    });
  }

  goodsToTop(goodsDetail:GoodsDetail){
    Popup.getInstance().open("提示", "确定将#"+goodsDetail.name+"#置顶吗？", () => {
      this.service.updateGoodsToTop(goodsDetail.goodsId).then(
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

  goodsCancelTop(goodsDetail:GoodsDetail){
    Popup.getInstance().open("提示", "确定将#"+goodsDetail.name+"#取消置顶吗？", () => {
      this.service.updateGoodsCancelTop(goodsDetail.goodsId).then(
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
  changeState(goodsId, state) {
    let content = "";
    state == GoodsStateEnum.Open ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    Popup.getInstance().open(PromptMsg.PROMPT, "确定" + content + "吗?", () => {
      this.service.updateGoodsState(goodsId, state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.service.initViewData();
          }
          else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    });

  }

  buildIdArray() {
    for (let item of this.viewData.goodsList) {
      if (item.checked == true) {
        this.goodsIdArray.push(item.goodsId);
      }
    }
  }

  /**
   * 点击事件 跳转新建商品页面
   */
  goAddGoods() {
    AppRouter.goAddStoreGoods();
  }

  /**
   * 批量改变状态事件
   */
  batchChangeState(state) {
    let content = "";
    state === GoodsStateEnum.Open ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;

    this.buildIdArray();

    if (this.goodsIdArray.length != 0) {
      this.service.batchUpdateGoodsState(this.goodsIdArray, state).then(
        (success) => {
          if (success) {
            this.goodsIdArray = new Array<string>();
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.service.initViewData();
          } else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    } else {
      AppUtils.showWarn("提示", "请至少选择一条数据");
    }
  }

}

export class StoreGoodsListViewData {
  public static getInstance(): StoreGoodsListViewData {
    let target = MgrPool.getInstance().get("StoreGoodsListViewData", StoreGoodsListViewData);
    if (AppUtils.isNullObj(target)) {
      target = new StoreGoodsListViewData();
    }
    return target;
  }

  public initData() {
    MgrPool.getInstance().setNull("StoreGoodsListViewData", StoreGoodsListViewData);
  }

  goodsTypeList: Array<GoodsType> = new Array<GoodsType>();
  goodsTypeMap: ZmMap<GoodsType>;

  curPage: number = 1;
  queryForm: GoodsDetailQueryForm = new GoodsDetailQueryForm();

  goodsList: Array<GoodsDetail> = new Array<GoodsDetail>(); //原始数据
  recordCount: number;//总记录数
  loadingFinish: boolean = false;

}

class StoreGoodsListService {

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private goodsDetailMgr: GoodsDetailMgr,) {
  }

  public initViewData() {

    this.buildViewData().then(
      (viewDataTmp: StoreGoodsListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: StoreGoodsListViewData) {
    this.storeGoodsViewDataMgr.setStoreGoodsListViewData(viewDataP);
  }

  /**
   * 组装StoreGoodsListViewData
   * @param storeId
   * @param status
   * @returns goodsmise<StoreGoodsListViewData>
   */

  public async buildViewData():Promise<StoreGoodsListViewData>{

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: StoreGoodsListViewData = StoreGoodsListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let storeGoods: StoreGoods = await this.storeGoodsMgr.getStoreGoods(storeId);
    if (storeGoods) {
      viewDataTmp.goodsTypeMap = storeGoods.getGoodsTypeMap();
      viewDataTmp.goodsTypeList = storeGoods.getValidGoodsTypeList();
    }
    let queryForm: GoodsDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.goodsDetailMgr.getGoodsDetailPageInfo(queryForm);
    if (pageResp && pageResp.list) {
      viewDataTmp.goodsList = pageResp.list;
      viewDataTmp.goodsList.sort(function (item1, item2) {
        let a = item1.number;
        let b = item2.number;
        return a.localeCompare(b);
      });
      viewDataTmp.recordCount = pageResp.totalCount;
    }
    viewDataTmp.loadingFinish = true;

    return new Promise<StoreGoodsListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  private buildQueryForm(viewDataTmp: StoreGoodsListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let queryForm: GoodsDetailQueryForm = new GoodsDetailQueryForm();
    queryForm.storeId = storeId;
    queryForm.numberOrName = viewDataTmp.queryForm.numberOrName;
    viewDataTmp.queryForm.state == Constants.DEFAULT_STATE_VALUE ? queryForm.state = Constants.DEFAULT_STATE_VALUE : queryForm.state = viewDataTmp.queryForm.state;
    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = "" : queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }


  /**
   * 修改商品状态
   * @param storeId:string
   * @param goodsId:number
   * @param state:number
   * @returns goodsmise<boolean>
   */

  public updateGoodsState(goodsId: number, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let updateGoodsStateData = new GoodsUpdateStateForm();
    updateGoodsStateData.goodsId = goodsId;
    updateGoodsStateData.storeId = storeId;
    updateGoodsStateData.state = state;
    return new Promise(resolve => {
      this.storeGoodsMgr.updateGoodsState(storeId, updateGoodsStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  /**
   * 批量修改商品状态
   * @param storeId:string
   * @param goodIdset:Array<number>
   * @param state:number
   * @returns goodsmise<boolean>
   */
  public batchUpdateGoodsState(goodIdset: Array<string>, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let batchUpdateGoodsStateData = new GoodsBatchUpdateStateForm();
    batchUpdateGoodsStateData.goodIds = goodIdset;
    batchUpdateGoodsStateData.storeId = storeId;
    batchUpdateGoodsStateData.state = state;
    return new Promise(resolve => {
      this.storeGoodsMgr.batchUpdateGoodsState(storeId, batchUpdateGoodsStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


  public deleteGoods(removeForm: GoodsRemoveForm): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise(resolve => {
      this.storeGoodsMgr.deleteGoods(storeId, removeForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public updateGoodsToTop(goodsId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let toTopData = new GoodsAddToTopForm();
    toTopData.goodsId = goodsId;
    return new Promise(resolve => {
      this.storeGoodsMgr.toTop(storeId,toTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public updateGoodsCancelTop(goodsId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let cancelTopData = new GoodsCancelTopForm();
    cancelTopData.goodsId = goodsId;
    return new Promise(resolve => {
      this.storeGoodsMgr.cancelTop(storeId,cancelTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

}
