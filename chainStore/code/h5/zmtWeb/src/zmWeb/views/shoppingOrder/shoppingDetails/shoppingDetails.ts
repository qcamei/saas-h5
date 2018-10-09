import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {ShipmentsComp} from "../Comp/shipmentsComp/shipmentsComp";
import {ActivatedRoute} from "@angular/router";
import {OrderTrackStatusEnum} from "../../../bsModule/order/data/OrderTrackStatusEnum";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {OrderTrackUpdateStatusForm} from "../../../bsModule/orderTrack/apiData/OrderTrackUpdateStatusForm";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {OrderTrackMgr} from "../../../bsModule/orderTrack/OrderTrackMgr";
import {ShoppingDetailService} from "./ShoppingDetailService";
import {ShoppingDetailViewData} from "./shoppingDetailViewData";
import {TimeSlotHelper} from "../../zmComp/date/timeSlot/TimeSlotHelper";
import {Constants} from "../../common/Util/Constants";
import {BuyDetail} from "../../../bsModule/orderDetail/data/BuyDetail";
import {DonateDetail} from "../../../bsModule/orderDetail/data/DonateDetail";
import {DelimitCardDetail} from "../../../bsModule/orderDetail/data/DelimitCardDetail";
import {ShoppingOrderItem} from "./shoppingOrderItem";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {BuyTypeEnum} from "../../../bsModule/workFlow/data/BuyTypeEnum";
import {AppCfg} from "../../../comModule/AppCfg";
import {PayItem} from "../../../bsModule/order/data/PayItem";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";
import {OrderTrack} from "../../../bsModule/orderTrack/data/OrderTrack";
import {OrderTrackTypeEnum} from "../../../bsModule/order/data/OrderTrackTypeEnum";

// 模拟模块，删除end


@Component({
  selector: 'shoppingDetails',
  templateUrl: 'shoppingDetails.html',
  styles: [`
    .opacity {
      opacity: .5;
    }

    .logistics {
      border-left: 1px dashed #ccc;
      position: relative;
    }

    .logistics b {
      display: block;
      width: 8px;
      height: 8px;
      background: #ccc;
      border-radius: 50%;
      position: absolute;
      left: -4px;
      top: 40%;
    }

    .logistics b.logiActive {
      background: #03a9f4;
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ShoppingDetailsPage implements OnInit {
  private orderId: string;
  private shoppingDetailService: ShoppingDetailService;
  viewData: ShoppingDetailViewData;

  sumPrice: number = 0;//总额
  realPay: number = 0;//实付金额

  constructor(private matDialog: MatDialog, private route: ActivatedRoute,
              private orderMgr: OrderMgr,
              private orderTrackMgr: OrderTrackMgr,
              private orderDetailMgr: OrderDetailMgr,
              private cdRef: ChangeDetectorRef) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.viewData = ShoppingDetailViewData.newInstance();
    this.shoppingDetailService = new ShoppingDetailService(this.orderMgr, this.orderTrackMgr, this.orderDetailMgr);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = params["orderId"];
      this.viewData.orderId = this.orderId;
      this.getOrderDetail();//获取订单详情
    });
  }

  /**
   * 获取物流信息
   */
  getOrderTrack() {
    if (AppUtils.isNullObj(this.orderId)) return;
    let storeId = SessionUtil.getInstance().getStoreId();
    this.shoppingDetailService.getOrderTrack(storeId, this.orderId).then(
      (orderTrack) => {
        this.viewData.orderDetail.orderTrack = orderTrack;
        this.cdRef.markForCheck();
      }
    );
  }

  /**
   * 获取订单详情
   */
  getOrderDetail() {
    if (AppUtils.isNullObj(this.orderId)) return;
    this.shoppingDetailService.getOrderDetail(this.orderId).then(
      (orderDetail) => {
        this.viewData.orderDetail = orderDetail;
        this.cdRef.markForCheck();
      }
    );
  }

  /**
   * 立即发货
   */
  shipMentClick() {
    let callBack = this.updateOrderTrackStatus.bind(this);
    ZmModalMgr.getInstance().newSmallModal(ShipmentsComp, {orderId: this.orderId}, callBack);
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
    this.shoppingDetailService.updateOrderTrackStatus(storeId, orderId, updateStatusForm).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess("提示", "发货成功");
          this.getOrderTrack();//刷新物流状态
        } else {
          AppUtils.showError("提示", "发货失败");
        }
      });
  }

  /**
   * 获取订单状态
   * @returns {number}
   */
  getOrderTrackStatus(): number {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return -1;
    if (AppUtils.isNullObj(this.viewData.orderDetail.orderTrack)) return -1;
    if (AppUtils.isNullObj(this.viewData.orderDetail.orderTrack.status)) return -1;
    return this.viewData.orderDetail.orderTrack.status;
  }

  /**
   * 返回true 表示订单已取消
   * @returns {boolean}
   */
  isCanceled(): boolean {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return false;
    if (AppUtils.isNullObj(this.viewData.orderDetail.orderTrack)) return false;
    if (AppUtils.isNullObj(this.viewData.orderDetail.orderTrack.status)) return false;
    let trackStatus = this.viewData.orderDetail.orderTrack.status;
    return trackStatus == 4;
  }

  getOrderNum(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.simpleOrderInfo)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.simpleOrderInfo.number)) return '-';
    return this.viewData.orderDetail.simpleOrderInfo.number;
  }

  getOrderCreateTime(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.simpleOrderInfo)) return '-';
    let createTime = this.viewData.orderDetail.simpleOrderInfo.createdTime;
    if (createTime == 0) return '-';
    return AppUtils.formatDate(TimeSlotHelper.toDate(this.toNumber(createTime)), Constants.DATE_FORMAT);
  }

  getLeaguerName(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.simpleLeaguerInfo)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.simpleLeaguerInfo.name)) return '-';
    return this.viewData.orderDetail.simpleLeaguerInfo.name;
  }

  getLeaguerPhone(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.simpleLeaguerInfo)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.simpleLeaguerInfo.phone)) return '-';
    return this.viewData.orderDetail.simpleLeaguerInfo.phone;
  }

  getPayTime(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    if (AppUtils.isNullObj(this.viewData.orderDetail.orderTrack)) return '-';
    let payTime = this.viewData.orderDetail.orderTrack.payTime;
    if (payTime == 0) return '-';
    return AppUtils.formatDate(TimeSlotHelper.toDate(this.toNumber(payTime)), Constants.DATE_FORMAT);
  }

  /**
   * 获取交易流水号
   * @returns {string}
   */
  getTradeNo(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let payItems = this.viewData.orderDetail.payItems;
    if (AppUtils.isNullObj(payItems)) return '-';
    payItems.forEach((value: PayItem, index: number, array: PayItem[]) => {
      if (!AppUtils.isNullObj(value.tradeNo)) {
        return value.tradeNo;
      }
    });
    return '-';
  }

  /**
   * 获取支付方式
   * @returns {string}
   */
  getPayType(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let payItems = this.viewData.orderDetail.payItems;
    if (AppUtils.isNullObj(payItems)) return '-';
    let payType: string = '-';
    payItems.forEach((value: PayItem, index: number, array: PayItem[]) => {
      switch (this.toNumber(value.payType)) {
        case PayTypeEnum.CASH:
          payType = "现金";
          break;
        case PayTypeEnum.ALIPAY:
          payType = "支付宝";
          break;
        case PayTypeEnum.WECHAT:
          payType = "微信";
          break;
        case PayTypeEnum.SLOT_CARD:
          payType = "刷卡";
          break;
        case PayTypeEnum.MEMBERSHIPCARD:
          payType = "会员卡";
          break;
        case PayTypeEnum.ARREARAGE:
          payType = "欠款";
          break;
      }
      if (!AppUtils.isNullObj(value.tradeNo)) {
        return payType;
      }
    });
    return payType;
  }

  /**
   * 获取配送方式
   * @returns {string}
   */
  getOrderTrackType(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let orderTrack: OrderTrack = this.viewData.orderDetail.orderTrack;
    if (AppUtils.isNullObj(orderTrack)) return '-';
    switch (this.toNumber(orderTrack.type)) {
      case OrderTrackTypeEnum.Prestore:
        return "到店自提";
      case OrderTrackTypeEnum.Express:
        return "快递配送";
    }
    return '-';
  }

  /**
   * 收货地址
   * @returns {string}
   */
  getAddress(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let orderTrack: OrderTrack = this.viewData.orderDetail.orderTrack;
    if (AppUtils.isNullObj(orderTrack)) return '-';
    if (AppUtils.isNullObj(orderTrack.address)) return '-';
    return orderTrack.address;
  }

  getCompany(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let orderTrack: OrderTrack = this.viewData.orderDetail.orderTrack;
    if (AppUtils.isNullObj(orderTrack)) return '-';
    if (AppUtils.isNullObj(orderTrack.company)) return '-';
    return orderTrack.company;
  }

  /**
   * 发货时间
   * @returns {string}
   */
  getDeliverTime(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let orderTrack: OrderTrack = this.viewData.orderDetail.orderTrack;
    if (AppUtils.isNullObj(orderTrack)) return '-';
    if (orderTrack.deliverTime == 0) return '-';
    return AppUtils.formatDate(TimeSlotHelper.toDate(this.toNumber(orderTrack.deliverTime)), Constants.DATE_FORMAT);
  }

  /**
   * 货运单号
   * @returns {string}
   */
  getCourierNum(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let orderTrack: OrderTrack = this.viewData.orderDetail.orderTrack;
    if (AppUtils.isNullObj(orderTrack)) return '-';
    if (AppUtils.isNullObj(orderTrack.courierNum)) return '-';
    return orderTrack.courierNum;
  }

  /**
   * 获取确认收货时间
   * @returns {string}
   */
  getconfirmTime(): string {
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return '-';
    let orderTrack: OrderTrack = this.viewData.orderDetail.orderTrack;
    if (AppUtils.isNullObj(orderTrack)) return '-';
    if (orderTrack.confirmTime == 0) return '-';
    return AppUtils.formatDate(TimeSlotHelper.toDate(this.toNumber(orderTrack.confirmTime)), Constants.DATE_FORMAT);
  }

  /**
   * 获取列表
   * @returns {Array}
   */
  getList(): Array<ShoppingOrderItem> {
    this.sumPrice = 0;
    this.realPay = 0;
    let list: Array<ShoppingOrderItem> = new Array<ShoppingOrderItem>();
    if (AppUtils.isNullObj(this.viewData.orderDetail)) return list;
    let delimitCardDetails: Array<DelimitCardDetail> = this.viewData.orderDetail.delimitCardDetails;
    let buyDetails: Array<BuyDetail> = this.viewData.orderDetail.buyDetails;
    let donateDetails: Array<DonateDetail> = this.viewData.orderDetail.donateDetails;

    if (!AppUtils.isNullObj(delimitCardDetails)) {
      delimitCardDetails.forEach((value: DelimitCardDetail, index: number, array: DelimitCardDetail[]) => {
        let item: ShoppingOrderItem = this.buildItemByDelimitCardDetail(value);
        list.push(item);
      });
    }
    if (!AppUtils.isNullObj(buyDetails)) {
      buyDetails.forEach((value: BuyDetail, index: number, array: BuyDetail[]) => {
        let item: ShoppingOrderItem = this.buildItemByBuyDetail(value);
        this.sumPrice += this.toNumber(value.cost);
        this.realPay += this.toNumber(value.pay);
        list.push(item);
      });
    }
    if (!AppUtils.isNullObj(donateDetails)) {
      donateDetails.forEach((value: DonateDetail, index: number, array: DonateDetail[]) => {
        let item: ShoppingOrderItem = this.buildItemByDonateDetail(value);
        list.push(item);
      });
    }
    return list;
  }

  private buildItemByDonateDetail(value: DonateDetail): ShoppingOrderItem {
    let item = ShoppingOrderItem.newInstance();
    switch (this.toNumber(value.buyType)) {
      case BuyTypeEnum.PRODUCT:
        item.itemType = "项目";
        break;
      case BuyTypeEnum.GOODS:
        item.itemType = "商品";
        break;
      case BuyTypeEnum.PACKAGE:
        item.itemType = "套餐";
        break;
      case BuyTypeEnum.PRDCARD:
        item.itemType = "次卡";
        break;
    }
    item.pgName = value.pgName;
    item.price = AppUtils.appendZero(value.price);
    item.defaultImg = value.defaultImg;
    item.typeName = value.typeName;
    item.count = value.count;
    item.total = AppUtils.appendZero(value.price * value.count);
    return item;
  }

  private buildItemByBuyDetail(value: BuyDetail): ShoppingOrderItem {
    let item = ShoppingOrderItem.newInstance();
    switch (this.toNumber(value.buyType)) {
      case BuyTypeEnum.PRODUCT:
        item.itemType = "项目";
        break;
      case BuyTypeEnum.GOODS:
        item.itemType = "商品";
        break;
      case BuyTypeEnum.PACKAGE:
        item.itemType = "套餐";
        break;
      case BuyTypeEnum.PRDCARD:
        item.itemType = "次卡";
        break;
    }
    item.pgName = value.pgName;
    item.price = AppUtils.appendZero(value.price);
    item.defaultImg = value.defaultImg;
    item.typeName = value.typeName;
    item.count = value.count;
    item.total = AppUtils.appendZero(value.price * value.count);
    return item;
  }

  private buildItemByDelimitCardDetail(value: DelimitCardDetail): ShoppingOrderItem {
    let item = ShoppingOrderItem.newInstance();
    switch (this.toNumber(value.itemType)) {
      case ProductCardItemEnum.PRODUCT:
        item.itemType = "项目";
        break;
      case ProductCardItemEnum.GOODS:
        item.itemType = "商品";
        break;
      case ProductCardItemEnum.PACKAGE:
        item.itemType = "套餐";
        break;
    }
    item.pgName = value.pgName;
    item.price = AppUtils.appendZero(value.price);
    item.defaultImg = value.defaultImg;
    item.typeName = value.typeName;
    item.count = value.count;
    item.total = AppUtils.appendZero(value.price * value.count);
    return item;
  }

  /**
   * 获取图片显示路径
   * @param {string} path
   * @returns {string}
   */
  getImg(path: string): string {
    if (AppUtils.isNullObj(path)) return "assets/images/goodList.png";
    return AppCfg.getInstance().getImgPreUrl() + path;
  }

  /**
   * 转为number
   * @param {number} num
   * @returns {number}
   */
  toNumber(num: number): number {
    return parseInt(num.toString());
  }

  /**
   * 总额
   * @returns {number}
   */
  getSumPrice(): number {
    return AppUtils.appendZero(this.sumPrice);
  }

  /**
   * 应结
   * @returns {number}
   */
  getRealPay(): number {
    return AppUtils.appendZero(this.realPay);
  }

  /**
   * 折扣
   * @returns {number}
   */
  getDiscountPrice(): number {
    return AppUtils.appendZero(this.sumPrice - this.realPay);
  }
}


