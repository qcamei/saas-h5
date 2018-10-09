import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit} from "@angular/core";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {MembershipRechargeViewDataMgr} from "../MembershipRechargeViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PageResp} from "../../../comModule/PageResp";
import {OrderQueryForm} from "../../../bsModule/order/apiData/OrderQueryForm";
import {Order} from "../../../bsModule/order/data/Order";
import {OrderTypeEnum} from "../../../bsModule/order/data/OrderTypeEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {OrderNotesMgr} from "../../../bsModule/orderNotes/OrderNotesMgr";
import {RevokeContentAddForm} from "../../../bsModule/orderNotes/apiData/RevokeContentAddForm";
import {Popup} from "../../common/popup/popup";
import {OldRecordHelper} from "../../../bsModule/workFlow/apiData/save/OldRecordHelper";
import {OrderDataTypeEnum} from "../../../bsModule/order/data/OrderDataTypeEnum";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {RestResp} from "../../../comModule/RestResp";
import {Constants} from "../../common/Util/Constants";


/**
 * 充值列表
 */
@Component({
  selector: 'recharge-list',
  templateUrl: 'rechargeList.html',
  styleUrls: ['rechargeList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RechargeListPage implements OnInit {

  private service: RechargeListService;
  public viewData: RechargeListViewData;

  public timeSlotEnums: Array<TimeSlotEnum> = new Array<TimeSlotEnum>();

  constructor(private orderMgr: OrderMgr,
              private membershipRechargeViewDataMgr: MembershipRechargeViewDataMgr,
              private orderNotesMgr: OrderNotesMgr,
              private cdRef: ChangeDetectorRef) {

    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_SEVEN_DAYS);

    this.service = new RechargeListService(this.orderMgr, this.membershipRechargeViewDataMgr);
  }

  ngOnInit(): void {
    OldRecordHelper.reset();//重置和补单相关的字段
    this.membershipRechargeViewDataMgr.setRechargeListViewData(new RechargeListViewData());

    this.membershipRechargeViewDataMgr.subscribeRechargeListViewDataVD((viewDataP: RechargeListViewData) => {
      if (AppUtils.isNullObj(viewDataP)) return;
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    // this.service.initViewData();
  }

  //组件默认回调初始化一次数据
  //时间切换
  onTimeSlotCb(timeSlot: TimeSlot): void {
    if (AppUtils.isNullObj(this.viewData) || AppUtils.isNullObj(timeSlot)) return;
    this.viewData.orderQueryForm.minTime = timeSlot.getMinTime().toString();
    this.viewData.orderQueryForm.maxTime = timeSlot.getMaxTime().toString();
    this.findOrders();
  }

  //状态切换
  switchTab(status: string) {
    this.viewData.status = status;
    this.findOrders();
  }

  //撤销充值
  public async cancelRecharge(orderId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let addForm = new RevokeContentAddForm();
    Popup.getInstance().open("撤销充值", "确定撤销此次充值吗？", () => {
      this.orderNotesMgr.revokeOrder(storeId, orderId, addForm).then((restResp: RestResp) => {
        if (restResp.code == 200) {
          AppUtils.showSuccess("提示", "撤销成功");
          this.getPageData(Constants.DEFAULT_PAGENO);
        } else {
          AppUtils.showError("提示", restResp.tips);
        }
      });

    });
  }

  //分页
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.findOrders();
  }

  findOrders() {
    this.viewData.orderQueryForm.numberOrName ? this.viewData.orderQueryForm.numberOrName = AppUtils.trimBlank(this.viewData.orderQueryForm.numberOrName) : '';
    this.service.buildViewData(this.viewData);
  }

  /**
   * 跳转到补单页
   */
  goAddOldRecord() {
    OldRecordHelper.getInstance().isOldRecord = true;//表示进入补单操作
    this.goRecharge();
  }

  goRecharge() {
    AppRouter.goRecharge(0);
  }

  pay(order: Order) {
    if (order.orderType == OrderTypeEnum.PURCHASE) {
      AppRouter.goOrderPay(order.id);
    } else if (order.orderType == OrderTypeEnum.RECHARGE) {
      AppRouter.goRechargeOrderPay(order.id);
    }
  }

  /**
   * 页面点击事件 跳转修改提成页面
   * @param simpleOrderData
   */
  goEditBonus(order: Order) {
    AppRouter.goEditRechargeBonus(order.id);
  }

  /**
   * 页面点击事件 跳转订单详情页面
   * @param simpleOrderData
   */
  goDetail(order: Order) {
    AppRouter.goOrderRechargeDetail(order.id);
  }

  /**
   * true 表示是 补单
   * @param {number} recordType
   */
  isOldRecordOrder(recordType: number): boolean {
    return recordType === OrderDataTypeEnum.OLD_RCD;
  }
}
export class RechargeListViewData {

  public orderQueryForm: OrderQueryForm = new OrderQueryForm();
  public status: string = "0";
  public orderList: Array<Order> = new Array<Order>();

  public timeSlot: TimeSlot;//时间段
  public itemActiveIndex: number = 2;//默认选中的下标

  public curPage: number = 1;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;


}
export class RechargeListService {

  constructor(private orderMgr: OrderMgr,
              private membershipRechargeViewDataMgr: MembershipRechargeViewDataMgr,) {
  }

  public async buildViewData(viewData?: RechargeListViewData) {
    let viewDataTmp = new RechargeListViewData();
    viewDataTmp.itemActiveIndex = viewData.itemActiveIndex;
    viewDataTmp.status = viewData.status;
    //请求店铺所有订单
    let orderQueryForm = this.buildOrderQueryForm(viewData);
    let pageResp: PageResp = await this.orderMgr.findOrderPageInfo(orderQueryForm);
    if (pageResp && pageResp.list) {
      viewDataTmp.orderList = pageResp.list;
      viewDataTmp.recordCount = pageResp.totalCount;
    }
    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: RechargeListViewData) {
    this.membershipRechargeViewDataMgr.setRechargeListViewData(viewDataP);
  }


  private buildOrderQueryForm(viewData: RechargeListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let orderQueryForm = new OrderQueryForm();
    orderQueryForm.storeId = storeId;
    orderQueryForm.orderType = OrderTypeEnum.RECHARGE;
    orderQueryForm.pageItemCount = 10;
    orderQueryForm.status = viewData.status;
    orderQueryForm.numberOrName = viewData.orderQueryForm.numberOrName;
    orderQueryForm.pageNo = viewData.curPage;
    orderQueryForm.minTime = viewData.orderQueryForm.minTime;
    orderQueryForm.maxTime = viewData.orderQueryForm.maxTime;

    return orderQueryForm;
  }

}






