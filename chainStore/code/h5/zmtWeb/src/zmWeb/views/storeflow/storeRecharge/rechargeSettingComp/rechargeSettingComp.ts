import {Component, Input,OnInit} from '@angular/core';
import {AppUtils} from '../../../../comModule/AppUtils';
import {SessionUtil} from '../../../../comModule/session/SessionUtil';
import {BUserMgr} from '../../../../bsModule/buser/BUserMgr';
import {RechargeOrderItemData, RechargeSettingWFCompData, WFDataWraper} from '../../wfComp/WFDataWraper';
import {BuyTypeEnum} from '../../../../bsModule/order/data/BuyTypeEnum';
import {PrdCardPayEnum} from '../../../../bsModule/workFlow/data/PrdCardPayEnum';
import {SelectStaffComp, StaffData} from '../../selectStaffComp/selectStaffComp';
import {RechargeSettingViewData} from './rechargeSettingViewData';
import {ValidPeriodUnitEnum} from '../../../../bsModule/storeCardInfo/data/ValidPeriodUnitEnum';
import {WFDataWraperMgr} from '../../wfComp/WFDataWraperMgr';
import {BonusWFMgr} from "../../../../bsModule/workFlow/BonusWFMgr";
import {MemCardInfoWFMgr} from "../../../../bsModule/workFlow/MemCardInfoWFMgr";
import {StoreClerkInfoSynDataHolder} from "../../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {SelectMemberCardPopup, SelectMemberCardPopupViewData} from "./selectMemberCardPopup";
import {MembershipCard} from "../../../../bsModule/storeCardInfo/data/MembershipCard";
import {MemberCardExist} from "../../../../bsModule/leaguerDetail/data/MemberCardExist";
import {LeaguerDetailMgr} from "../../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {WorkFlowMgr} from "../../../../bsModule/workFlow/WorkFlowMgr";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

/**
 * 充值设置组件
 */
@Component({
  selector:'recharge-setting-comp',
  template:
      `    
    <zm-card-box [withCollapse]="false" [expanded]="true">
        <header>
          <label style="color:#2a2a2a;" class="fz-18 mg-b-0 font-bold">充值设置</label>
        </header>
        <content>
          <div style="width:500px;margin-bottom: 30px;">
              <zm-input-price [required]="true" [label]="'充值金额'" [placeholder]="'请输入充值金额'" [(zmValue)]="rechargeSettingWFCompData.rechargeOrderItemData.pay"></zm-input-price>
              <zm-input-text label="服务提成" placeholder="点击选择服务人员" suffix="+" [zmValue]="rechargeSettingWFCompData.rechargeOrderItemData.staffName" (click)="setServicePerson(rechargeSettingWFCompData.rechargeOrderItemData)" [disabled]="true"></zm-input-text>
              <zm-input-text label="设置会员卡" placeholder="点击设置会员卡" suffix="+" [zmValue]="rechargeSettingWFCompData.rechargeOrderItemData.membershipCardName" (click)="selectMemberCard()" [disabled]="true"></zm-input-text>
          </div>
          
        </content>
    </zm-card-box>
    
     <zm-card-box [withCollapse]="false" [expanded]="true"  *ngIf="viewData.showCardDetail">
        <header>
          <label style="color:#2a2a2a;" class="fz-18 mg-b-0 font-bold">会员卡信息</label>
        </header>
        <content>
          <div id="freeMoneyAndCardNumberDiv" fxLayout="row" fxLayoutAlign="start start" fxLayoutGap="60px">
          
            <div style="width:500px;">
                <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" style="margin-bottom:30px;">
                    <label class="c-label text-right"><span class="font-c3">*</span>有效期</label>
                    <zm-validPeriod-radio [(curValue)]="viewData.validPerioItem" (callback)="changeValidTime($event)"></zm-validPeriod-radio>
                </div>
                <zm-input-price [label]="'额外赠送金额'" [placeholder]="'请输入额外赠送金额'" [(zmValue)]="rechargeSettingWFCompData.rechargeOrderItemData.largess"></zm-input-price>
                <zm-input-text label="会员卡卡号" placeholder="请输入会员卡卡号"  maxlength="20" [(zmValue)]="rechargeSettingWFCompData.rechargeOrderItemData.number"></zm-input-text>
            </div>
             <div fxLayout="column" fxLayoutGap="15px">
                <div>
                     <img *ngIf="rechargeSettingWFCompData.memberCard.imgPath == null" src="assets/images/pic_membership_card1.png" height="180" width="350"/>
                     <img *ngIf="rechargeSettingWFCompData.memberCard.imgPath !=null" src="{{rechargeSettingWFCompData.memberCard.imgPath | imgPrePath}}" height="180" width="350"/>
                </div>
                <div fxLayout="row" fxLayoutAlign="space-between start">
                      <span><label>项目折扣</label>{{rechargeSettingWFCompData.memberCard.prodDiscount|discountPipe}}</span>
                      <span> <label>商品折扣</label>{{rechargeSettingWFCompData.memberCard.goodsDiscount|discountPipe}}</span>
                </div>
                <div fxLayout="row" fxLayoutAlign="space-between start">
                      <span><label>次卡折扣</label>{{rechargeSettingWFCompData.memberCard.prdCardDiscount|discountPipe}}</span>
                      <span><label>套餐折扣</label>{{rechargeSettingWFCompData.memberCard.packagePrjDiscount|discountPipe}}</span>
                 </div>
              
            </div>
           </div>
        </content>
    </zm-card-box>


    `,
  styleUrls: ['../recharge.scss']
})
export class RechargeSettingComp implements OnInit{

  @Input() wFDataWraper:WFDataWraper;

  // public wfId:string;//工作流id
  public rechargeSettingWFCompData :RechargeSettingWFCompData;
  public leaguerId:string;

  private service: RechargeSettingService;
  public  viewData: RechargeSettingViewData = new RechargeSettingViewData();

  constructor(private matDialog: MatDialog,
    private wfDataWraperMgr:WFDataWraperMgr,
    private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
    private leaguerDetailMgr:LeaguerDetailMgr,) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new RechargeSettingService(
      this.storeCardInfoSynDataHolder,
      this.leaguerDetailMgr);
  }

  ngOnInit():void{
    this.rechargeSettingWFCompData = this.wFDataWraper.getRechargeSettingWFCompData();
    this.service.initViewData((viewDataP:RechargeSettingViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
      }
    });
    this.initRechargeOrderItemData();
  }

  async ngOnChanges() {
    if(this.wFDataWraper && this.wFDataWraper.getCuserWFCompData().selectLeaguer && this.wFDataWraper.getCuserWFCompData().selectLeaguer.id){
      this.rechargeSettingWFCompData = this.wFDataWraper.getRechargeSettingWFCompData();
      let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
      this.leaguerId = selectLeaguer.id;
      this.initValidTime();
      if(!AppUtils.isNullObj(selectLeaguer.leaguerMemberCard)
        && !AppUtils.isNullOrWhiteSpace(selectLeaguer.leaguerMemberCard.cardId)
        && AppUtils.isNullOrWhiteSpace(this.rechargeSettingWFCompData.rechargeOrderItemData.membershipCardId)){
        let memberCard = this.wFDataWraper.getCuserWFCompData().memberCard;
        this.rechargeSettingWFCompData.rechargeOrderItemData.largess = memberCard.freeMoney;//设置默认赠送金额
      }
    }
  }

  ngOnDestroy():void{

  }

  /**
   * 初始化rechargeOrderItemData
   */
  initRechargeOrderItemData():void{
    this.rechargeSettingWFCompData.rechargeOrderItemData.buyType = BuyTypeEnum.RECHARGE;
    this.rechargeSettingWFCompData.rechargeOrderItemData.prdCardPayType = PrdCardPayEnum.CashPay;
    if(this.rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio == true){
      this.rechargeSettingWFCompData.rechargeOrderItemData.limitUnit = ValidPeriodUnitEnum.DAY;
      this.rechargeSettingWFCompData.rechargeOrderItemData.limitTime = null;
    }
  }

  /**
   * 将页面数据拷贝到wFDataWraper中
   */
  copyDataToOrderItem(){
    if(this.rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio){
      this.rechargeSettingWFCompData.rechargeOrderItemData.limitUnit = ValidPeriodUnitEnum.FOREVER;
    }
    this.wFDataWraper.setRechargeSettingWFCompData(this.rechargeSettingWFCompData);
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 设置服务人员提成窗口
   */
  setServicePerson(item:RechargeOrderItemData):void{
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      const activeModal = ZmModalMgr.getInstance().newLgModal(SelectStaffComp,null,null);
      //数据传递 回调执行
      activeModal.componentInstance.data = item.staffBonusList;
      activeModal.componentInstance.amount = item.pay;
      activeModal.componentInstance.action = this.selectStaffCallback.bind(this,item);//指定要用于绑定函数内的this的值
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**
   * 选择服务人员回调
   * @param staffList
   */
  selectStaffCallback(orderItem:RechargeOrderItemData,staffList:Array<StaffData>):void{
    let staffNameArr = [];
    orderItem.staffBonusList = [];
    for(let i=0;i<staffList.length;i++){
      let staffData = staffList[i];
      orderItem.staffBonusList.push(staffData);
      staffNameArr.push(staffData.name);
    }
    orderItem.staffName = staffNameArr.join('、');
    if(AppUtils.isNullObj(this.rechargeSettingWFCompData.rechargeOrderItemData.staffBonusList)) {
      this.rechargeSettingWFCompData.rechargeOrderItemData.staffBonusList = orderItem.staffBonusList;
      this.rechargeSettingWFCompData.rechargeOrderItemData.staffName = orderItem.staffName;
    }
    this.copyDataToOrderItem();
  }

  /**
   * 选择会员卡弹框
   *
   */
  selectMemberCard() {
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      const activeModal = ZmModalMgr.getInstance().newModal(SelectMemberCardPopup,null,null);
      //设置弹窗数据
      if(!AppUtils.isNullOrWhiteSpace(selectLeaguer.leaguerMemberCard.cardId)){
        let memberCard = this.wFDataWraper.getCuserWFCompData().memberCard;
        this.viewData.memberCard = memberCard;
      }
      activeModal.componentInstance.data = SelectMemberCardPopupViewData.fromComp(this.viewData);
      activeModal.componentInstance.action = this.selectMemberCardCallback.bind(this);
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**
   * 选择会员卡回调
   */
  selectMemberCardCallback(membershipCardP:MembershipCard){
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(selectLeaguer.leaguerMemberCard && selectLeaguer.leaguerMemberCard.number){//会员卡号
      this.rechargeSettingWFCompData.rechargeOrderItemData.number = selectLeaguer.leaguerMemberCard.number;
    }
    this.viewData.showCardDetail = true;
    this.viewData.memberCard = membershipCardP;
    this.rechargeSettingWFCompData.memberCard = this.viewData.memberCard;
    this.rechargeSettingWFCompData.rechargeOrderItemData.largess = this.viewData.memberCard.freeMoney;
    this.rechargeSettingWFCompData.rechargeOrderItemData.membershipCardName = this.viewData.memberCard.name;
    this.rechargeSettingWFCompData.rechargeOrderItemData.membershipCardId = this.viewData.memberCard.id;
    this.rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio = true;
    this.rechargeSettingWFCompData.rechargeOrderItemData.limitUnit = ValidPeriodUnitEnum.DAY;
    this.rechargeSettingWFCompData.rechargeOrderItemData.limitTime = null;
    this.initValidTime();

    // 工作流回填，显示会员卡详情div
    if(!AppUtils.isNullOrWhiteSpace(this.rechargeSettingWFCompData.rechargeOrderItemData.membershipCardName)){
      this.viewData.showCardDetail = true;
    }else{
      this.viewData.showCardDetail = false;
    }
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 初始化viewData有效期validPerioItem
   */
  initValidTime() {
    this.viewData.validPerioItem.type = this.rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio?0:1;
    this.viewData.validPerioItem.unit = this.rechargeSettingWFCompData.rechargeOrderItemData.limitUnit;
    this.viewData.validPerioItem.value = this.rechargeSettingWFCompData.rechargeOrderItemData.limitTime;
  }

  /**
   * 修改会员卡号
   */
  async changeCardNumber(){
    if(!AppUtils.isNullOrWhiteSpace(this.rechargeSettingWFCompData.rechargeOrderItemData.number)){
      this.leaguerId = this.wFDataWraper.getCuserWFCompData().selectLeaguer.id;
      let cardNumber = this.wFDataWraper.getCuserWFCompData().selectLeaguer.leaguerMemberCard.number;
      if(!/^[A-Za-z0-9]+$/.test(this.rechargeSettingWFCompData.rechargeOrderItemData.number.toString())){
        AppUtils.showWarn("提示","会员卡号格式错误");
      }else{
        let checkMemberCardNumber = await this.service.checkMemberCardNumber(this.rechargeSettingWFCompData.rechargeOrderItemData.number);
        let exist = checkMemberCardNumber.exist == 'true'?true:false;
        if((this.rechargeSettingWFCompData.rechargeOrderItemData.number!=cardNumber) && exist){
          this.rechargeSettingWFCompData.rechargeOrderItemData.cardNumberValid = false;
          AppUtils.showWarn("提示","会员卡号重复");
        }else{
          this.rechargeSettingWFCompData.rechargeOrderItemData.cardNumberValid = true;
        }
      }
    }
  }

  /**
   * 修改有效期
   */
  changeValidTime(e){
    this.rechargeSettingWFCompData.rechargeOrderItemData.validPeriodRadio = this.viewData.validPerioItem.type == 0?true:false;
    this.rechargeSettingWFCompData.rechargeOrderItemData.limitUnit = this.viewData.validPerioItem.unit;
    this.rechargeSettingWFCompData.rechargeOrderItemData.limitTime = this.viewData.validPerioItem.value;
  }

  // /**
  //  * 修改赠送金额
  //  */
  // changeLargess(){
  //   let largess = this.rechargeSettingWFCompData.rechargeOrderItemData.largess;
  //   this.rechargeSettingWFCompData.rechargeOrderItemData.largess = !AppUtils.isNullObj(largess)?AppUtils.roundPoint(largess,2):0;
  // }

}

class RechargeSettingService {
  constructor(
    private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
    private leaguerDetailMgr:LeaguerDetailMgr,) {

  }


  public async initViewData(callback:(viewDataP:RechargeSettingViewData) => void){
    let viewDataTmp = new RechargeSettingViewData();
    let storeId = SessionUtil.getInstance().getStoreId();

    //店铺会员卡
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeCardInfo)){
      viewDataTmp.memberCardList = storeCardInfo.getOpenMemberCardMap().values();
      viewDataTmp.memberCardListTemp = viewDataTmp.memberCardList;
    }
    callback(viewDataTmp);
  }

  /**
   * 检查会员卡号是否重复
   * @param cardNumber
   * @returns {Promise<MemberCardExist>}
   */
  public checkMemberCardNumber(cardNumber:string):Promise<MemberCardExist>{
    let storeId = SessionUtil.getInstance().getStoreId();
    return this.leaguerDetailMgr.checkMemberCardExist(storeId,cardNumber);
  }

}


