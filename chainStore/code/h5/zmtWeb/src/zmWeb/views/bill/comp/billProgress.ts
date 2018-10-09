import {
  Component, Output, Input, OnInit, OnChanges, SimpleChanges, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {AppUtils} from "../../../comModule/AppUtils";
import {BillViewDataMgr} from "../billViewDataMgr";
import {ShowCompEnum} from "../billDetail/showCompEnum";
import {WorkFlowDataStatusEnum} from "../../../bsModule/workFlow/data/WorkFlowDataStatusEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChargebackInfoComp} from "../../order/Comp/chargebackInfo/chargebackInfo";
import {Order} from "../../../bsModule/order/data/Order";
import {OrderSynDataHolder} from "../../../bsModule/order/OrderSynDataHolder";
import {Constants} from "../../common/Util/Constants";
import {OrderStatusEnum} from "../../../bsModule/order/data/OrderStatusEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 流程开单进度状态组件
 */
@Component({
  selector: 'bill-progress',
  templateUrl:"billProgress.html",
  styles: [`
  .bg-active{
    color:#039be5 !important;
    border:1px solid #039be5 !important;
    border-radius: 8px;
    cursor: pointer;
  }
  .bg-inActive{
    border-radius: 8px;
    color:#A8A8A8 !important;
    border:1px solid #A8A8A8 !important;
  }
  `],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BillProgressComp implements OnInit,OnChanges,OnDestroy{

  @Input() workFlowData:WorkFlowData;
  @Output() show:EventEmitter<any> = new EventEmitter<any>();

  private viewDataSub:any;
  private service:BillProgressService;
  public viewData:BillProgressViewData;

  constructor(private orderSynDataHolder:OrderSynDataHolder,
              private matDialog: MatDialog,
              private billViewDataMgr:BillViewDataMgr,
              private cdRef: ChangeDetectorRef,) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new BillProgressService(this.billViewDataMgr);
    this.viewData = new BillProgressViewData();
  }

  ngOnInit(): void {
    this.viewDataSub = this.billViewDataMgr.subscribeProgressVD((viewData:BillProgressViewData)=>{
      if(!AppUtils.isNullObj(viewData)){
        this.viewData = viewData;
        this.cdRef.markForCheck();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!AppUtils.isNullObj(changes.workFlowData.currentValue)){
      this.service.initViewData(changes.workFlowData.currentValue);
    }
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 点击事件 跳转支付
   */
  goOrderPay(){
    let wfProgress = this.viewData.wfProgress;
    if((wfProgress.status == WorkFlowDataStatusEnum.COMPLETE) && !AppUtils.isNullObj(wfProgress.orderId) && !AppUtils.isNullOrWhiteSpace(wfProgress.orderId.toString())){
      AppRouter.goOrderPay(wfProgress.orderId);
    }else{
      // AppUtils.showWarn("提示","该流程状态不支持支付");
    }
  }

  /**
   * 跟进记录
   */
  goRecord(){
    let split = this.viewData.wfProgress.leaguerId.split("_");
    if((split[1] == Constants.LEAGUER_MALE_SUFFIX) || (split[1] == Constants.LEAGUER_FEMALE_SUFFIX)){
      AppUtils.showWarn("提示","散客暂不支持添加跟进记录");
    }else{
      this.showPage(3);
    }
  }

  /**
   * 退款弹框
   */
  chargeback(){
    let wfProgress = this.viewData.wfProgress;
    if((wfProgress.status == WorkFlowDataStatusEnum.HASPAY) && !AppUtils.isNullObj(wfProgress.orderId) && !AppUtils.isNullOrWhiteSpace(wfProgress.orderId.toString())){
      this.orderSynDataHolder.getData(wfProgress.orderId.toString()).then((order:Order)=>{
        if(order.status == OrderStatusEnum.CHARGEBACK_ALL){//已经退单
          // this.showPage(1);
          AppUtils.showWarn("提示","该流程已完成退单");
        }else{
          const activeModal = ZmModalMgr.getInstance().newModal(ChargebackInfoComp);
          activeModal.componentInstance.order = order;
          activeModal.componentInstance.callbackFun = (()=>{
          })
        }
      })
    }else{
      AppUtils.showWarn("提示","该流程状态不支持退单");
    }
  }

  showPage(index:number){
    if(this.viewData.wfProgress.hasCancel){
      AppUtils.showWarn("提示","该流程已作废");
      // this.show.emit(ShowCompEnum.Cancel);
    }else if(index == ShowCompEnum.Appoint){
      if(this.viewData.wfProgress.hasAppoint){
        this.show.emit(ShowCompEnum.Appoint);
      }
    }else if(index == ShowCompEnum.Consume){
      if(this.viewData.wfProgress.hasOrder){
        this.show.emit(ShowCompEnum.OrderDetail);
      }else{
        this.show.emit(ShowCompEnum.Consume);
      }
    }else if(index == ShowCompEnum.Bonus){
      if(this.viewData.wfProgress.hasOrder){
        this.show.emit(ShowCompEnum.Bonus);
      }
    }else if(index == ShowCompEnum.Record){
      this.show.emit(ShowCompEnum.Record);
    }else if(index == ShowCompEnum.Refund){
      if(this.viewData.wfProgress.hasOrder){
        this.show.emit(ShowCompEnum.Refund);
      }
    }
  }

}

class BillProgressService{

  constructor(private billViewDataMgr:BillViewDataMgr,){}

  public initViewData(workFlowData:WorkFlowData){
    let viewDataTmp = new BillProgressViewData();
    if(!AppUtils.isNullObj(workFlowData)){
      let wfProgress = viewDataTmp.wfProgress;
      wfProgress.id = workFlowData.id;
      if (workFlowData.leaguerInfo) {
        wfProgress.hasLeaguer = true;
        wfProgress.leaguerId = workFlowData.leaguerInfo.leaguerId;
        if (!AppUtils.isNullObj(workFlowData.leaguerInfo.followUserId)
          && !AppUtils.isNullOrWhiteSpace(workFlowData.leaguerInfo.followUserId)
          && AppUtils.isPositiveInteger(workFlowData.leaguerInfo.followUserId)) {
          wfProgress.hasFollowClerk = true;
        }
      }
      if (workFlowData.appointInfo) {
        wfProgress.hasAppoint = true;
      }
      if ((!AppUtils.isNullObj(workFlowData.delimitCardRecordMap) && (Object.keys(workFlowData.delimitCardRecordMap).length>0))
        || (!AppUtils.isNullObj(workFlowData.prodRecordMap) && (Object.keys(workFlowData.prodRecordMap).length>0))
        || (!AppUtils.isNullObj(workFlowData.prdCardRecordMap) && (Object.keys(workFlowData.prdCardRecordMap).length>0))
        || (!AppUtils.isNullObj(workFlowData.goodsRecordMap) && (Object.keys(workFlowData.goodsRecordMap).length>0))
        || (!AppUtils.isNullObj(workFlowData.packagePrjRecordMap) && (Object.keys(workFlowData.packagePrjRecordMap).length>0))) {
        wfProgress.hasPurchase = true;
      }
      if (workFlowData.orderInfo) {
        wfProgress.hasOrder = true;
        wfProgress.orderId = workFlowData.orderInfo.orderId;
      }
      if (!AppUtils.isNullObj(workFlowData.bonusInfoMap) && (Object.keys(workFlowData.bonusInfoMap).length>0)) {
        wfProgress.hasBonus = true;
      }
      if (workFlowData.status == WorkFlowDataStatusEnum.CANCEL) {
        wfProgress.hasCancel = true;
      }else if(workFlowData.status == WorkFlowDataStatusEnum.HASPAY){
        wfProgress.hasPay = true;
      }
      wfProgress.status = workFlowData.status;
    }
    this.billViewDataMgr.setProgressViewData(viewDataTmp);
  }

}

export class BillProgressViewData{
  public wfProgress:WFProgress = new WFProgress();
}

export class WFProgress{
  public id:string;
  public hasAppoint:boolean = false;
  public hasLeaguer:boolean = false;
  public hasFollowClerk:boolean = false;
  public hasPurchase:boolean = false;
  public hasOrder:boolean = false;
  public hasBonus:boolean = false;
  public hasCancel:boolean = false;//作废
  public hasPay:boolean = false;//是否已支付
  public status:number;
  public orderId:number;
  public leaguerId:string;
}


