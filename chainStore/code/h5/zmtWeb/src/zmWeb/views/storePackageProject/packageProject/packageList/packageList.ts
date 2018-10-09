import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {StorePackageProjectMgr} from "../../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {PackageProjectDetailMgr} from "../../../../bsModule/packageProjectDetail/packageProjectDetailMgr";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PackageProjectDetail} from "../../../../bsModule/packageProjectDetail/data/PackageProjectDetail";
import {PackageProjectRemoveForm} from "../../../../bsModule/storePackageProject/apiData/PackageProjectRemoveForm";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {PackageProjectType} from "../../../../bsModule/storePackageProject/data/PackageProjectType";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {PackageProjectDetailQueryForm} from "../../../../bsModule/packageProjectDetail/apiData/PackageProjectDetailQueryForm";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {PageResp} from "../../../../comModule/PageResp";
import {PackageProjectUpdateStateForm} from "../../../../bsModule/storePackageProject/apiData/PackageProjectUpdateStateForm";
import {PackageProjectBatchUpdateStateForm} from "../../../../bsModule/storePackageProject/apiData/PackageProjectBatchUpdateStateForm";
import {PackageStateEnum} from "../../../../bsModule/storePackageProject/data/PackageStateEnum";
import {Popup} from "../../../common/popup/popup";
import {Constants} from "../../../common/Util/Constants";
import {MgrPool} from "../../../../comModule/MgrPool";
import {PkgPrjAddTopForm} from "../../../../bsModule/storePackageProject/apiData/PkgPrjAddTopForm";
import {PkgPrjCancelTopForm} from "../../../../bsModule/storePackageProject/apiData/PkgPrjCancelTopForm";


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
  public isSelectedAll: boolean = false;


  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private packageProjectDetailMgr: PackageProjectDetailMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new PackageListService(
      this.storePackageProjectMgr,
      this.packageProjectDetailMgr,
      this.storePackageProjectSynDataHolder,
      this.storePackageProjectViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storePackageProjectViewDataMgr.subscribePackageListVD((viewDataP: PackageListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.storePackageProjectViewDataMgr.setPackageListViewData(PackageListViewData.getInstance());
    this.service.initViewData();
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
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
  public goPullPackage(){
    AppRouter.goPullPackage();
  }

  public goPackageDetail(packageProjectDetailId) {
    AppRouter.goPackageDetail(packageProjectDetailId)
  }

  public goAddPackageProject() {
    AppRouter.goAddPackageProject();
  }

  public goEditPackageProject(packageDetailId) {
    AppRouter.goEditPackageProject(packageDetailId);
  }

  public selectAll() {
    let listTmp: Array<PackageProjectDetail> = new Array<PackageProjectDetail>();
    let list = this.viewData.packageProjectList;
    for (let item of list) {
      let packageProjectDetail = new PackageProjectDetail();
      AppUtils.copy(packageProjectDetail,item);
      packageProjectDetail.checked = this.isSelectedAll;
      listTmp.push(packageProjectDetail);
    }
    this.viewData.packageProjectList = listTmp;
  }

  public checkList() {
    let checkList = new Array<boolean>();
    let list = this.viewData.packageProjectList;
    for (let item of  list) {
      checkList.push(item.checked);
    }
    if (AppUtils.arrayContains(checkList, false)) {
      this.isSelectedAll = false;
    } else {
      this.isSelectedAll = true;
    }
  }

  /**删除套餐*/
  removePackageProject(packageProject:PackageProjectDetail) {
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
        this.service.initViewData();
      } else {
        AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
      }
    });
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.viewData.curPage = curPage;
    this.service.initViewData();

  }

  /**
   * 按条件查询
   */
  public queryList() {
    if(!AppUtils.isNullObj(this.viewData.queryForm.nameOrNumber)){
      this.viewData.queryForm.nameOrNumber = AppUtils.trimBlank(this.viewData.queryForm.nameOrNumber);
    }
    this.service.initViewData();
  }

  packageToTop(packageDetail:PackageProjectDetail){
    Popup.getInstance().open("提示", "确定将#"+packageDetail.name+"#置顶吗？", () => {
      this.service.updatePackageToTop(packageDetail.id).then(
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

  packageCancelTop(packageDetail:PackageProjectDetail){
    Popup.getInstance().open("提示", "确定将#"+packageDetail.name+"#取消置顶吗？", () => {
      this.service.updatePackageCancelTop(packageDetail.id).then(
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
   * 改变状态事件 上架 下架
   */
  changeState(packageProjectId,state) {

    let title = PromptMsg.PROMPT;
    let content = "";
    state == 1 ? content = PromptMsg.DISABLED : content = PromptMsg.ENABLED;
    Popup.getInstance().open(title, "确定" + content + "吗？", () => {
      this.service.updateState(packageProjectId, state).then(
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
    for (let item of this.viewData.packageProjectList) {
      if (item.checked == true) {
        this.packageProjectIdArray.push(item.id);
      }
    }
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
            this.service.initViewData();
          } else {
            AppUtils.showError(title, content + "失败");
          }
        }
      );
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请至少选择一条数据");
    }
  }


}


export class PackageListViewData {

  public static getInstance():PackageListViewData{
    let target = MgrPool.getInstance().get("PackageListViewData",PackageListViewData);
    if(AppUtils.isNullObj(target)){
      target = new PackageListViewData();
    }
    return target;
  }

  public initData(){
    MgrPool.getInstance().setNull("PackageListViewData",PackageListViewData);
  }

  packageProjectList: Array<PackageProjectDetail> = new Array<PackageProjectDetail>();//原始数据
  recordCount: number;//总记录数
  loadingFinish: boolean = false;

  packageProjectTypeList: Array<PackageProjectType> = new Array<PackageProjectType>();
  packageProjectTypeMap: ZmMap<PackageProjectType> ;

  curPage:number = 1;
  queryForm: PackageProjectDetailQueryForm = new PackageProjectDetailQueryForm();
  status:number = Constants.DEFAULT_STATE_VALUE;

}


class PackageListService {

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private packageProjectDetailMgr: PackageProjectDetailMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,) {
  }

  public initViewData() {

    this.buildViewData().then(
      (viewDataTmp: PackageListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }


  public handleViewData(viewDataP: PackageListViewData) {
    this.storePackageProjectViewDataMgr.setPackageListViewData(viewDataP);
  }


  /**
   * 组装packageProjectListViewData
   * @param storeId
   * @param status
   * @returns Promise<StorePrdInfoListViewData>
   */

  public async buildViewData():Promise<PackageListViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: PackageListViewData = PackageListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let storePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    if(storePackageProject){
      viewDataTmp.packageProjectTypeMap = storePackageProject.getAllPackageTypeMap();
      viewDataTmp.packageProjectTypeList = storePackageProject.getValidPackageTypeMap().values();
    }
    let queryForm: PackageProjectDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.packageProjectDetailMgr.getPackageProjectDetailPageInfo(queryForm);
    if(pageResp && pageResp.list){
      viewDataTmp.packageProjectList = pageResp.list;
      viewDataTmp.packageProjectList.sort(function (item1, item2) {
        let a = item1.number;
        let b = item2.number;
        return a.localeCompare(b);
      });
      viewDataTmp.recordCount = pageResp.totalCount;
    }
    viewDataTmp.loadingFinish = true;

    return new Promise<PackageListViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private buildQueryForm(viewDataTmp:PackageListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let queryForm: PackageProjectDetailQueryForm = new PackageProjectDetailQueryForm();
    queryForm.storeId = storeId;
    queryForm.nameOrNumber = viewDataTmp.queryForm.nameOrNumber;
    queryForm.statusSet.push(viewDataTmp.status);
    AppUtils.uniquelize(viewDataTmp.queryForm.statusSet);
    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = "" : queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }

  /**
   * 修改套餐状态
   */

  public updateState(packageProjectId:string,state: number): Promise<boolean> {
    let updateStateForm = new PackageProjectUpdateStateForm();
    updateStateForm.id = packageProjectId;
    updateStateForm.state = state;

    return new Promise(resolve => {
      this.storePackageProjectMgr.updateState(updateStateForm).then(
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
      this.storePackageProjectMgr.batchUpdateState(batchUpdateStateForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public deletePackageProject(deleteForm:PackageProjectRemoveForm): Promise<boolean> {
    return new Promise(resolve => {
      this.storePackageProjectMgr.deletePackageProject(deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


  public updatePackageToTop(packageId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let toTopData = new PkgPrjAddTopForm();
    toTopData.id = packageId;
    return new Promise(resolve => {
      this.storePackageProjectMgr.toTop(toTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public updatePackageCancelTop(packageId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let cancelTopData = new PkgPrjCancelTopForm();
    cancelTopData.id = packageId;
    return new Promise(resolve => {
      this.storePackageProjectMgr.cancelTop(cancelTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


}

