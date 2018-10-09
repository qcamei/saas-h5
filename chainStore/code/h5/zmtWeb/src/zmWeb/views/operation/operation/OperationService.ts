import {WorkFlowMgr} from "../../../bsModule/workFlow/WorkFlowMgr";
import {WorkFlowTypeMgr} from "../../../bsModule/workFlowType/WorkFlowTypeMgr";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {OperationViewDataMgr} from "../OperationViewDataMgr";
import {OperationViewData, OperationFlowViewData} from "./OperationViewData";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {WorkFlowType} from "../../../bsModule/workFlowType/data/WorkFlowType";
import {WorkFlowDataQueryForm} from "../../../bsModule/workFlow/apiData/WorkFlowDataQueryForm";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {PageResp} from "../../../comModule/PageResp";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";

export class OperationService {

  constructor(private workFlowMgr: WorkFlowMgr,
              private workFlowTypeMgr: WorkFlowTypeMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private operationViewDataMgr: OperationViewDataMgr,) {
  }

  public initViewData(curPage) {
    this.operationViewDataMgr.setOperationListViewData(new OperationViewData());

    this.buildViewData(curPage, (viewDataTmp: OperationViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: OperationViewData) {
    this.operationViewDataMgr.setOperationListViewData(viewDataP);
  }


  private async buildViewData(curPage, callBack: (viewDataTmp) => void) {
    let viewDataTmp = new OperationViewData();

    let storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.buserPermData = SessionUtil.getInstance().getUserPermData();
    viewDataTmp.wFTypeMap = await this.buildWFTypeMap();
    viewDataTmp.leaguerMap = await this.buildLeaguerMap(storeId);
    //查询工作流
    let pageResp: PageResp = await this.getWorkFlowDataListByRole(curPage, viewDataTmp);
    viewDataTmp.workFlowDataList = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.operationFlowViewDataList = this.buildOperationFlowViewDataList(viewDataTmp);
    viewDataTmp.loadingFinish = true;
    callBack(viewDataTmp);
  }

  public async getPageData(curPage, viewData, callBack: (viewDataTmp) => void) {
    let viewDataTmp = new OperationViewData();
    viewDataTmp.leaguerMap = viewData.leaguerMap;
    viewDataTmp.wFTypeMap = viewData.wFTypeMap;
    viewDataTmp.leaguerNameOrPhone = viewData.leaguerNameOrPhone;
    viewDataTmp.buserPermData = SessionUtil.getInstance().getUserPermData();
    viewDataTmp.curPage = curPage;
    viewDataTmp.loadingFinish = false;
    //查询工作流
    let pageResp: PageResp = await this.getWorkFlowDataListByRole(curPage, viewDataTmp);

    viewDataTmp.workFlowDataList = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.operationFlowViewDataList = this.buildOperationFlowViewDataList(viewDataTmp);
    viewDataTmp.loadingFinish = true;
    callBack(viewDataTmp);
  }

  private async buildWFTypeMap() {
    let wFTypeListTmp: Array<WorkFlowType> = await this.workFlowTypeMgr.getWFTypeList();
    let wFTypeMap = this.buildwFTypeMap(wFTypeListTmp);
    return wFTypeMap;
  }

  private buildwFTypeMap(wFTypeListTmp: Array<WorkFlowType>) {
    let wFTypeMapTmp: ZmMap<WorkFlowType> = new ZmMap<WorkFlowType>();
    for (let item of wFTypeListTmp) {
      wFTypeMapTmp.put(item.id.toString(), item);
    }
    return wFTypeMapTmp;
  }

  private async buildLeaguerMap(storeId: string) {
    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    let leaguerMap:ZmMap<Leaguer> = storeLeaguerInfo.getAllLeaguerMap();
    return leaguerMap;
  }

  private buildWorkFlowDataQueryForm(curPage, leaguerNameOrPhone) {
    let workFlowDataQueryForm = new WorkFlowDataQueryForm();
    workFlowDataQueryForm.storeId = SessionUtil.getInstance().getStoreId();
    workFlowDataQueryForm.pageItemCount = 10;
    workFlowDataQueryForm.pageNo = curPage;
    workFlowDataQueryForm.leaguerNameOrPhone = leaguerNameOrPhone;
    return workFlowDataQueryForm;
  }

  /**组装流程列表显示数据*/
  private buildOperationFlowViewDataList(viewDataTmp: OperationViewData) {
    let operationFlowViewDataListTmp = new Array<OperationFlowViewData>();
    let workFlowDataListTmp: Array<WorkFlowData> = viewDataTmp.workFlowDataList;
    for (let item of workFlowDataListTmp) {
      let operationFlowViewDataTmp = new OperationFlowViewData();
      operationFlowViewDataTmp.id = item.id;
      operationFlowViewDataTmp.buserId = item.buserId;
      operationFlowViewDataTmp.workFlowTypeId = item.workFlowTypeId;
      let workFlowType: WorkFlowType = viewDataTmp.wFTypeMap.get(item.workFlowTypeId.toString());
      if (workFlowType) {
        operationFlowViewDataTmp.workFlowTypeName = workFlowType.wfCompName;
      }
      operationFlowViewDataTmp.lastUpdateTime = item.lastUpdateTime;
      operationFlowViewDataTmp.status = item.status;
      operationFlowViewDataTmp.leaguerInfo = item.leaguerInfo;
      if (item.leaguerInfo) {
        let leaguer = viewDataTmp.leaguerMap.get(item.leaguerInfo.leaguerId);
        if (leaguer && leaguer.name && leaguer.phone) {
          operationFlowViewDataTmp.leaguer = leaguer;
          operationFlowViewDataTmp.leaguerName = leaguer.name;
          operationFlowViewDataTmp.leaguerPhone = leaguer.phone;
        }
      }

      operationFlowViewDataListTmp.push(operationFlowViewDataTmp);
    }
    return operationFlowViewDataListTmp;
  }

  private async getWorkFlowDataListByRole(curPage, viewDataTmp: OperationViewData) {
    //查询所有工作流
    let workFlowDataQueryForm: WorkFlowDataQueryForm = this.buildWorkFlowDataQueryForm(curPage, viewDataTmp.leaguerNameOrPhone);
    let pageResp: PageResp = await this.workFlowMgr.getWorkFlowPageInfo(workFlowDataQueryForm);
    let isPurchaseAdmin = viewDataTmp.buserPermData.isPurchaseAdmin;
    let isRechargeAdmin = viewDataTmp.buserPermData.isRechargeAdmin;

    //只有开单收银权限
    if (isPurchaseAdmin == true && isRechargeAdmin == false) {
      let workFlowType: WorkFlowType = await this.workFlowTypeMgr.findByName("开单收银");
      if (workFlowType) {
        workFlowDataQueryForm.setWorkFlowTypeId(workFlowType.id);
      }
      pageResp = await this.workFlowMgr.getWorkFlowPageInfo(workFlowDataQueryForm);
    }

    //只有会员充值权限
    if (isPurchaseAdmin == false && isRechargeAdmin == true) {
      let workFlowType: WorkFlowType = await this.workFlowTypeMgr.findByName("会员充值");
      if (workFlowType) {
        workFlowDataQueryForm.setWorkFlowTypeId(workFlowType.id);
      }
      pageResp = await this.workFlowMgr.getWorkFlowPageInfo(workFlowDataQueryForm);
    }
    return pageResp;
  }

}
