import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ChainPackageProjectMgr} from "../../../../bsModule/chainPackageProject/chainPackageProjectMgr";
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PackageProjectRemoveForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectRemoveForm";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {PageResp} from "../../../../comModule/PageResp";
import {PackageProjectUpdateStateForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectUpdateStateForm";
import {PackageProjectBatchUpdateStateForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectBatchUpdateStateForm";
import {PackageStateEnum} from "../../../../bsModule/chainPackageProject/data/PackageStateEnum";
import {Popup} from "../../../common/popup/popup";
import {Constants} from "../../../common/Util/Constants";
import {ChainPackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {PackageProjectDetail} from "../../../../bsModule/chainPackageProject/data/PackageProjectDetail";
import {PackageProjectDetailQueryForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectDetailQueryForm";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {PackageProjectDetailMgr} from "../../../../bsModule/chainPackageProject/chainPackageProjectDetailMgr";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {PackageProjectAllotForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectAllotForm";
import {PackageProjectBatchAllotForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectBatchAllotForm";
import {StoreVD} from "../addPackage/addPackage";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MgrPool} from "../../../../comModule/MgrPool";


@Component({
  selector: 'store-package-list',
  templateUrl: 'packageList.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PackageListComp implements OnInit,OnDestroy {

  private service: PackageListService;
  public viewData: PackageListViewData;
  private viewDataSub: any;
  private packageProjectIdArray = new Array<string>();//batchChangeState


  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private packageProjectDetailMgr: PackageProjectDetailMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new PackageListService(
      this.chainPackageProjectMgr,
      this.packageProjectDetailMgr,
      this.chainPackageProjectSynDataHolder,
      this.chainPackageProjectViewDataMgr,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainPackageProjectViewDataMgr.subscribePackageListVD((viewDataP: PackageListViewData) => {
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

  public goPackageDetail(packageProjectDetailId) {
    AppRouter.goPackageDetail(packageProjectDetailId)
  }

  public goAddPackageProject() {
    AppRouter.goAddPackageProject();
  }

  public goAddPackageProjectType() {
    AppRouter.goAddPackageProjectType();
  }

  public goEditPackageProject(packageDetailId) {
    AppRouter.goEditPackageProject(packageDetailId);
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
  public queryList() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.nameOrNumber)) {
      this.viewData.queryForm.nameOrNumber = AppUtils.trimBlank(this.viewData.queryForm.nameOrNumber);
    }
    this.callbackRefreshData();

  }

  /**
   * 改变状态事件 上架 下架
   */
  changeState(packageProjectId, state) {

    let title = PromptMsg.PROMPT;
    let content = "";
    state == 1 ? content = PromptMsg.DISABLED : content = PromptMsg.ENABLED;
    Popup.getInstance().open(title, "确定" + content + "吗？", () => {
      this.service.updateState(packageProjectId, state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.callbackRefreshData();

          }
          else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    });

  }

  /**
   * 批量改变状态事件
   */
  batchChangeState(state) {
    let title = PromptMsg.PROMPT;
    let content = "";
    state === PackageStateEnum.Open ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    this.buildIdArray();

    if (this.packageProjectIdArray.length != 0) {
      this.service.batchUpdateState(this.packageProjectIdArray, state).then(
        (success) => {
          if (success) {
            this.packageProjectIdArray = new Array<string>();
            AppUtils.showSuccess(title, content + "成功");
            this.callbackRefreshData();

          } else {
            AppUtils.showError(title, content + "失败");
          }
        }
      );
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请至少选择一条数据");
    }
  }

  private buildIdArray() {
    for (let item of this.viewData.packageProjectList) {
      if (item.checked == true) {
        this.packageProjectIdArray.push(item.id);
      }
    }
  }


  //分配
  public allotStores(packageDetail: PackageProjectDetail) {
    this.viewData.storeList.forEach((item) => {
      item.checked = false;
    });
    let ids = packageDetail.applyStoreIds;
    if (ids) {
      for (let id of ids) {
        this.viewData.storeList.forEach((item) => {
          if (item.id == id) {
            item.checked = true
          }
        });
      }
    }

    let modalData = {storeList: this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList: Array<StoreVD>) => {
      tmp.getSelectedStore(packageDetail, storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp, modalData, callBack);
  }

  private getSelectedStore(item: PackageProjectDetail, storeList: Array<StoreVD>) {
    if (storeList && storeList.length > 0) {
      this.viewData.selectStoreList = null;
      this.viewData.selectStoreList = storeList;
      this.viewData.selectStoreIds = storeList.map((item) => {
        return item.id;
      });
    }

    this.service.allotStore(item.id, this.viewData.selectStoreIds).then((success) => {
      if (success) {
        AppUtils.showSuccess("提示", "分配成功");
        this.callbackRefreshData();

      } else {
        AppUtils.showError("提示", "分配失败");
      }
    });
  }

  /**删除套餐*/
  removePackageProject(packageProject: PackageProjectDetail) {
    let tmp = this;
    Popup.getInstance().open("删除套餐", "确定删除#" + packageProject.name + "#?", () => {
      tmp.deletePackageProject(packageProject);
    });
  }


  private deletePackageProject(packageProject: PackageProjectDetail) {
    let removeForm: PackageProjectRemoveForm = new PackageProjectRemoveForm();
    removeForm.id = packageProject.id;
    this.service.deletePackageProject(removeForm).then((success) => {
      if (success) {
        AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
        this.callbackRefreshData();

      } else {
        AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
      }
    });
  }

  private callbackRefreshData() {
    this.service.getPageData();
  }

}


export class PackageListViewData {
  public static getInstance(): PackageListViewData {
    let target = MgrPool.getInstance().get("PackageListViewData", PackageListViewData);
    if (AppUtils.isNullObj(target)) {
      target = new PackageListViewData();
    }
    return target;
  }

  public initData() {
    MgrPool.getInstance().setNull("PackageListViewData", PackageListViewData);
  }

  packageProjectList: Array<PackageProjectDetail> = new Array<PackageProjectDetail>();//原始数据
  recordCount: number;//总记录数
  loadingFinish: boolean = false;

  packageProjectTypeList: Array<PackageProjectType> = new Array<PackageProjectType>();
  packageProjectTypeMap: ZmMap<PackageProjectType>;

  curPage: number = 1;
  queryForm: PackageProjectDetailQueryForm = new PackageProjectDetailQueryForm();
  state: number = Constants.DEFAULT_STATE_VALUE;


  //分配门店相关
  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();

}


class PackageListService {

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private packageProjectDetailMgr: PackageProjectDetailMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private storeMgr: StoreMgr,) {
  }

  public initViewData() {
    this.chainPackageProjectViewDataMgr.setPackageListViewData(PackageListViewData.getInstance());

    this.buildViewData().then(
      (viewDataTmp: PackageListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }


  public handleViewData(viewDataP: PackageListViewData) {
    this.chainPackageProjectViewDataMgr.setPackageListViewData(viewDataP);
  }


  /**
   * 组装packageProjectListViewData
   * @param chainId
   * @param status
   * @returns Promise<StorePrdInfoListViewData>
   */

  public async buildViewData(): Promise<PackageListViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: PackageListViewData = PackageListViewData.getInstance();
    let storePageResp = await this.storeMgr.findStoreByCond(chainId);
    if (storePageResp) {
      viewDataTmp.storeList = storePageResp.list.map((store) => {
        return StoreVD.fromStore(store);
      });
    }
    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    if (chainPackageProject) {
      viewDataTmp.packageProjectTypeMap = chainPackageProject.getAllPackageTypeMap();
      viewDataTmp.packageProjectTypeList = chainPackageProject.getValidPackageTypeMap().values();
    }
    let queryForm: PackageProjectDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.packageProjectDetailMgr.getPackageProjectDetailPageInfo(queryForm);

    viewDataTmp.packageProjectList = pageResp.list;
    viewDataTmp.packageProjectList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    return new Promise<PackageListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public async getPageData() {

    let viewDataTmp: PackageListViewData = PackageListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let queryForm: PackageProjectDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.packageProjectDetailMgr.getPackageProjectDetailPageInfo(queryForm);
    viewDataTmp.packageProjectList = pageResp.list;
    viewDataTmp.packageProjectList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewDataTmp: PackageListViewData) {
    let chainId = SessionUtil.getInstance().getChainId();
    let queryForm: PackageProjectDetailQueryForm = new PackageProjectDetailQueryForm();
    queryForm.chainId = chainId;
    queryForm.nameOrNumber = viewDataTmp.queryForm.nameOrNumber;

    if (viewDataTmp.state != Constants.DEFAULT_STATE_VALUE) {
      queryForm.statusSet.push(viewDataTmp.state);
    }

    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = "" : queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }

  /**
   * 修改套餐状态
   */

  public updateState(packageProjectId: string, state: number): Promise<boolean> {
    let updateStateForm = new PackageProjectUpdateStateForm();
    updateStateForm.id = packageProjectId;
    updateStateForm.state = state;

    return new Promise(resolve => {
      this.chainPackageProjectMgr.updateState(updateStateForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  /**
   * 批量修改套餐状态
   */
  public batchUpdateState(idSet: Array<string>, state: number): Promise<boolean> {
    let batchUpdateStateForm = new PackageProjectBatchUpdateStateForm();
    batchUpdateStateForm.idSet = idSet;
    batchUpdateStateForm.state = state;
    return new Promise(resolve => {
      this.chainPackageProjectMgr.batchUpdateState(batchUpdateStateForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public allotStore(goodsId: string, applyStoreIds: Array<string>): Promise<boolean> {
    let allotForm = new PackageProjectAllotForm();
    allotForm.id = goodsId;
    allotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainPackageProjectMgr.allotStore(allotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchAllotStore(ids: Array<string>, applyStoreIds: Array<string>): Promise<boolean> {
    let batchAllotForm = new PackageProjectBatchAllotForm();
    batchAllotForm.ids = ids;
    batchAllotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainPackageProjectMgr.batchAllotStore(batchAllotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public deletePackageProject(deleteForm: PackageProjectRemoveForm): Promise<boolean> {
    return new Promise(resolve => {
      this.chainPackageProjectMgr.deletePackageProject(deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


}

