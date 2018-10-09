import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";
import {
  WFDataWraper, OrderWFCompData, BonusItemData,
  BonusWFCompData, CuserWFCompData, SuperItemData, ReduceItemData, ReduceItemType
} from "../wfComp/WFDataWraper";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {WorkFlowMgr} from "../../../bsModule/workFlow/WorkFlowMgr";
import {UserBonus} from "../../../bsModule/workFlow/data/UserBonus";
import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {BonusInfoSaveForm} from "../../../bsModule/workFlow/apiData/save/BonusInfoSaveForm";
import {DonateItemSaveForm} from "../../../bsModule/workFlow/apiData/save/DonateItemSaveForm";
import {BuyItemSaveForm} from "../../../bsModule/workFlow/apiData/save/BuyItemSaveForm";
import {DelimitCardRecordSaveForm} from "../../../bsModule/workFlow/apiData/save/DelimitCardRecordSaveForm";
import {LeaguerSaveForm} from "../../../bsModule/workFlow/apiData/save/LeaguerSaveForm";
import {WorkFlowDataSaveForm} from "../../../bsModule/workFlow/apiData/save/WorkFlowDataSaveForm";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {WorkFlowDataSaveTypeEnum} from "../../../bsModule/workFlow/apiData/save/WorkFlowDataSaveTypeEnum";
import {PreStoreCardRecordSaveForm} from "../../../bsModule/workFlow/apiData/save/PreStoreCardRecordSaveForm";
import {TimeSlotHelper} from "../../zmComp/date/timeSlot/TimeSlotHelper";
import {WfDataTypeEnum} from "../../../bsModule/workFlow/apiData/save/WfDataTypeEnum";

/**
 * 结算公共组件
 */
@Component({
  selector:'order-comp',
  template:`
       <zm-card-box [withCollapse]="false" [expanded]="true">
          <content>
            <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="100px">
              <span class=" text-right">应结总价：<i _ngcontent-c16="" class="fa fa-yen mg-r-10"></i><span class="font-bold" style="font-size: 24px;">{{orderWFCompData.orderCost | number:'1.2-2'}}</span></span>
              <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md [name]="'保存'" (zmbtnClick)="saveConsume()"></zm-btn-md>
                  <zm-btn-md [disabled]="(orderWFCompData.billList&&orderWFCompData.billList.length == 0) 
                  && (orderWFCompData.reduceList&&orderWFCompData.reduceList.length == 0) 
                  && (orderWFCompData.giftList&&orderWFCompData.giftList.length == 0)" 
                  [name]="'提交订单'" (zmbtnClick)="pay()"></zm-btn-md>
              </div>
            </div> 
          </content>
       </zm-card-box>
  `,
  styles:[`
  
    .text-right{
      text-align: right;
    }
  
    .mg-r-10{
      margin-right:10px;
    } 
    .font-bold{
      font-weight: bold;
    } 
    p{
      font-weight: bold;
      margin: 0 !important;
    }
  
  `]
})

export class OrderComp implements OnInit,OnDestroy{

  public service: OrderCompService;
  //输入参数
  @Input() wFDataWraper:WFDataWraper;
  @Output() saveCallback:EventEmitter<any> = new EventEmitter<any>();
  public orderWFCompData:OrderWFCompData;//结算
  public bonusWFCompData:BonusWFCompData;//提成
  public cuserWFCompData:CuserWFCompData;//会员

  constructor(private wfDataWraperMgr:WFDataWraperMgr,
              private workFlowMgr:WorkFlowMgr){
    this.service = new OrderCompService(this.workFlowMgr);
  }



  ngOnInit(): void {
    this.orderWFCompData = this.wFDataWraper.getOrderWFCompData();
    this.bonusWFCompData = this.wFDataWraper.getBonusWFCompData();
    this.cuserWFCompData = this.wFDataWraper.getCuserWFCompData();
  }

  ngOnDestroy(): void {

  }

  /**
   * 保存挂单
   */
  saveConsume(){
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      this.service.saveWFData(this.wFDataWraper,WorkFlowDataSaveTypeEnum.SAVE).then((workFlowData)=>{
        if(!AppUtils.isNullObj(workFlowData)){
          this.wFDataWraper.setWorkFlowData(workFlowData);
          AppUtils.showSuccess("提示","保存成功");
          this.saveCallback.emit();
        }else{
          AppUtils.showError("提示","保存失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","未选择会员");
    }
  }

  /**
   * 提交订单 跳转结算页面
   */
  pay():void{
    if(this.orderWFCompData && ((this.orderWFCompData.billList.length > 0) || (this.orderWFCompData.reduceList.length > 0) ||(this.orderWFCompData.giftList.length > 0))){
      AppUtils.showMask("提交订单中");//遮罩
      this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
      this.service.saveWFData(this.wFDataWraper,WorkFlowDataSaveTypeEnum.ADDORDER).then((workFlowData:WorkFlowData)=>{
        if(!AppUtils.isNullObj(workFlowData)
          && !AppUtils.isNullObj(workFlowData.orderInfo)
          && !AppUtils.isNullObj(workFlowData.orderInfo.orderId)
          && workFlowData.orderInfo.orderId>0){
          this.wFDataWraper.setWorkFlowData(workFlowData);
          AppUtils.closeMask();
          AppUtils.showSuccess("提示","提交订单成功");
          this.wFDataWraper.getOrderWFCompData().hasSettled = true;//设置为已结算
          AppRouter.goOrderPay(workFlowData.orderInfo.orderId);
        }else{
          AppUtils.closeMask();
          AppUtils.showError("提示","提交订单失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请添加结算项");
    }
  }

}

export class OrderCompService{

  constructor(private workFlowMgr:WorkFlowMgr){}

  /**
   * 流程挂单保存
   * @param wfDataWraper
   * @returns {Promise<WorkFlowData>}
   */
  public saveWFData(wfDataWraper:WFDataWraper,saveType:WorkFlowDataSaveTypeEnum):Promise<WorkFlowData>{
    //todo  整理
    let workFlowDataSaveForm = new WorkFlowDataSaveForm();
    workFlowDataSaveForm.id = !AppUtils.isNullObj(wfDataWraper.getWorkFlowData())?wfDataWraper.getWorkFlowData().id:"";
    workFlowDataSaveForm.number = wfDataWraper.number;
    workFlowDataSaveForm.storeId = SessionUtil.getInstance().getStoreId();
    //会员信息
    let leaguerSaveForm = new LeaguerSaveForm();
    leaguerSaveForm.leaguerId = wfDataWraper.leaguerId;
    leaguerSaveForm.followUserId = wfDataWraper.getBuserWFCompData().selectFollowClerk.id;
    workFlowDataSaveForm.leaguerSaveForm = leaguerSaveForm;
    //次卡划卡列表
    let delimitCardRecordSaveForms = wfDataWraper.getDelimitCardRecordsWFCompData().filterList(ReduceItemType.FromCard).map((item:ReduceItemData)=>{
      let delimitCardRecordSaveForm = new DelimitCardRecordSaveForm();
      delimitCardRecordSaveForm.leaguerPrdCardId = item.leaguerCardId;
      delimitCardRecordSaveForm.itemType = item.itemType;
      delimitCardRecordSaveForm.pgId = item.id;
      delimitCardRecordSaveForm.count = item.count;
      return delimitCardRecordSaveForm;
    })
    workFlowDataSaveForm.delimitCardRecordSaveForms = delimitCardRecordSaveForms.length > 0?delimitCardRecordSaveForms:undefined;
    //预存划卡列表
    let preStoreCardRecordSaveForms = wfDataWraper.getDelimitCardRecordsWFCompData().filterList(ReduceItemType.FromPreStoreCard).map((item:ReduceItemData)=>{
      let preStoreCardRecordSaveForm = new PreStoreCardRecordSaveForm();
      preStoreCardRecordSaveForm.preStoreCardId = item.leaguerCardId;
      preStoreCardRecordSaveForm.itemType = item.itemType;
      preStoreCardRecordSaveForm.pgId = item.id;
      preStoreCardRecordSaveForm.count = item.count;
      return preStoreCardRecordSaveForm;
    })
    workFlowDataSaveForm.preStoreCardRecordSaveForms = preStoreCardRecordSaveForms.length > 0?preStoreCardRecordSaveForms:undefined;
    //购买列表
    let buyListTmp = new Array<SuperItemData>();
    buyListTmp = AppUtils.addAll(buyListTmp,wfDataWraper.getProdRecordsWFCompData().productList);
    buyListTmp = AppUtils.addAll(buyListTmp,wfDataWraper.getAttachProdsWFCompData().goodsList);
    buyListTmp = AppUtils.addAll(buyListTmp,wfDataWraper.getPackageWFCompData().packageList);
    buyListTmp = AppUtils.addAll(buyListTmp,wfDataWraper.getProductCardWFCompData().cardList);
    let buyItemSaveForms = buyListTmp.map((item:SuperItemData)=>{
      let buyItemSaveForm = new BuyItemSaveForm();
      buyItemSaveForm.buyType = item.type;
      buyItemSaveForm.pgId = item.id;
      buyItemSaveForm.oldPrice = item.oldPrice;
      buyItemSaveForm.discount = item.discount;
      buyItemSaveForm.count = item.count;
      buyItemSaveForm.restCount = item.restCount;
      return buyItemSaveForm;
    })
    workFlowDataSaveForm.buyItemSaveForms = buyItemSaveForms.length > 0?buyItemSaveForms:undefined;
    //赠送列表
    let giftListTmp = new Array<SuperItemData>();
    giftListTmp = AppUtils.addAll(giftListTmp,wfDataWraper.getGiftWFCompData().productList);
    giftListTmp = AppUtils.addAll(giftListTmp,wfDataWraper.getGiftWFCompData().goodsList);
    giftListTmp = AppUtils.addAll(giftListTmp,wfDataWraper.getGiftWFCompData().packageList);
    giftListTmp = AppUtils.addAll(giftListTmp,wfDataWraper.getGiftWFCompData().cardList);
    let donateItemSaveForms = giftListTmp.map((item:SuperItemData)=>{
      let donateItemSaveForm = new DonateItemSaveForm();
      donateItemSaveForm.buyType = item.type;
      donateItemSaveForm.pgId = item.id;
      donateItemSaveForm.oldPrice = item.oldPrice;
      donateItemSaveForm.count = item.count;
      return donateItemSaveForm;
    })
    workFlowDataSaveForm.donateItemSaveForms = donateItemSaveForms.length > 0?donateItemSaveForms:undefined;
    //提成列表
    let bonusInfoSaveForms = new Array<BonusInfoSaveForm>();
    wfDataWraper.getBonusWFCompData().bonusList.forEach((item:BonusItemData)=>{
      if(item.staffBonusList.length > 0){
        let bonusInfoSaveForm = new BonusInfoSaveForm();
        bonusInfoSaveForm.prdCardPayType = item.payType;
        bonusInfoSaveForm.buyType = item.type;
        bonusInfoSaveForm.pgId = item.id;
        bonusInfoSaveForm.productCardId = item.productCardId;
        let userBonusMap = {};
        item.staffBonusList.forEach((item) =>{
          userBonusMap[item.id] = UserBonus.fromStaffItem(item);
        })
        bonusInfoSaveForm.userBonusMap = userBonusMap;
        bonusInfoSaveForms.push(bonusInfoSaveForm);
      }
    })
    workFlowDataSaveForm.bonusInfoSaveForms = bonusInfoSaveForms.length > 0?bonusInfoSaveForms:undefined;
    workFlowDataSaveForm.saveType = saveType;

    if(!AppUtils.isNullObj(wfDataWraper.isAddOldRecord) && wfDataWraper.isAddOldRecord){//true表示补单
      workFlowDataSaveForm.recordType= WfDataTypeEnum.OLD_RCD;
      workFlowDataSaveForm.orderTime = TimeSlotHelper.getTimeStampByDateTime(wfDataWraper.date,wfDataWraper.time);
    }

    return this.workFlowMgr.saveOrUpdate(workFlowDataSaveForm);
  }

}






