import {LeaguerInfo} from "./LeaguerInfo";
import {MemCardInfo} from "./MemCardInfo";
import {OrderInfo} from "./OrderInfo";
import {ZmMap} from "../../../comModule/AppUtils";
import {BonusInfo} from "./BonusInfo";
import {AppointInfo} from "./AppointInfo";
import {CancelReason} from "./CancelReason";
import {IntfDetailData} from "../../../comModule/dataDetail/IntfDetailData";

export class WorkFlowData implements IntfDetailData{
  id:string;
  storeId:string;
  buserId:string;
  workFlowTypeId:number;
  number:string;
  status:number;//WorkFlowDataStatusEnum
  entityState:number;

  /**
   * @link{src/zmWeb/bsModule/workFlow/apiData/save/WfDataTypeEnum.ts}
   */
  recordType: number;// 开单类型 WfDataTypeEnum 补单、开单
  orderTime:number;//补单时间

  appointInfo:AppointInfo;
  leaguerInfo:LeaguerInfo;
  leaguerInfoComment:string;
  preStoreCardRecordMap:any;//HashMap<String, PreStoreCardRecord>();
  prodRecordMap:any;
  productComment:string;
  decreasePrdCardRecordMap:any;//废弃
  delimitCardRecordMap:any;
  decreasePrdCardComment:string;
  prdCardRecordMap:any;
  prdCardComment:string;
  goodsRecordMap:any;
  goodsComment:string;
  packagePrjRecordMap:any;
  memCardInfo:MemCardInfo;
  memCardComment:string;
  orderInfo:OrderInfo;
  orderInfoComment:string;
  bonusInfoMap:any;
  bonusInfoComment:string;
  cancelReason:CancelReason;// 流程作废信息
  createdTime:string;
  lastUpdateTime:string;
  ver:number;
  constructor(){}

  targetId(): string {
    return this.id;
  }

  public getBonusInfoMap():ZmMap<BonusInfo>{
    let bonusInfoMapTmp = new ZmMap<BonusInfo>();
    for(let index in this.bonusInfoMap){
      let item:BonusInfo = this.bonusInfoMap[index];
      bonusInfoMapTmp.put(item.bonusId,item);
    }
    return bonusInfoMapTmp;
  }

}
