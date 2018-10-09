import {WorkFlowViewData} from "../../homeWraper/HomeDataWraper";
import {ZmMap} from "../../../../comModule/AppUtils";
import {UserPermData} from "../../../../comModule/session/SessionData";
import {WorkFlowData} from "../../../../bsModule/workFlow/data/WorkFlowData";
import {WorkFlowType} from "../../../../bsModule/workFlowType/data/WorkFlowType";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
export class UnfinishedWFCompViewData {
  //页面数据
  workFlowViewDataList: Array<WorkFlowViewData> = new Array<WorkFlowViewData>();
  leaguerActive: boolean = false;//是否显示开单会员
  loadingFinish: boolean = false;
  flag:boolean = false;

  //准备数据
  leaguerMap: ZmMap<Leaguer>;
  buserPermData: UserPermData;//登录用户权限
  workFlowList: Array<WorkFlowData>;//原始数据 未完成流程
  workFlowTypeMap: ZmMap<WorkFlowType>;
  constructor(){
    this.buserPermData = SessionUtil.getInstance().getUserPermData();

  }

}
