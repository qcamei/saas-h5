import {MembershipCard} from '../../../../bsModule/storeCardInfo/data/MembershipCard';
import {ZmMap} from '../../../../comModule/AppUtils';
import {WorkFlowData} from '../../../../bsModule/workFlow/data/WorkFlowData';
import {BonusInfo} from '../../../../bsModule/workFlow/data/BonusInfo';
import {BUser} from '../../../../bsModule/buser/apiData/BUser';
import {ClerkInfo} from '../../../../bsModule/storeClerkInfo/data/ClerkInfo';
import {StoreAdminRole} from '../../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole';
import {ValidPerioItem} from "../../../zmComp/form/zmValidPeriodRadio";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";

export class RechargeSettingViewData{
  public validPerioItem:ValidPerioItem = new ValidPerioItem(0,null,1);//默认永久
  public memberCardList:Array<MembershipCard> = new Array<MembershipCard>(); //卡类型列表
  public memberCardListTemp :Array<MembershipCard> = new Array<MembershipCard>(); //卡类型列表临时对象

  public memberCard:MembershipCard = new MembershipCard(); //会员卡类型对象

  public showCardDetail:boolean = false; //是否显示会员卡设置详情

  public leaguerMap:ZmMap<Leaguer>;
  public clerkMap:ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;
  //对应店铺所有员工
  public clerkDataList:Array<ClerkData> = new Array<ClerkData>();
  //对应页面过滤后的列表实体
  public clerkList:Array<ClerkData> = new Array();
  //店铺所有员工详情map
  public buserMap: ZmMap<BUser>;
  //会员卡编号map
  public memberCardNumberMap: ZmMap<String>;

  /************************************工作流********************************************/
  public workFlowData: WorkFlowData;
  public bonusInfoMap: ZmMap<BonusInfo>;
  constructor() {
  }
}

export class ClerkData{
  id:string;
  name:string;
  roleSetName:string;
}

