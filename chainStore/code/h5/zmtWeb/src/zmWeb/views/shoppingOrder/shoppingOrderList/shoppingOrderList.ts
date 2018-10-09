import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
// 模拟模块，删除
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {ShipmentsComp} from "../Comp/shipmentsComp/shipmentsComp";
import {AppRouter} from "../../../comModule/AppRouter";
import {ShoppingOrderListViewData} from "./shoppingListViewData";
import {AppUtils} from "../../../comModule/AppUtils";
import {ShoppingOrderService} from "./ShoppingOrderService";
import {ShoppingOrderViewDataMgr} from "../ShoppingOrderViewDataMgr";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {OrderTrackStatusEnum} from "../../../bsModule/order/data/OrderTrackStatusEnum";
import {OrderTrackMgr} from "../../../bsModule/orderTrack/OrderTrackMgr";
import {OrderTrackUpdateStatusForm} from "../../../bsModule/orderTrack/apiData/OrderTrackUpdateStatusForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Constants} from "../../common/Util/Constants";
import {Order} from "../../../bsModule/order/data/Order";
import {ChargebackInfoComp} from "../../order/Comp/chargebackInfo/chargebackInfo";

// 模拟模块，删除end


@Component({
  selector: 'shoppingOrder-list',
  templateUrl: 'shoppingOrderList.html',
  styles: [`
    .tabActive {
      border-bottom: 2px solid #039be5;
      color: #039be5;

    }

    .nameDiv {
      display: inline-block;
      width: 200px;
      border: 2px solid #03a9f4;
      border-radius: 6px;
    / / padding: 8 px 10 px;
      padding-left: 15px;
      height: 35px;
      line-height: 31px;
      position: relative;
    }



  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ShoppingOrderListPage {

  viewData: ShoppingOrderListViewData;
  private shoppingOrderService: ShoppingOrderService;

  @Input() timeSlotEnums: Array<TimeSlotEnum>;

  constructor(private matDialog: MatDialog,
              private orderMgr: OrderMgr,
              private shoppingOrderViewDataMgr: ShoppingOrderViewDataMgr,
              private orderTrackMgr: OrderTrackMgr,
              private cdRef: ChangeDetectorRef) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.timeSlotEnums = new Array<TimeSlotEnum>();
    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.THIS_MONTH);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_MONTH);

    this.shoppingOrderViewDataMgr.setShoppingOrderListViewData(ShoppingOrderListViewData.getInstance());

    this.shoppingOrderViewDataMgr.subscribeShoppingOrderListVD((viewDataP: ShoppingOrderListViewData) => {
      if (AppUtils.isNullObj(viewDataP)) return;
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.shoppingOrderService = new ShoppingOrderService(this.orderMgr, this.orderTrackMgr, this.shoppingOrderViewDataMgr);
  }

  /**
   * 立即发货
   * @param {string} orderId
   */
  shipMentClick(orderId: string) {
    let callBack = this.updateOrderTrackStatus.bind(this);
    ZmModalMgr.getInstance().newSmallModal(ShipmentsComp, {orderId: orderId}, callBack);
  }

  /**
   * 返回true，隐藏退单按钮
   * @returns {boolean}
   */
  hideChargeBack(trackStatus: number): boolean {
    trackStatus = parseInt(trackStatus.toString());
    return trackStatus != 4 && trackStatus != 0;//已取消或者未付款
  }

  /**
   * 退单 弹窗
   * @param order
   */
  chargeBack(order: Order) {
    const activeModal = ZmModalMgr.getInstance().newModal(ChargebackInfoComp, null, null);
    activeModal.componentInstance.order = order;
    activeModal.componentInstance.callbackFun = () => {
      this.getPageData();
    }
  }

// 订单详情
  goShoppingDetail(orderId: string) {
    AppRouter.goShoppingDetail(orderId);
  }


// tab点击事件，代付款，已完成...
  tabClick(n) {
    this.viewData.trackStatus = n;
    this.getPageData();
  }

  /**
   * 获取列表
   */
  getPageData(curPage?: number) {
    if (AppUtils.isNullObj(this.viewData)) return;
    this.viewData.curPage = curPage || this.viewData.curPage;
    this.shoppingOrderService.getPageData(this.viewData);
  }

  /**
   * 时间段选择组件回调
   * @param {TimeSlot} timeSlot
   */
  onTimeSlotCb(timeSlot: TimeSlot) {
    if (AppUtils.isNullObj(this.viewData) || AppUtils.isNullObj(timeSlot)) return;
    this.viewData.timeSlot = timeSlot;
    this.getPageData();
  }

  /**
   * 获取实收金额
   * @param {number} realPay
   */
  getRealPay(realPay: number): string {
    return "￥" + AppUtils.appendZero(realPay);
  }

  /**
   * 根据状态获取字符串
   * @param {number} trackStatus
   * @returns {string}
   */
  status2String(trackStatus: number): string {
    let strStatus: string = "未知状态";
    switch (trackStatus) {
      case OrderTrackStatusEnum.New:
        strStatus = "待付款";
        break;
      case OrderTrackStatusEnum.Pay:
        strStatus = "待发货";
        break;
      case OrderTrackStatusEnum.Send:
        strStatus = "已发货";
        break;
      case OrderTrackStatusEnum.Finish:
        strStatus = "已完成";
        break;
      case OrderTrackStatusEnum.Cancel:
        strStatus = "已取消";
        break;
    }
    return strStatus;
  }

  /**
   * 立即发货
   * @param {string} orderId 订单id
   * @param {string} company 公司名称
   * @param {string} courierNum 快递单号
   * @returns {Promise<boolean>}
   */
  private updateOrderTrackStatus(orderId: string, company: string, courierNum: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let updateStatusForm: OrderTrackUpdateStatusForm = new OrderTrackUpdateStatusForm();
    updateStatusForm.company = company;
    updateStatusForm.status = OrderTrackStatusEnum.Send;
    updateStatusForm.courierNum = courierNum;
    this.shoppingOrderService.updateOrderTrackStatus(storeId, orderId, updateStatusForm).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess("提示", "发货成功");
          this.getPageData();
        } else {
          AppUtils.showError("提示", "发货失败");
        }
      });
  }
}


