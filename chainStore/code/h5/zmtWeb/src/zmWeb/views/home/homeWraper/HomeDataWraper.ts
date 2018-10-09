
import {MemCardInfo} from "../../../bsModule/workFlow/data/MemCardInfo";
import {LeaguerInfo} from "../../../bsModule/workFlow/data/LeaguerInfo";
import {AppUtils} from "../../../comModule/AppUtils";
import {BonusInfo} from "../../../bsModule/workFlow/data/BonusInfo";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {UnfinishedWFCompViewData} from "../Comp/unfinishedWFComp/UnfinishedWFCompViewData";

export class AppointData {
  //会员
  leaguerId: string;
  name: string;
  phone: string;
  headImg: string;

  //预约
  id: string;//预约ID
  appointTime: number;
  status: number;//AppointmentStatusEnum
  origin: number;//OriginTypeEnum
  lastUpdateTime: string;
}

export class WorkFlowViewData {

  id: string;
  storeId: string;
  buserId: string;
  lastUpdateTime: string;

  workFlowTypeId: number;
  wfTypeName: string;//开单收银 会员充值
  wfTypeFlag: number;

  //会员信息
  leaguerInfo: LeaguerInfo;
  hasLeaguer: boolean = false;
  hasFollowUserId: boolean = false;//跟进人员
  leaguerName: string;
  headImg: string;

  //项目信息
  hasProdRecord: boolean = false;

  //划卡信息
  hasDecreasePrdCardRecord: boolean = false;

  //购买次卡
  hasPrdCardRecord: boolean = false;

  //购买商品
  hasGoodsRecordMap: boolean = false;

  //待结算列表
  hasUnsettledRecode: boolean = false;

  //会员充值
  memCardInfo: MemCardInfo;
  hasMemCardInfo: boolean = false;
  hasCost: boolean = false;//金额充值
  hasSetMemCard: boolean = false;//设置会员卡
  hasBuserId: boolean = false;

  //订单信息
  hasOrderInfo: boolean = false;

  //提成信息
  bonusInfoMap:Array<BonusInfo>;
  hasBonusInfo: boolean = false;

  constructor(){

  }

  public fromWorkFlowType(workFlowViewData:WorkFlowViewData,workFlow:WorkFlowData,viewDataTmp:UnfinishedWFCompViewData){
    let workFlowType = viewDataTmp.workFlowTypeMap.get(workFlow.workFlowTypeId.toString());
    if (workFlowType) {
      workFlowViewData.wfTypeName = workFlowType.wfCompName;
      if (workFlowType.wfCompName == "开单收银") {
        workFlowViewData.wfTypeFlag = 0;
      }
      if (workFlowType.wfCompName == "会员充值") {
        workFlowViewData.wfTypeFlag = 1;
      }
    }
  }

  public fromMemCardInfo(workFlowViewData:WorkFlowViewData,workFlow:WorkFlowData){
    if (workFlow.memCardInfo) {
      workFlowViewData.memCardInfo = workFlow.memCardInfo;
      workFlowViewData.hasMemCardInfo = true;
      if (workFlow.memCardInfo.cost > 0) {
        workFlowViewData.hasCost = true;
      }
      if (!AppUtils.isNullOrWhiteSpace(workFlow.memCardInfo.memTypeId)) {
        workFlowViewData.hasSetMemCard = true;
      }
      if (workFlow.memCardInfo.buserIds != null) {
        workFlowViewData.hasBuserId = true;//设置了服务人员就设置了提成
      }
    }
  }

  public fromBonusInfoMap(workFlowViewData:WorkFlowViewData,workFlow:WorkFlowData){
    if (workFlow.bonusInfoMap) {//设置提成
      workFlowViewData.bonusInfoMap = workFlow.bonusInfoMap;
      let bonusInfoList = this.buildBonusInfoList(workFlow.bonusInfoMap);
      if(bonusInfoList.length>0){
        for(let item of bonusInfoList){
          if(!AppUtils.isNullObj(item.userBonusMap)){
            workFlowViewData.hasBonusInfo = true;
          }
        }

      }
    }
  }

  private buildBonusInfoList(bonusInfoMap){
    let bonusInfoListTmp = new Array<BonusInfo>();
    for(let i in bonusInfoMap){
      bonusInfoListTmp.push(bonusInfoMap[i]);
    }
    return bonusInfoListTmp;
  }



}







