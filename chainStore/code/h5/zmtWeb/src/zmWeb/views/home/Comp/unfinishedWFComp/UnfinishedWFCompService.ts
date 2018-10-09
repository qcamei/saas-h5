import {WorkFlowType} from "../../../../bsModule/workFlowType/data/WorkFlowType";
import {ZmMap} from "../../../../comModule/AppUtils";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {UnfinishedWFCompViewData} from "./UnfinishedWFCompViewData";
import {WorkFlowViewData} from "../../homeWraper/HomeDataWraper";
import {WorkFlowData} from "../../../../bsModule/workFlow/data/WorkFlowData";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {Constants} from "../../../common/Util/Constants";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {WorkFlowDataQueryForm} from "../../../../bsModule/workFlow/apiData/WorkFlowDataQueryForm";
import {UnfinishedWFViewDataMgr} from "./UnfinishedWFViewDataMgr";
import {WorkFlowMgr} from "../../../../bsModule/workFlow/WorkFlowMgr";
import {WorkFlowTypeMgr} from "../../../../bsModule/workFlowType/WorkFlowTypeMgr";
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";

export class UnfinishedWFCompService {
  constructor(private workFlowMgr: WorkFlowMgr,
              private workFlowTypeMgr: WorkFlowTypeMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder) {
  }

  public initViewData() {

    this.buildViewData((viewDataTmp: UnfinishedWFCompViewData) => {
      this.handleViewData(viewDataTmp);
    });

  }

  public handleViewData(viewDataP: UnfinishedWFCompViewData) {
    UnfinishedWFViewDataMgr.getInstance().setData(viewDataP);
  }

  /**
   * 初始化页面数据
   * @param callback
   */
  public async buildViewData(callBack:(viewDataTmp: UnfinishedWFCompViewData) =>void) {

    let viewDataTmp = new UnfinishedWFCompViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.buserPermData = SessionUtil.getInstance().getUserPermData();

    //会员信息
    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    if (storeLeaguerInfo) {
      viewDataTmp.leaguerMap = storeLeaguerInfo.getAllLeaguerMap();
    }

    //开单会员 默认七日内
    let workFlowDataQueryForm = this.buildWorkFlowDataQueryForm();
    let workFlowListTmp: Array<WorkFlowData> = await this.workFlowMgr.getList(workFlowDataQueryForm);

    viewDataTmp.workFlowList = this.filterUnFinishedList(workFlowListTmp);//总的未完成流程
    let workFlowTypeTmp = await this.workFlowTypeMgr.getWFTypeList();
    viewDataTmp.workFlowTypeMap = this.listToMap(workFlowTypeTmp);

    viewDataTmp.workFlowViewDataList = await this.bulidWorkFlowList(viewDataTmp);
    //按权限组装 开单会员页面数据
    //有开单收银和会员充值权限
    if (viewDataTmp.buserPermData.isPurchaseAdmin == true || viewDataTmp.buserPermData.isRechargeAdmin == true)
    {
      viewDataTmp.leaguerActive = true;
    }

    //只有开单收银权限
    if(viewDataTmp.buserPermData.isPurchaseAdmin == true && viewDataTmp.buserPermData.isRechargeAdmin ==false )
    {
      viewDataTmp.workFlowViewDataList = this.filterListWithPurchaseRole(viewDataTmp.workFlowViewDataList);
    }
    //只有会员充值权限
    if(viewDataTmp.buserPermData.isPurchaseAdmin == false && viewDataTmp.buserPermData.isRechargeAdmin == true )
    {
      viewDataTmp.workFlowViewDataList = this.filterListWithRechargeRole(viewDataTmp.workFlowViewDataList);
    }

    viewDataTmp.loadingFinish = true;
    viewDataTmp.flag = true;
    callBack(viewDataTmp);
  }

  private buildWorkFlowDataQueryForm(){
    let workFlowDataQueryForm = new WorkFlowDataQueryForm();
    let date = BusinessUtil.getToDayObject();
    let minTime = BusinessUtil.formatMinTime(date);
    let maxTime = BusinessUtil.formatMaxTime(date);
    let leaguerMinTime = minTime - (Constants.ONEDAY_TIMESTAMP * 6);
    workFlowDataQueryForm.storeId = SessionUtil.getInstance().getStoreId();
    workFlowDataQueryForm.minTime = leaguerMinTime.toString();
    workFlowDataQueryForm.maxTime = maxTime.toString();
    workFlowDataQueryForm.pageItemCount = 10000;//每页数据条数
    workFlowDataQueryForm.pageNo = 1;
    workFlowDataQueryForm.workFlowTypeId = 0;

    return workFlowDataQueryForm;
  }

  /***
   * 过滤出未完成流程
   */
  private filterUnFinishedList(workFlowListTmp) {
    workFlowListTmp = workFlowListTmp.filter(itemTmp => {
      if (itemTmp.status == 0) {
        return true;
      } else {
        return false;
      }
    });
    workFlowListTmp = BusinessUtil.sortListObject(workFlowListTmp);//排序
    return workFlowListTmp;
  }

  /**
   * 根据权限过滤 开单会员列表
   * 会员充值数据列表
   */
  private filterListWithRechargeRole(workFlowViewDataList: Array<WorkFlowViewData>) {
    let workFlowViewDataListTmp: Array<WorkFlowViewData> =  workFlowViewDataList.filter(item => {
      if (item.wfTypeFlag == 1) {
        return true;
      } else {
        return false;
      }
    });

    return workFlowViewDataListTmp;
  }

  /**
   * 根据权限过滤 开单会员列表
   * 开单收银数据列表
   */
  private filterListWithPurchaseRole(workFlowViewDataList: Array<WorkFlowViewData>) {
    let workFlowViewDataListTmp: Array<WorkFlowViewData> = workFlowViewDataList.filter(item => {
      if (item.wfTypeFlag == 0) {
        return true;
      } else {
        return false;
      }
    });

    return workFlowViewDataListTmp;
  }

  /**
   * 组装开单会员数据
   */
  private async bulidWorkFlowList(viewDataTmp: UnfinishedWFCompViewData){
    let workFlowViewDataList: Array<WorkFlowViewData> = new Array<WorkFlowViewData>();
    for (let workFlow of viewDataTmp.workFlowList) {
      let workFlowViewData = new WorkFlowViewData();
      workFlowViewData.id = workFlow.id;
      workFlowViewData.lastUpdateTime = workFlow.lastUpdateTime;
      workFlowViewData.workFlowTypeId = workFlow.workFlowTypeId;

      if (workFlow.prodRecordMap) {
        workFlowViewData.hasProdRecord = true;
      }
      if (workFlow.goodsRecordMap) {
        workFlowViewData.hasGoodsRecordMap = true;
      }
      if (workFlow.orderInfo) {
        workFlowViewData.hasOrderInfo = true;
      }
      if (workFlow.prdCardRecordMap) {
        workFlowViewData.hasPrdCardRecord = true;
      }
      if (workFlow.decreasePrdCardRecordMap) {
        workFlowViewData.hasDecreasePrdCardRecord = true;
      }

      this.buildDataFromWorkFlowType(workFlowViewData,workFlow,viewDataTmp);
      await this.buildDataFromLeaguerInfo(workFlowViewData,workFlow,viewDataTmp);
      this.buildDataFromMemCardInfo(workFlowViewData,workFlow);
      this.buildDataFromBonusInfoMap(workFlowViewData,workFlow);

      if (workFlowViewData.hasProdRecord == true || workFlowViewData.hasDecreasePrdCardRecord == true
        || workFlowViewData.hasPrdCardRecord == true || workFlowViewData.hasGoodsRecordMap == true) {
        workFlowViewData.hasUnsettledRecode = true;//待结算列表
      }
      workFlowViewDataList.push(workFlowViewData);
    }
    return workFlowViewDataList;
  }

  private buildDataFromWorkFlowType(workFlowViewData:WorkFlowViewData,workFlow:WorkFlowData,viewDataTmp:UnfinishedWFCompViewData){
    workFlowViewData.fromWorkFlowType(workFlowViewData,workFlow,viewDataTmp);
  }

  private buildDataFromMemCardInfo(workFlowViewData:WorkFlowViewData,workFlow:WorkFlowData){
    workFlowViewData.fromMemCardInfo(workFlowViewData,workFlow);
  }

  private buildDataFromBonusInfoMap(workFlowViewData:WorkFlowViewData,workFlow:WorkFlowData){
    workFlowViewData.fromBonusInfoMap(workFlowViewData,workFlow);
  }


  private async buildDataFromLeaguerInfo(workFlowViewData:WorkFlowViewData,workFlow:WorkFlowData,viewDataTmp:UnfinishedWFCompViewData){
    if (workFlow.leaguerInfo) {
      workFlowViewData.leaguerInfo = workFlow.leaguerInfo;
      workFlowViewData.hasLeaguer = true;
      if (workFlow.leaguerInfo.followUserId != "0") {
        workFlowViewData.hasFollowUserId = true;
      }
      let leaguerId = workFlow.leaguerInfo.leaguerId;
      if(viewDataTmp.leaguerMap){
        let leaguer: Leaguer = viewDataTmp.leaguerMap.get(leaguerId);
        if (leaguer) {
          workFlowViewData.leaguerName = leaguer.name;
          workFlowViewData.headImg = leaguer.headImg;
        }
      }

    }
  }


  /**
   * WorkFlowTypeList =>WorkFlowTypeMap
   * @param itemArray:Array<WorkFlowType>
   * @return targetMap:ZmMap<WorkFlowType>
   */
  private listToMap(itemArray: Array<WorkFlowType>): ZmMap<WorkFlowType> {
    let targetMap = new ZmMap<WorkFlowType>();
    itemArray.forEach((itemTmp: WorkFlowType, index: number, array: WorkFlowType[]) => {
      targetMap.put(itemTmp.id.toString(), itemTmp);
    });
    return targetMap;
  }


}
