import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {EditRechargeBonusViewData} from "./editRechargeBonus/editRechargeBonus";
import {OrderRechargeDetailViewData} from "./orderRechargeDetail/orderRechargeDetail";
import {OrderListViewData} from "./orderList/OrderListViewData";
import {ChargebackInfoViewData} from "./Comp/chargebackInfo/ChargebackInfoViewData";
import {EditConsumeBonusViewData} from "./editConsumeBonus/EditConsumeBonusViewData";
import {OrderConsumeDetailCompViewData} from "./orderConsumeDetail/orderConsumeDetailComp";
import {ConsumePayViewData} from "./pay/consumePay";
import {RechargePayViewData} from "./pay/rechargePay";


@Injectable()
export class OrderViewDataMgr {

  //观察者对象
  private orderListVD: Subject<OrderListViewData> = new BehaviorSubject<OrderListViewData>(null);
  private editConsumeBonusVD: Subject<EditConsumeBonusViewData> = new BehaviorSubject<EditConsumeBonusViewData>(null);
  private editRechargeBonusVD: Subject<EditRechargeBonusViewData> = new BehaviorSubject<EditRechargeBonusViewData>(null);
  private orderRechargeDetailVD: Subject<OrderRechargeDetailViewData> = new BehaviorSubject<OrderRechargeDetailViewData>(null);

  private chargebackInfoCompVD: Subject<ChargebackInfoViewData> = new BehaviorSubject<ChargebackInfoViewData>(null);
  public setChargebackInfoVD(chargebackInfoViewData:ChargebackInfoViewData):void{
    this.chargebackInfoCompVD.next(chargebackInfoViewData);
  }

  public subscribeChargebackInfoVD(func:(chargebackInfoViewData:ChargebackInfoViewData)=>void){
    this.chargebackInfoCompVD.subscribe(func);
  }

  //OrderListViewData
  public setOrderListViewData(orderListViewData:OrderListViewData):void{
    this.orderListVD.next(orderListViewData);
  }

  public subscribeOrderListVD(func:(orderListViewData:OrderListViewData)=>void){
    this.orderListVD.subscribe(func);
  }

  //EditConsumeBonusViewData
  public setEditConsumeBonusViewData(editConsumeBonusViewData:EditConsumeBonusViewData):void{
    this.editConsumeBonusVD.next(editConsumeBonusViewData);
  }

  public subscribeEditConsumeBonusVD(func:(editConsumeBonusViewData:EditConsumeBonusViewData)=>void){
    this.editConsumeBonusVD.subscribe(func);
  }

  //EditRechargeBonusViewData
  public setEditRechargeBonusViewData(editRechargeBonusViewData:EditRechargeBonusViewData):void{
    this.editRechargeBonusVD.next(editRechargeBonusViewData);
  }

  public subscribeEditRechargeBonusVD(func:(editRechargeBonusViewData:EditRechargeBonusViewData)=>void){
    this.editRechargeBonusVD.subscribe(func);
  }

  //OrderRechargeDetailViewData
  public setOrderRechargeDetailViewData(orderRechargeDetailViewData:OrderRechargeDetailViewData):void{
    this.orderRechargeDetailVD.next(orderRechargeDetailViewData);
  }

  public subscribeOrderRechargeDetailVD(func:(orderRechargeDetailViewData:OrderRechargeDetailViewData)=>void){
    this.orderRechargeDetailVD.subscribe(func);
  }

  /********************************************组件*******************************************************/
  private orderConsumeDetaiComplVD: Subject<OrderConsumeDetailCompViewData> = new BehaviorSubject<OrderConsumeDetailCompViewData>(null);

  //OrderConsumeDetailCompViewData
  public setOrderConsumeDetailCompViewData(viewData:OrderConsumeDetailCompViewData):void{
    this.orderConsumeDetaiComplVD.next(viewData);
  }

  public subscribeOrderConsumeDetailCompVD(func:(viewData:OrderConsumeDetailCompViewData)=>void){
    this.orderConsumeDetaiComplVD.subscribe(func);
  }

  /**************************************开单收银支付*********************************************/
  private consumePayVD: Subject<ConsumePayViewData> = new BehaviorSubject<ConsumePayViewData>(null);
  public setConsumePayViewData(viewData:ConsumePayViewData):void{
    this.consumePayVD.next(viewData);
  }

  public subscribeConsumePayVD(func:(viewData:ConsumePayViewData)=>void){
    this.consumePayVD.subscribe(func);
  }

  /**************************************会员充值支付*********************************************/
  private rechargePayVD: Subject<RechargePayViewData> = new BehaviorSubject<RechargePayViewData>(null);
  public setRechargePayViewData(viewData:RechargePayViewData):void{
    this.rechargePayVD.next(viewData);
  }

  public subscribeRechargePayVD(func:(viewData:RechargePayViewData)=>void){
    this.rechargePayVD.subscribe(func);
  }

}
