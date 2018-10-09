import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppUtils, ZmMap} from '../../../comModule/AppUtils';
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {BUserMgr} from '../../../bsModule/buser/BUserMgr';
import {MembershipCard} from '../../../bsModule/storeCardInfo/data/MembershipCard';
import {StoreCardInfo} from '../../../bsModule/storeCardInfo/data/StoreCardInfo';
import {StaffData} from '../selectStaffComp/selectStaffComp';
import {ValidPeriodUnitEnum} from '../../../bsModule/storeCardInfo/data/ValidPeriodUnitEnum';
import {BuyTypeEnum} from '../../../bsModule/order/data/BuyTypeEnum';
import {PrdCardPayEnum} from '../../../bsModule/workFlow/data/PrdCardPayEnum';
import {UserBonus} from '../../../bsModule/workFlow/data/UserBonus';
import {RechargeViewData} from './RechargeViewData';
import {WorkFlowTypeMgr} from '../../../bsModule/workFlowType/WorkFlowTypeMgr';
import {WorkFlowMgr} from '../../../bsModule/workFlow/WorkFlowMgr';
import {WorkFlowData} from '../../../bsModule/workFlow/data/WorkFlowData';
import {WorkFlowDataStatusEnum} from '../../../bsModule/workFlow/data/WorkFlowDataStatusEnum';
import {BonusInfo} from '../../../bsModule/workFlow/data/BonusInfo';
import {BUser} from '../../../bsModule/buser/apiData/BUser';
import {FollowClerk, RechargeOrderItemData, WFDataWraper} from '../wfComp/WFDataWraper';
import {WorkFlowType} from '../../../bsModule/workFlowType/data/WorkFlowType';
import {WFDataWraperMgr} from '../wfComp/WFDataWraperMgr';
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {Constants} from "../../common/Util/Constants";
import {OldRecordHelper} from "../../../bsModule/workFlow/apiData/save/OldRecordHelper";
import {DateWrap} from "../../zmComp/date/timeSlot/DateWrap";
import {ZmTimeData} from "../../zmComp/date/ZmTime";
import {TimeSlotHelper} from "../../zmComp/date/timeSlot/TimeSlotHelper";

@Component({
  selector: 'recharge',
  templateUrl: './recharge.html',
  styleUrls: ['./recharge.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RechargePage {

  private service: RechargeService;
  public wfDataWraper: WFDataWraper;
  public wfDataWraperSub: any;
  public isShow: boolean = false;
  viewData: RechargeViewData = new RechargeViewData();

  //补单相关
  isAddOldRecord:boolean;
  date: DateWrap;//补单日期
  time: ZmTimeData;//补单时间

  constructor(private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserMgr: BUserMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef,
              private workFlowMgr: WorkFlowMgr,
              private workFlowTypeMgr: WorkFlowTypeMgr,
              private wfDataWraperMgr: WFDataWraperMgr) {
    this.isAddOldRecord = OldRecordHelper.getInstance().isOldRecord;
    OldRecordHelper.reset();//重置和补单相关的字段
    let date: Date = TimeSlotHelper.getCurTime();
    this.date = TimeSlotHelper.getDateWrapByDate(date);//获取当前时间的 DateWrap
    this.time = TimeSlotHelper.getZmTimeDataByDate(date);//获取 当前时间的 ZmTimeData

    this.service = new RechargeService(
      this.leaguerDetailSynDataHolder,
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.storeCardInfoSynDataHolder,
      this.workFlowMgr,
      this.workFlowTypeMgr,
      this.wfDataWraperMgr);
  }

  ngOnInit(): void {
    this.wfDataWraper = this.wfDataWraperMgr.init(Constants.RECHARGEWFNAME);

    this.wfDataWraperSub = this.wfDataWraperMgr.subscribeWFDataWraper((wfDataWraper: WFDataWraper) => {
      let wFDataWraperTmp: WFDataWraper = new WFDataWraper(Constants.RECHARGEWFNAME);
      AppUtils.copy(wFDataWraperTmp, wfDataWraper);
      this.wfDataWraper = wFDataWraperTmp;
      this.wfDataWraper.isAddOldRecord = this.isAddOldRecord;//赋值
      this.wfDataWraper.date = this.date;
      this.wfDataWraper.time = this.time;
      this.cdRef.markForCheck();
    });

    this.route.params.subscribe((params) => {
      let workFlowId = params['workFlowId'];
      let leaguerId = params["leaguerId"];
      this.service.initViewData(workFlowId, leaguerId, this.wfDataWraper, (viewData: RechargeViewData) => {
        if (viewData) {
          this.viewData = viewData;
          this.wfDataWraper.setWorkFlowType(viewData.workFlowType);
          this.wfDataWraperMgr.setWFDataWraper(this.wfDataWraper);
        }
      });

    });

  }

  /**
   * 日期改变
   */
  onDateChange() {
    if(AppUtils.isNullObj(this.wfDataWraper))return;
    this.wfDataWraper.date = this.date;
  }


}

class RechargeService {
  constructor(private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserMgr: BUserMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private workFlowMgr: WorkFlowMgr,
              private workFlowTypeMgr: WorkFlowTypeMgr,
              private wfDataWraperMgr: WFDataWraperMgr) {
  }


  public async initViewData(workFlowId, leaguerId, wFDataWraper: WFDataWraper, callback: (viewDataP: RechargeViewData) => void) {
    let viewDataTmp = new RechargeViewData();
    let storeId = SessionUtil.getInstance().getStoreId();

    //处理从组件新增会员的情况
    if (leaguerId) {
      let leaguerDetail: LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(leaguerId);
      let leaguer = leaguerDetail.encryptLeaguerDetail();
      wFDataWraper.getCuserWFCompData().selectLeaguer = leaguer;
      wFDataWraper.leaguerId = leaguer.id;
      wFDataWraper.isLeaguer = true;
      this.wfDataWraperMgr.setWFDataWraper(wFDataWraper);
    }


    /*************************************已有工作流 数据回填*********************************/
    if (AppUtils.isPositiveInteger(workFlowId)) {
      //请求workFlowType
      let workFlowType: WorkFlowType = await this.workFlowTypeMgr.findByName(wFDataWraper.getWFTypeName());
      viewDataTmp.workFlowType = workFlowType;
      //请求workFlowData
      let workFlowData: WorkFlowData = await this.workFlowMgr.get(workFlowId);
      wFDataWraper.setWorkFlowData(workFlowData);
      wFDataWraper.setWorkFlowType(workFlowType);
      if (workFlowData.status == WorkFlowDataStatusEnum.OPEN) {//未完成工作流
        /*******************************准备店铺员工数据******************************/
        let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
        let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(storeClerkInfoId);
        viewDataTmp.clerkMap = storeClerkInfo.getClerkMap();
        viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

        //请求所有员工信息
        let clerkMap = viewDataTmp.clerkMap;
        let clerkIdArray = clerkMap.keys();
        let buserList = await this.buserMgr.findByMultitId(clerkIdArray);
        viewDataTmp.buserMap = this.buildBuserMap(buserList);
        /*******************************准备店铺员工数据******************************/


        /***********************************已选会员****************************************/
        if (workFlowData.leaguerInfo) {//已选择会员
          let leaguerDetail: LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(workFlowData.leaguerInfo.leaguerId);
          let leaguer = leaguerDetail.encryptLeaguerDetail();
          wFDataWraper.getCuserWFCompData().selectLeaguer = leaguer;
          /***********************************已选跟进人员****************************************/
          if (AppUtils.isPositiveInteger(workFlowData.leaguerInfo.followUserId)) {
            let buser: BUser = viewDataTmp.buserMap.get(workFlowData.leaguerInfo.followUserId);
            let followClerk = FollowClerk.fromBuserItem(buser);
            wFDataWraper.getBuserWFCompData().selectFollowClerk = followClerk;

          }
        }

        /*************************************已选充值设置**************************************/
        let rechargeSettingWFCompData = wFDataWraper.getRechargeSettingWFCompData();
        if (workFlowData.memCardInfo) {
          rechargeSettingWFCompData.rechargeOrderItemData.pay = wFDataWraper.getWorkFlowData().memCardInfo.cost;
          rechargeSettingWFCompData.rechargeOrderItemData.largess = wFDataWraper.getWorkFlowData().memCardInfo.largess;
          rechargeSettingWFCompData.rechargeOrderItemData.limitTime = wFDataWraper.getWorkFlowData().memCardInfo.limitTime;
          rechargeSettingWFCompData.rechargeOrderItemData.limitUnit = wFDataWraper.getWorkFlowData().memCardInfo.limitUnit;
          if (wFDataWraper.getWorkFlowData().memCardInfo.limitUnit != 0) {
            rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio = false;
          } else {
            rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio = true;
            rechargeSettingWFCompData.rechargeOrderItemData.limitTime = null;
            rechargeSettingWFCompData.rechargeOrderItemData.limitUnit = ValidPeriodUnitEnum.DAY; //默认为天
          }
          rechargeSettingWFCompData.rechargeOrderItemData.number = wFDataWraper.getWorkFlowData().memCardInfo.number;
          rechargeSettingWFCompData.rechargeOrderItemData.buyType = BuyTypeEnum.RECHARGE;
          rechargeSettingWFCompData.rechargeOrderItemData.prdCardPayType = PrdCardPayEnum.CashPay;
          rechargeSettingWFCompData.rechargeOrderItemData.membershipCardId = wFDataWraper.getWorkFlowData().memCardInfo.memTypeId;

          let storeId = SessionUtil.getInstance().getStoreId();
          let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
          let mbCard = storeCardInfo.getMemberCardMap().get(rechargeSettingWFCompData.rechargeOrderItemData.membershipCardId);
          if (mbCard) {
            rechargeSettingWFCompData.rechargeOrderItemData.membershipCardName = mbCard.name;
            rechargeSettingWFCompData.memberCard = mbCard;
          }
        }

        /*************************************已选提成**************************************/
        if (workFlowData.bonusInfoMap) {
          viewDataTmp.bonusInfoMap = this.getBonusInfoMap(wFDataWraper.getWorkFlowData().bonusInfoMap);

          //组装orderItemData提成 staffList
          let bonusId = this.getBonusId(rechargeSettingWFCompData.rechargeOrderItemData);
          let bonusInfo = viewDataTmp.bonusInfoMap.get(bonusId);
          if (bonusInfo) {
            rechargeSettingWFCompData.rechargeOrderItemData.staffBonusList = this.getStaffList(bonusInfo, viewDataTmp.buserMap, viewDataTmp.clerkMap, viewDataTmp.roleMap);
            rechargeSettingWFCompData.rechargeOrderItemData.staffName = rechargeSettingWFCompData.rechargeOrderItemData.staffBonusList.map((item) => {
              return item.name;
            }).join("、");
          }

        }
      }
    }
    this.wfDataWraperMgr.setWFDataWraper(wFDataWraper);
    callback(viewDataTmp);
  }

  /**
   * 获取staffList
   * @param bonusInfo
   * @param buserMap
   * @param clerkMap
   * @param roleMap
   * @returns {StaffData[]}
   */
  private getStaffList(bonusInfo: BonusInfo, buserMap: ZmMap<BUser>, clerkMap: ZmMap<ClerkInfo>, roleMap: ZmMap<StoreAdminRole>): Array<StaffData> {
    let staffBonusList = new Array<StaffData>();
    for (let index in bonusInfo.userBonusMap) {
      let staffData = new StaffData();
      let userBonus: UserBonus = bonusInfo.userBonusMap[index];
      staffData.id = userBonus.buserId;
      if (buserMap.get(userBonus.buserId) && buserMap.get(userBonus.buserId).name) {
        staffData.name = buserMap.get(userBonus.buserId).name;
      } else {
        staffData.name = "-";
      }
      staffData.amount = userBonus.amount;
      staffData.bonusType = userBonus.bonusType;
      staffData.percentage = userBonus.percentage;
      staffData.cost = userBonus.cost;
      //服务人员角色
      if (clerkMap.get(userBonus.buserId)) {
        let roleSet = clerkMap.get(userBonus.buserId).roleSet;
        if (roleSet)
          staffData.roleName = roleSet.map((roleId) => {
            if (roleMap.get(roleId))
              return roleMap.get(roleId).name;
          }).join("、");
      }
      staffBonusList.push(staffData);
    }
    return staffBonusList;
  }

  /**
   * 获取bonusMap
   * @param bonusInfoMap
   * @returns {ZmMap<BonusInfo>}
   */
  private getBonusInfoMap(bonusInfoMap): ZmMap<BonusInfo> {
    let bonusMap = new ZmMap<BonusInfo>();
    for (let index in bonusInfoMap) {
      let bonusInfo: BonusInfo = bonusInfoMap[index];
      bonusMap.put(bonusInfo.bonusId, bonusInfo);
    }
    return bonusMap;
  }

  public async  findWorkFlowTypeByName(name: string, callback: (workFlowType: WorkFlowType) => void) {
    let workFlowTypeTemp = await this.workFlowTypeMgr.findByName(name);
    callback(workFlowTypeTemp);
  }

  /**
   * 组装员工详情
   * @param buserList
   * @param viewDataTmp
   */
  private buildBuserMap(buserList: Array<BUser>): ZmMap<BUser> {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
  }

  /**
   * 根据会员卡类型id获取会员卡折扣信息
   * @param storeId:string
   * @param mbCardId:string
   * @returns Promise<ChainMemberCardDetailViewData>
   */
  public async getMemberCardDetail(storeId: string, mbCardId: string): Promise<MembershipCard> {
    let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    let targetMbCard: MembershipCard = storeCardInfo.getMemberCardDetail(mbCardId);
    return new Promise<MembershipCard>(resolve => {
      resolve(targetMbCard);
    });
  }


  /**
   * 获取提成id
   * @param orderItemData
   * @returns {string}
   */
  private getBonusId(orderItemData: RechargeOrderItemData): string {
    //bonusId后台生成规则:cardFlag_buyType_pgId_cardId
    return AppUtils.format('{0}_{1}_{2}_{3}', orderItemData.prdCardPayType, orderItemData.buyType, '', '');
  }

}
