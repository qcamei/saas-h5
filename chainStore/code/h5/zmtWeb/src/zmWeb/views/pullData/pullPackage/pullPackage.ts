import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ChainDataQueryForm} from "../../../bsModule/chainDataSyn/apiData/ChainDataQueryForm";
import {GenericSelect} from "../../../comModule/bean/GenericSelect";
import {PackageProjectSyn} from "../../../bsModule/chainDataSyn/data/PackageProjectSyn";
import {PackageProjectType} from "../../../bsModule/chainPackageProject/data/PackageProjectType";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainDataSynMgr} from "../../../bsModule/chainDataSyn/ChainDataSynMgr";
import {ChainPackageProjectMgr} from "../../../bsModule/chainPackageProject/ChainPackageProjectMgr";
import {StorePackageProjectMgr} from "../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {PullDataViewDataMgr} from "../pullViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ChainPackageProject} from "../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {PageResp} from "../../../comModule/PageResp";
import {PackagePullForm} from "../../../bsModule/storePackageProject/apiData/PackagePullForm";
import {PackageBatchPullForm} from "../../../bsModule/storePackageProject/apiData/PackageBatchPullForm";
import {PackageCancelForm} from "../../../bsModule/storePackageProject/apiData/PackageCancelForm";
import {PackageBatchCancelForm} from "../../../bsModule/storePackageProject/apiData/PackageBatchCancelForm";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainDataStatusEnum} from "../../../bsModule/chainDataSyn/data/ChainDataStatusEnum";

@Component({
  selector: 'pull-package',
  templateUrl: 'pullPackage.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class PullPackagePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: PullPackageService;
  public viewData: PullPackageViewData;

  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainPackageProjectMgr:ChainPackageProjectMgr,
              private storePackageProjectMgr:StorePackageProjectMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new PullPackageService(this.chainDataSynMgr,
      this.chainPackageProjectMgr,
      this.storePackageProjectMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.pullDataViewDataMgr.subscribePullPackageVD((viewDataP:PullPackageViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 全选/反选
   * @param isSelected
   */
  checkAll(isSelected:boolean){
    if(isSelected){
      this.viewData.list.forEach((item:GenericSelect<PackageProjectSyn>)=>{
        if(item.target.synStatus == ChainDataStatusEnum.NOT_HAVE){
          item.isSelected = true;
        }
      })
    }else{
      this.viewData.list.forEach((item:GenericSelect<PackageProjectSyn>)=>{
        item.isSelected = false;
      })
    }
  }

  /**
   * 获取
   * @param id
   */
  pullData(id:string){
    this.service.pullData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","获取失败");
      }
    })
  }

  /**
   * 批量获取
   */
  batchPullData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<PackageProjectSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchPullData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择获取项");
    }
  }

  /**
   * 取消获取
   * @param id
   */
  cancelData(id){
    this.service.cancelData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","取消获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","取消获取失败");
      }
    })
  }

  /**
   * 批量取消获取
   */
  batchCancelData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<PackageProjectSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchCancelData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","取消获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","取消获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择取消项");
    }
  }

  /**
   * 跳转详情
   * @param id
   */
  goDetail(id){
    AppRouter.goChainPackageDetail(id);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    if(!AppUtils.isNullObj(this.viewData.chainDataQueryForm.numberOrName)){
      this.viewData.chainDataQueryForm.numberOrName = AppUtils.isNullOrWhiteSpace(this.viewData.chainDataQueryForm.numberOrName)?'':AppUtils.trimBlank(this.viewData.chainDataQueryForm.numberOrName);
    }
    this.service.getPageData(curPage,this.viewData);
  }

}

export class PullPackageService{
  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainPackageProjectMgr:ChainPackageProjectMgr,
              private storePackageProjectMgr:StorePackageProjectMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,){}

  public initViewData():void{
    let viewDataTmp = new PullPackageViewData();
    this.pullDataViewDataMgr.setPullPackageViewData(viewDataTmp);

    this.buildViewData();
  }

  public async buildViewData(){
    let viewDataTmp = new PullPackageViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let chainPackageProject:ChainPackageProject = await this.chainPackageProjectMgr.get(chainId);
    if(!AppUtils.isNullObj(chainPackageProject)){
      let typeMap = ZmMap.fromMap(PackageProjectType,"id",chainPackageProject.packageProjectTypeMap);
      viewDataTmp.typeList = typeMap.values();
    }

    viewDataTmp.chainDataQueryForm.chainId = chainId;
    let storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.chainDataQueryForm.storeId = storeId;
    let pageResp: PageResp = await this.chainDataSynMgr.findChainPackageProject(viewDataTmp.chainDataQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.curPage = 1;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.list = GenericSelect.fromList(pageResp.list);
    }

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullPackageViewData(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewDataTmp: PullPackageViewData) {
    viewDataTmp.loadingFinish = false;
    viewDataTmp.allChecked = false;
    viewDataTmp.recordCount = 0;
    viewDataTmp.list = [];

    let pageResp: PageResp = await this.chainDataSynMgr.findChainPackageProject(viewDataTmp.chainDataQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.curPage = curPage;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.list = GenericSelect.fromList(pageResp.list);
    }

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullPackageViewData(viewDataTmp);
  }

  /**
   * 获取
   * @param id
   * @returns {Promise<boolean>}
   */
  public pullData(id:string):Promise<boolean>{
    let chainId = SessionUtil.getInstance().getChainId();
    let packagePullForm = new PackagePullForm();
    packagePullForm.chainId = chainId;
    packagePullForm.id = id;
    return this.storePackageProjectMgr.pullPackageFromChain(packagePullForm);
  }

  /**
   * 批量获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchPullData(idArr:Array<string>):Promise<boolean>{
    let chainId = SessionUtil.getInstance().getChainId();
    let packageBatchPullForm = new PackageBatchPullForm();
    packageBatchPullForm.pullForms = idArr.map((id:string)=>{
      let packagePullForm = new PackagePullForm();
      packagePullForm.chainId = chainId;
      packagePullForm.id = id;
      return packagePullForm;
    })
    return this.storePackageProjectMgr.batchPullPackageFromChain(packageBatchPullForm);
  }

  /**
   * 取消获取
   * @param id
   * @returns {Promise<boolean>}
   */
  cancelData(id:string):Promise<boolean>{
    let chainId = SessionUtil.getInstance().getChainId();
    let packageCancelForm = new PackageCancelForm();
    packageCancelForm.chainId = chainId;
    packageCancelForm.id = id;
    return this.storePackageProjectMgr.cancelChainPackage(packageCancelForm);
  }

  /**
   * 批量取消获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchCancelData(idArr:Array<string>):Promise<boolean>{
    let chainId = SessionUtil.getInstance().getChainId();
    let packageBatchCancelForm = new PackageBatchCancelForm();
    packageBatchCancelForm.cancelForms = idArr.map((id:string)=>{
      let packageCancelForm = new PackageCancelForm();
      packageCancelForm.chainId = chainId;
      packageCancelForm.id = id;
      return packageCancelForm;
    })
    return this.storePackageProjectMgr.batchCancelChainPackage(packageBatchCancelForm);
  }

}

export class PullPackageViewData{
  public chainDataQueryForm:ChainDataQueryForm = new ChainDataQueryForm();
  public list:Array<GenericSelect<PackageProjectSyn>> = new Array<GenericSelect<PackageProjectSyn>>();
  public typeList: Array<PackageProjectType> = new Array<PackageProjectType>();
  public allChecked:boolean = false;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;
}
