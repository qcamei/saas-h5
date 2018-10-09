import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Popup} from "../../common/popup/popup";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {ChainStore} from "../../../bsModule/chain/data/ChainStore";
import {ChainViewDataMgr} from "../ChainViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ApplyChainDoForm} from "../../../bsModule/chain/apiData/ApplyChainDoForm";
import {ApplyChainBatchDoForm} from "../../../bsModule/chain/apiData/ApplyChainBatchDoForm";
import {PageResp} from "../../../comModule/PageResp";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {StoreQueryForm} from "../../../bsModule/store/apiData/StoreQueryForm";
import {Store} from "../../../bsModule/store/data/Store";
import {AppRouter} from "../../../comModule/AppRouter";
import {ApplyStatusEnum} from "../../../bsModule/chain/data/ApplyStatusEnum";
import {RelieveStoreForm} from "../../../bsModule/chain/apiData/RelieveStoreForm";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";

/**
 * 店铺管理 店铺列表和审核名单
 */
@Component({
  selector: 'storeList',
  templateUrl: 'storeList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles:[`
      .first-line tr:first-child{
        background-image:url(assets/images/icon/allStore.png);
        background-repeat: no-repeat;
        background-position:0 0;
        background-size:50px;
      }
   
  `]
})

export class StoreListPage implements OnInit,OnDestroy {

  private viewDataSub: any;
  private paramsSub: any;
  private service: StoreListService;
  public viewData: StoreListViewData;

  public defaultTab: string;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) {
    this.service = new StoreListService(
      this.chainViewDataMgr,
      this.chainMgr,
      this.chainSynDataHolder,
      this.storeMgr,
    );
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainViewDataMgr.subscribeStoreListVD((viewDataP: StoreListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let tabIndex = params['tabIndex'];
      if (tabIndex == 1) {
        this.defaultTab = "审核名单";
      } else {
        this.defaultTab = "店铺列表";
      }
      this.service.initViewData();
    });

  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  public selectTab(target:TabItem){
    if(target.name == "审核名单"){
      this.viewData.storeName = "";
    }
  }

  public goChainDetail(chainId: string) {
    AppRouter.goChainDetail(chainId, null);
  }

  public goStoreDetail(storeId: string) {
    AppRouter.goChainDetail(null, storeId);
  }

  public goEditChain(chainId: string) {
    AppRouter.goEditChain(chainId);
  }

  /******************店铺列表相关***********************/

  public findStoreList() {
    if (!AppUtils.isNullObj(this.viewData.storeName)) {
      this.viewData.storeName = AppUtils.trimBlank(this.viewData.storeName);
    }
    this.service.getPageData(this.viewData);
  }

  public getStorePageData(curPage) {
    this.viewData.storeCurPage = curPage;
    this.service.getPageData(this.viewData);
  }

  public unRelate(item: Store) {
    Popup.getInstance().open("提示", "确定要解除关联店铺#" + item.name + "#", () => {
      this.service.relieveStore(item.id, (successP: boolean) => {
        this.service.initViewData();
        if (successP) {
          AppUtils.showSuccess("提示", "解除关联成功");
        } else {
          AppUtils.showError("提示", "解除关联失败");
        }
      })
    });
  }


  /******************审核名单相关***********************/

  /**
   * 店铺审核 页面点击事件
   * @param storeId
   * @param status  ApplyStatusEnum
   */

  public findApplyStoreList() {
    if (!AppUtils.isNullObj(this.viewData.applyStoreName)) {
      this.viewData.applyStoreName = AppUtils.trimBlank(this.viewData.applyStoreName);
    }
    this.service.getPageData(this.viewData);
  }


  public getApplyStorePageData(curPage) {
    this.viewData.applyStoreCurPage = curPage;
    this.service.getPageData(this.viewData);
  }

  handleApplyChain(storeId, status) {
    let tip = "确认通过审核？";
    if (status == ApplyStatusEnum.UNPASS) {
      tip = "确认拒绝该申请？"
    }
    Popup.getInstance().open("提示", tip, () => {
      this.service.handleApplyStore(storeId, status, (successP: boolean) => {
        this.service.initViewData();
        if (successP) {
          AppUtils.showSuccess("提示", "审核成功");
        } else {
          AppUtils.showError("提示", "审核失败");
        }
      })
    });
  }

}

export class StoreListService {
  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr) {
  }

  public initViewData(): void {
    let viewDataTmp = new StoreListViewData();
    this.chainViewDataMgr.setStoreListViewData(viewDataTmp);

    this.buildViewData((viewDataP: StoreListViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    this.chainViewDataMgr.setStoreListViewData(viewDataP);
  }

  /**
   * 查询storeClerkInfo 组装数据
   * @param callback
   */
  public async buildViewData(callback: (viewDataP: StoreListViewData) => void) {
    let viewDataTmp = new StoreListViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let chain: Chain = await this.chainSynDataHolder.getData(chainId);
    if (chain) {
      viewDataTmp.chain = chain;
      let store: StoreVD = StoreVD.fromChain(chain);
      viewDataTmp.storeList.push(store);

      viewDataTmp.storeMap = chain.getChainStoreMap();
      if (viewDataTmp.storeMap.values().length > 0) {
        let storeList = viewDataTmp.storeMap.values();
        let storeIds = storeList.map((item) => {
          return item.storeId;
        });

        let queryForm: StoreQueryForm = new StoreQueryForm();
        queryForm.chainId = chain.id;
        queryForm.storeIds = storeIds.join(',');

        let storePageResp: PageResp = await this.storeMgr.findChainStores(queryForm);
        let storeListTmp: Array<StoreVD> = storePageResp.list.map((item) => {
          return StoreVD.fromStore(item)
        });
        viewDataTmp.storeList = viewDataTmp.storeList.concat(storeListTmp);
        viewDataTmp.storeRecordCount = storePageResp.totalCount;
      }
      // viewDataTmp.storeRecordCount = parseInt(viewDataTmp.storeRecordCount.toString()) + parseInt("1");


      viewDataTmp.applyStoreMap = chain.getApplyStoreMap();
      if (viewDataTmp.applyStoreMap.values().length > 0) {
        let applyStoreList = viewDataTmp.applyStoreMap.values();
        let applyStoreIds = applyStoreList.map((item) => {
          return item.storeId;
        });

        let applyStoreQueryForm: StoreQueryForm = new StoreQueryForm();
        applyStoreQueryForm.storeIds = applyStoreIds.join(',');

        let applyStorePageResp: PageResp = await this.storeMgr.findApplyStores(applyStoreQueryForm);
        viewDataTmp.applyStoreList = applyStorePageResp.list;
        viewDataTmp.applyStoreRecordCount = applyStorePageResp.totalCount;
      }
    }

    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  public async getPageData(viewData: StoreListViewData) {

    let viewDataTmp = new StoreListViewData();
    viewDataTmp.storeCurPage = viewData.storeCurPage;
    viewDataTmp.applyStoreCurPage = viewData.applyStoreCurPage;
    viewDataTmp.storeName = viewData.storeName;
    viewDataTmp.applyStoreName = viewData.applyStoreName;

    let chainId = SessionUtil.getInstance().getChainId();
    let chain: Chain = await this.chainSynDataHolder.getData(chainId);
    if (chain) {
      viewDataTmp.chain = chain;
      let store: StoreVD = StoreVD.fromChain(chain);
      viewDataTmp.storeList.push(store);


      viewDataTmp.storeMap = chain.getChainStoreMap();
      if (viewDataTmp.storeMap.values().length > 0) {
        let storeList = viewDataTmp.storeMap.values();
        let storeIds = storeList.map((item) => {
          return item.storeId;
        });

        let queryForm: StoreQueryForm = new StoreQueryForm();
        queryForm.chainId = chain.id;
        queryForm.storeIds = storeIds.join(',');
        queryForm.pageNo = viewDataTmp.storeCurPage;
        queryForm.name = viewDataTmp.storeName;
        let storePageResp: PageResp = await this.storeMgr.findChainStores(queryForm);
        let storeListTmp: Array<StoreVD> = storePageResp.list.map((item) => {
          return StoreVD.fromStore(item)
        });
        viewDataTmp.storeList = viewDataTmp.storeList.concat(storeListTmp);
        viewDataTmp.storeRecordCount = storePageResp.totalCount;
      }
      // viewDataTmp.storeRecordCount = parseInt(viewDataTmp.storeRecordCount.toString()) + parseInt("1");


      viewDataTmp.applyStoreMap = chain.getApplyStoreMap();
      if (viewDataTmp.applyStoreMap.values().length > 0) {
        let applyStoreList = viewDataTmp.applyStoreMap.values();
        let applyStoreIds = applyStoreList.map((item) => {
          return item.storeId;
        });

        let applyStoreQueryForm: StoreQueryForm = new StoreQueryForm();
        applyStoreQueryForm.storeIds = applyStoreIds.join(',');
        applyStoreQueryForm.pageNo = viewDataTmp.applyStoreCurPage;
        applyStoreQueryForm.name = viewDataTmp.applyStoreName;
        let applyStorePageResp: PageResp = await this.storeMgr.findApplyStores(applyStoreQueryForm);
        viewDataTmp.applyStoreList = applyStorePageResp.list;
        viewDataTmp.applyStoreRecordCount = applyStorePageResp.totalCount;
      }
    }

    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

  /**
   * 处理店铺申请
   * @param storeId
   * @param status
   * @param callback
   */
  public handleApplyStore(storeId: string, status: number, callback: (successP: boolean) => void) {
    let chainId = SessionUtil.getInstance().getChainId();
    let applyForm: ApplyChainDoForm = new ApplyChainDoForm();
    applyForm.chainId = chainId;
    applyForm.storeId = storeId;
    applyForm.status = status;

    this.chainMgr.handleApplyChain(applyForm).then((success) => {
      callback(success);
    })
  }

  public relieveStore(storeId: string, callback: (successP: boolean) => void) {
    let chainId = SessionUtil.getInstance().getChainId();
    let relieveStoreForm: RelieveStoreForm = new RelieveStoreForm();
    relieveStoreForm.chainId = chainId;
    relieveStoreForm.storeId = storeId;
    this.chainMgr.relieveStore(relieveStoreForm).then((success) => {
      callback(success);
    })
  }

  /**
   * 批量审核
   * @param storeIdArr
   * @param status
   */
  public batchHandleApplyChain(storeIdArr: Array<string>, status: number, callback: (successP: boolean) => void) {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchApplyForm: ApplyChainBatchDoForm = new ApplyChainBatchDoForm();
    batchApplyForm.chainId = chainId;
    batchApplyForm.storeIds = storeIdArr;
    batchApplyForm.status = status;
    this.chainMgr.batchHandleApplyChain(batchApplyForm).then((success) => {
      callback(success);
    });
  }

}

export class StoreListViewData {

  public chain: Chain = new Chain();
  public storeMap: ZmMap<ChainStore>;
  public applyStoreMap: ZmMap<ChainStore>;

  public storeList: Array<StoreVD> = new Array<StoreVD>();//已加入的店铺+chain
  public applyStoreList: Array<StoreVD> = new Array<StoreVD>();//申请加入的店铺

  //查询参数
  public storeName: string = "";
  public applyStoreName: string = "";

  public storeCurPage: number = 1;//当前页码
  public storeRecordCount: number = 0;//店铺总记录数
  public applyStoreCurPage: number = 1;//申请店铺当前页码
  public applyStoreRecordCount: number;//申请店铺总记录数

  public loadingFinish: boolean = false;
}
class TabItem{
  name:string;
  active:boolean;
}
