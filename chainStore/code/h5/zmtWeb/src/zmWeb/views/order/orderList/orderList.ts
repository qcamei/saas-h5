import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {OrderTypeEnum} from "../../../bsModule/order/data/OrderTypeEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {OrderListViewData} from "./OrderListViewData";
import {OrderListService} from "./OrderListService";
import {Order} from "../../../bsModule/order/data/Order";
import {ChargebackInfoComp} from "../Comp/chargebackInfo/chargebackInfo";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {OrderDataTypeEnum} from "../../../bsModule/order/data/OrderDataTypeEnum";
import {OldRecordHelper} from "../../../bsModule/workFlow/apiData/save/OldRecordHelper";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";

/**
 * 订单管理 订单列表
 */
@Component({
  selector:'order-list',
  templateUrl:'orderList.html',
  styleUrls:['orderList.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class OrderListPage implements OnInit{

  private service: OrderListService;
  public viewData: OrderListViewData;

  public itemActiveIndex: number = 0;
  public timeSlotEnums: Array<TimeSlotEnum> = new Array<TimeSlotEnum>();

  constructor(
    private matDialog: MatDialog,
    private orderMgr:OrderMgr,
    private orderViewDataMgr:OrderViewDataMgr,
    private storeLeaguerInfoSynDataHolder:StoreLeaguerInfoSynDataHolder,
    private cdRef: ChangeDetectorRef){
    ZmModalMgr.getInstance().reset(matDialog);

    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_SEVEN_DAYS);

    this.service = new OrderListService(
        this.orderMgr,
        this.orderViewDataMgr,
        this.storeLeaguerInfoSynDataHolder);
  }

  ngOnInit(): void {
    this.orderViewDataMgr.setOrderListViewData(new OrderListViewData());

    this.orderViewDataMgr.subscribeOrderListVD((viewDataP:OrderListViewData) => {
      if (AppUtils.isNullObj(viewDataP)) return;
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    // this.service.initViewData();
  }

  /**
   * 过滤订单状态
   * @param status
   */
  switchTab(status:string){
    this.viewData.status = status;
    this.findOrders();
  }

  onTimeSlotCb(timeSlot: TimeSlot): void {
    if (AppUtils.isNullObj(this.viewData) || AppUtils.isNullObj(timeSlot)) return;
    this.viewData.orderQueryForm.minTime = timeSlot.getMinTime().toString();
    this.viewData.orderQueryForm.maxTime = timeSlot.getMaxTime().toString();
    this.findOrders();
  }

  findOrders(){
    this.viewData.orderQueryForm.numberOrName ? this.viewData.orderQueryForm.numberOrName = AppUtils.trimBlank(this.viewData.orderQueryForm.numberOrName) : '';
    this.service.buildViewData(this.viewData);
  }

  /**
   * 页面点击事件 跳转修改提成页面
   * @param simpleOrderData
   */
  goEditBonus(order:Order){
    if(order.orderType == OrderTypeEnum.PURCHASE){
      AppRouter.goEditConsumeBonus(order.id);
    }else if(order.orderType == OrderTypeEnum.RECHARGE){
      AppRouter.goEditRechargeBonus(order.id);
    }
  }

  /**
   * 页面点击事件 跳转订单详情页面
   * @param simpleOrderData
   */
  goDetail(order:Order){
    if(order.orderType == OrderTypeEnum.PURCHASE){
      AppRouter.goOrderConsumeDetail(order.id);
    }else if(order.orderType == OrderTypeEnum.RECHARGE){
      AppRouter.goOrderRechargeDetail(order.id);
    }
  }

  /**
   * 跟进记录
   * @param orderId
   * @param leaguerId
   */
  goAddOrderRecord(orderId,leaguerId){
    AppRouter.goAddOrderRecord(orderId,leaguerId);
  }

  /**
   * 页面点击事件 订单支付
   * @param simpleOrderData
   */
  pay(order:Order){
    if(order.orderType == OrderTypeEnum.PURCHASE){
      AppRouter.goOrderPay(order.id);
    }else if(order.orderType == OrderTypeEnum.RECHARGE){
      AppRouter.goRechargeOrderPay(order.id);
    }
  }

  /**
   * 退单 弹窗
   * @param order
   */
  chargeBack(order:Order){
    const activeModal = ZmModalMgr.getInstance().newModal(ChargebackInfoComp,null,null);
    activeModal.componentInstance.order = order;
    activeModal.componentInstance.callbackFun = ()=>{
      this.getPageData(1);
    }
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.findOrders();
  }

  /**
   * true 表示是 补单
   * @param {number} recordType
   */
  isOldRecordOrder(recordType: number): boolean {
    return recordType === OrderDataTypeEnum.OLD_RCD;
  }

  /**
   * 跳转到补单页
   */
  goAddOldRecord() {
    OldRecordHelper.getInstance().isOldRecord = true;//表示进入补单操作
    AppRouter.goConsume(0);
  }
}





