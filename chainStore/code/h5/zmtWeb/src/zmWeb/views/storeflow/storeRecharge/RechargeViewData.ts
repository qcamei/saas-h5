import {ZmMap} from '../../../comModule/AppUtils';
import {ClerkInfo} from '../../../bsModule/storeClerkInfo/data/ClerkInfo';
import {StoreAdminRole} from '../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole';
import {BonusInfo} from '../../../bsModule/workFlow/data/BonusInfo';
import {BUser} from '../../../bsModule/buser/apiData/BUser';
import {WorkFlowType} from '../../../bsModule/workFlowType/data/WorkFlowType';

export class RechargeViewData {
  public workFlowType:WorkFlowType;
  public bonusInfoMap: ZmMap<BonusInfo>;
  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;
  public buserMap: ZmMap<BUser>;
}



