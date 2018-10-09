import {Component, Input, OnChanges} from '@angular/core';
import {AppUtils} from '../../../../comModule/AppUtils';
import {SessionUtil} from '../../../../comModule/session/SessionUtil';
import {WorkFlowMgr} from '../../../../bsModule/workFlow/WorkFlowMgr';
import {RechargeSettingWFCompData,WFDataWraper} from '../../wfComp/WFDataWraper';
import {UserBonus} from '../../../../bsModule/workFlow/data/UserBonus';
import {RechargeSettingViewData} from '../rechargeSettingComp/rechargeSettingViewData';
import {ValidPeriodUnitEnum} from '../../../../bsModule/storeCardInfo/data/ValidPeriodUnitEnum';
import {WFDataWraperMgr} from '../../wfComp/WFDataWraperMgr';
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {AppRouter} from "../../../../comModule/AppRouter";
import {StoreLeaguerInfo} from "../../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {BonusInfoSaveForm} from "../../../../bsModule/workFlow/apiData/save/BonusInfoSaveForm";
import {WorkFlowData} from "../../../../bsModule/workFlow/data/WorkFlowData";
import {WorkFlowDataSaveForm} from "../../../../bsModule/workFlow/apiData/save/WorkFlowDataSaveForm";
import {LeaguerSaveForm} from "../../../../bsModule/workFlow/apiData/save/LeaguerSaveForm";
import {MemCardInfo} from "../../../../bsModule/workFlow/data/MemCardInfo";
import {WorkFlowDataSaveTypeEnum} from "../../../../bsModule/workFlow/apiData/save/WorkFlowDataSaveTypeEnum";
import {WfDataTypeEnum} from "../../../../bsModule/workFlow/apiData/save/WfDataTypeEnum";
import {TimeSlot} from "../../../zmComp/date/timeSlot/TimeSlot";
import {TimeSlotHelper} from "../../../zmComp/date/timeSlot/TimeSlotHelper";

/**
 * 会员充值结算组件
 */
@Component({
  selector: 'recharge-order-comp',
  template: `
             <zm-card-box [withCollapse]="false" [expanded]="true">
                <content>
                    <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="100px">
                      <p>
                        <span>应结总价</span>&nbsp;&nbsp;:&nbsp;&nbsp;<i class="fa fa-yen"></i>&nbsp;
                        <span style="font-size: 24px;font-weight: bold;" *ngIf="rechargeSettingWFCompData.rechargeOrderItemData.pay" span>
                        {{rechargeSettingWFCompData.rechargeOrderItemData.pay | number:'1.2-2'}}
                        </span>
                        <span style="font-size: 24px;font-weight: bold;" *ngIf="!rechargeSettingWFCompData.rechargeOrderItemData.pay" span>
                        0
                        </span>
                      </p>
                      <zm-btn-large [disabled]="(!rechargeSettingWFCompData.rechargeOrderItemData.pay||(rechargeSettingWFCompData.rechargeOrderItemData.pay <= 0))" [name]="'提交订单'" (zmbtnClick)="account()"></zm-btn-large>
                    </div>
                </content>
             </zm-card-box> 
    `,
  styleUrls: ['../recharge.scss']
})
export class SettleAccountModuleComp implements OnChanges {

  @Input() wFDataWraper: WFDataWraper;

  public leaguerId: string;
  public rechargeSettingWFCompData: RechargeSettingWFCompData = new RechargeSettingWFCompData();

  private service: SettleAccountModuleService;
  public viewData: RechargeSettingViewData = new RechargeSettingViewData();

  constructor(private wfDataWraperMgr: WFDataWraperMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private workFlowMgr: WorkFlowMgr,) {
    this.service = new SettleAccountModuleService(
      this.storeLeaguerInfoSynDataHolder,
      this.workFlowMgr,);
  }

  ngOnInit(): void {
    this.service.buildViewData((viewDataP: RechargeSettingViewData) => {
      if (viewDataP) {
        this.viewData = viewDataP;
      }
    });
  }

  ngOnChanges() {
    if (this.wFDataWraper) {
      if (this.wFDataWraper.getCuserWFCompData() && this.wFDataWraper.getCuserWFCompData().selectLeaguer) {
        this.leaguerId = this.wFDataWraper.getCuserWFCompData().selectLeaguer.id;
        this.rechargeSettingWFCompData = this.wFDataWraper.getRechargeSettingWFCompData();
      }
    }
  }

  ngOnDestroy(): void {

  }

  /**
   * 提交订单
   */
  account() {
    if (AppUtils.isNullObj(this.rechargeSettingWFCompData.rechargeOrderItemData.pay) || AppUtils.isNullOrWhiteSpace(this.rechargeSettingWFCompData.rechargeOrderItemData.pay.toString())) {
      AppUtils.showWarn('提示', '请输入充值金额');
    }else if (this.rechargeSettingWFCompData.rechargeOrderItemData.pay <= 0) {
      AppUtils.showWarn("提示", "请输入有效的充值金额");
    }else if (!AppUtils.isNullObj(this.rechargeSettingWFCompData.rechargeOrderItemData.largess) && this.rechargeSettingWFCompData.rechargeOrderItemData.largess < 0) {
      AppUtils.showWarn("提示", "请输入有效的赠送金额");
    }else if (!this.rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio && AppUtils.isNullObj(this.rechargeSettingWFCompData.rechargeOrderItemData.limitTime)) {
      AppUtils.showWarn("提示", "请输入有效期");
    }else if (!this.rechargeSettingWFCompData.rechargeOrderItemData.cardNumberValid) {
      AppUtils.showWarn("提示", "会员卡编号重复");
    }else{
      let payTmp = parseFloat(this.rechargeSettingWFCompData.rechargeOrderItemData.pay.toString());
      let largessTmp = parseFloat(this.rechargeSettingWFCompData.rechargeOrderItemData.largess.toString());
      this.rechargeSettingWFCompData.rechargeOrderItemData.amount = payTmp + largessTmp;
      this.rechargeSettingWFCompData.rechargeOrderItemData.limitUnit = this.rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio?ValidPeriodUnitEnum.FOREVER:this.rechargeSettingWFCompData.rechargeOrderItemData.limitUnit;
      this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);

      AppUtils.showMask("提交订单中");
      this.service.saveWFData(this.wFDataWraper,WorkFlowDataSaveTypeEnum.ADDORDER).then((workFlowData:WorkFlowData) => {
        if(!AppUtils.isNullObj(workFlowData)
          && !AppUtils.isNullObj(workFlowData.orderInfo)
          && !AppUtils.isNullObj(workFlowData.orderInfo.orderId)
          && workFlowData.orderInfo.orderId>0){
          this.wFDataWraper.setWorkFlowData(workFlowData);
          AppUtils.closeMask();
          AppUtils.showSuccess("提示","提交订单成功");
          this.wFDataWraper.getOrderWFCompData().hasSettled = true;//设置为已结算
          AppRouter.goRechargeOrderPay(workFlowData.orderInfo.orderId);
        }else{
          AppUtils.closeMask();
          AppUtils.showError("提示","提交订单失败");
        }
      });
    }
  }

}

class SettleAccountModuleService {
  constructor(private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private workFlowMgr: WorkFlowMgr,) {

  }

  public async buildViewData(callback: (viewDataP: RechargeSettingViewData) => void) {
    let viewDataTmp = new RechargeSettingViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeLeaguerInfo: StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    viewDataTmp.leaguerMap = storeLeaguerInfo.getAllLeaguerMap();
    callback(viewDataTmp);
  }

  public saveWFData(wfDataWraper: WFDataWraper,saveType:number): Promise<WorkFlowData> {
    let workFlowDataSaveForm = new WorkFlowDataSaveForm();
    workFlowDataSaveForm.id = !AppUtils.isNullObj(wfDataWraper.getWorkFlowData()) ? wfDataWraper.getWorkFlowData().id : "";
    workFlowDataSaveForm.storeId = SessionUtil.getInstance().getStoreId();
    //会员信息
    let leaguerSaveForm = new LeaguerSaveForm();
    leaguerSaveForm.leaguerId = wfDataWraper.leaguerId;
    leaguerSaveForm.followUserId = wfDataWraper.getBuserWFCompData().selectFollowClerk.id;
    workFlowDataSaveForm.leaguerSaveForm = leaguerSaveForm;

    //提成列表
    let bonusInfoSaveForms = new Array<BonusInfoSaveForm>();
    let bonusData = wfDataWraper.getRechargeSettingWFCompData().rechargeOrderItemData;
    let bonusInfoSaveForm = new BonusInfoSaveForm();
    bonusInfoSaveForm.prdCardPayType = bonusData.prdCardPayType;
    bonusInfoSaveForm.buyType = bonusData.buyType;
    let userBonusMap = {};
    bonusData.staffBonusList.forEach((item) => {
      userBonusMap[item.id] = UserBonus.fromStaffItem(item);
    });
    bonusInfoSaveForm.userBonusMap = userBonusMap;
    bonusInfoSaveForms.push(bonusInfoSaveForm);
    workFlowDataSaveForm.bonusInfoSaveForms = bonusInfoSaveForms.length > 0 ? bonusInfoSaveForms : undefined;

    //会员充值信息
    let memCardInfo = new MemCardInfo();
    let data = wfDataWraper.getRechargeSettingWFCompData();
    let rechargeOrderItemData = data.rechargeOrderItemData;
    if (data && rechargeOrderItemData) {
      memCardInfo.memTypeId = rechargeOrderItemData.membershipCardId;
      memCardInfo.number = rechargeOrderItemData.number;
      memCardInfo.cost = rechargeOrderItemData.pay;
      memCardInfo.largess = rechargeOrderItemData.largess;
      memCardInfo.limitTime = rechargeOrderItemData.limitTime;
      memCardInfo.limitUnit = rechargeOrderItemData.limitUnit;
    }
    workFlowDataSaveForm.memCardInfo = memCardInfo;
    workFlowDataSaveForm.saveType = saveType;

    if(!AppUtils.isNullObj(wfDataWraper.isAddOldRecord) && wfDataWraper.isAddOldRecord){//true表示补单
      workFlowDataSaveForm.recordType= WfDataTypeEnum.OLD_RCD;
      workFlowDataSaveForm.orderTime = TimeSlotHelper.getTimeStampByDateTime(wfDataWraper.date,wfDataWraper.time);
    }
    return this.workFlowMgr.saveOrUpdate(workFlowDataSaveForm);
  }

}


