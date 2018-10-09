import {ZmMap} from "../../../comModule/AppUtils";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {UserPermData} from "../../../comModule/session/SessionData";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {WorkFlowType} from "../../../bsModule/workFlowType/data/WorkFlowType";
import {LeaguerInfo} from "../../../bsModule/workFlow/data/LeaguerInfo";

export class OperationViewData {
  public leaguerMap: ZmMap<Leaguer>;
  public wFTypeMap: ZmMap<WorkFlowType>;
  public buserPermData: UserPermData = new UserPermData();//登录用户权限

  public curPage: number = 1;
  public recordCount: number;

  public leaguerNameOrPhone: string;
  public workFlowDataList: Array<WorkFlowData> = Array<WorkFlowData>();
  public operationFlowViewDataList: Array<OperationFlowViewData> = Array<OperationFlowViewData>();
  public loadingFinish: boolean = false;
}

export class OperationFlowViewData {
  id: string;
  storeId: string;
  buserId: string;
  workFlowTypeId: number;
  workFlowTypeName: string;
  status: number;
  leaguerInfo: LeaguerInfo;
  leaguer: Leaguer;//当前流程对应会员详细信息
  leaguerName: string;
  leaguerPhone: string;
  lastUpdateTime: string;
}
