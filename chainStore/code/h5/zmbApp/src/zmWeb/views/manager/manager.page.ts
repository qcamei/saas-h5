import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {ManageGroup} from "../zmBSComp/zmb/manage/group/ManageGroup";
import {MainViewData} from "../main/MainViewData";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreAdminPermEnum} from "../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminPermEnum";
import {ManageItem} from "../zmBSComp/zmb/manage/itemInGroup/ManageItem";
import {MessageTypeEnum} from "../../bsModule/message/data/MessageTypeEnum";

@IonicPage({
  name: "manager",
  segment: 'manager'
})

@Component({
  template: `
    <zm-root-page-header></zm-root-page-header>
    <zm-page-content>
      <div>
        <zmbManageGroup *ngFor="let item of manageGroups" [manageGroup]="item"></zmbManageGroup>
      </div>
    </zm-page-content>
  `,
  styles: [`
    [text-indent] {
      text-indent: 25px;
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * 管理页
 */
export class ManagerPage {

  manageGroups: Array<ManageGroup>;//权限组
  consumeItems: Array<ManageItem>;//每组权限列表
  leaguerItems: Array<ManageItem>;
  productItems: Array<ManageItem>;
  otherItems: Array<ManageItem>;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  /**
   * 当将要进入页面时触发
   */
  ionViewWillEnter() {
    this.buildManageGroups();//构建 权限组
  }

  /**
   * 构建 权限组
   */
  private buildManageGroups() {
    this.initArrays();//初始化数组
    let permSet = MainViewData.getInstance().userPermData.finalPermSet;
    if (AppUtils.isEmpty(permSet)) return;
    for (let perm of permSet) {
      this.getManageItemByPerm(perm);
    }
    this.sortManagerItems();//将ManagerItems排序
    this.manageGroups.push(ManageGroup.newInstance("消费流程", this.consumeItems));
    this.manageGroups.push(ManageGroup.newInstance("会员管理", this.leaguerItems));
    this.manageGroups.push(ManageGroup.newInstance("产品管理", this.productItems));
    this.manageGroups.push(ManageGroup.newInstance("其他管理", this.otherItems));
    this.cdRef.markForCheck();
  }

  /**
   * 初始化数组
   */
  private initArrays() {
    this.manageGroups = new Array<ManageGroup>();
    this.consumeItems = new Array<ManageItem>();
    this.leaguerItems = new Array<ManageItem>();
    this.productItems = new Array<ManageItem>();
    this.otherItems = new Array<ManageItem>();
  }

  private getManageItemByPerm(perm) {
    let manageItem = ManageItem.newInstance();
    switch (perm) {
      case StoreAdminPermEnum.CLERK_ADMIN:
        break;
      case StoreAdminPermEnum.PRODUCT_ADMIN:
        break;
      case StoreAdminPermEnum.APPOINTMENT_ADMIN:
        manageItem.imgUrl = "assets/icon/appointment.svg";
        manageItem.name = "预约管理";
        manageItem.msgCount = this.getMsgCount(MessageTypeEnum.APPOINTMENT_MNG);
        manageItem.page = "appointmentList";
        manageItem.index = 1;
        this.consumeItems.push(manageItem);
        break;
      case StoreAdminPermEnum.SALARY_ADMIN:
        break;
      case StoreAdminPermEnum.LEAGUER_ADMIN:
        manageItem.imgUrl = "assets/icon/client.svg";
        manageItem.name = "会员管理";
        manageItem.msgCount = 0;
        manageItem.page = "leaguerList";
        manageItem.index = 0;
        this.leaguerItems.push(manageItem);
        break;
      case StoreAdminPermEnum.ORDER_ADMIN:
        manageItem.imgUrl = "assets/icon/order.svg";
        manageItem.name = "订单管理";
        manageItem.msgCount = this.getMsgCount(MessageTypeEnum.ORDER);;
        manageItem.page = "orderList";
        manageItem.index = 2;
        this.consumeItems.push(manageItem);
        break;
      case StoreAdminPermEnum.CASHIER_ADMIN:
        break;
      case StoreAdminPermEnum.MATERIAL_ADMIN:
        break;
      case StoreAdminPermEnum.REPORT_ADMIN:
        manageItem.imgUrl = "assets/icon/achievement.svg";
        manageItem.name = "数据报表";
        manageItem.msgCount = 0;
        manageItem.page = "dataReportHome";
        manageItem.index = 0;
        this.otherItems.push(manageItem);
        break;
      case StoreAdminPermEnum.CARD_ADMIN:
        break;
      case StoreAdminPermEnum.GOODS_ADMIN:
        break;
      case StoreAdminPermEnum.BONUS_ADMIN:
        break;
      case StoreAdminPermEnum.PURCHASE_ADMIN:
        manageItem.imgUrl = "assets/icon/business.svg";
        manageItem.name = "开单管理";
        manageItem.msgCount = this.getMsgCount(MessageTypeEnum.WORKFLOW_MNG);
        manageItem.page = "workFlowList";
        manageItem.index = 0;
        this.consumeItems.push(manageItem);
        break;
      case StoreAdminPermEnum.RECHARGE_ADMIN:
        break;
      case StoreAdminPermEnum.DEVICE_ADMIN:
        break;
      case StoreAdminPermEnum.ARREARAGE_ADMIN:
        break;
      case StoreAdminPermEnum.PHONE_ADMIN:
        break;
      case StoreAdminPermEnum.PACKAGE_ADMIN:
        break;
      case StoreAdminPermEnum.SYNDATA_ADMIN:
        break;
      case StoreAdminPermEnum.INCOME_PAY_ADMIN:
        break;
      case StoreAdminPermEnum.STORE_CONFIG_ADMIN:
        break;
      case StoreAdminPermEnum.DAYSNAPSHOT_ADMIN:
        break;
      case StoreAdminPermEnum.OPLOG_ADMIN:
        break;
    }
  }

  /**
   * 根据消息类型获取消息数量
   * @param {MessageTypeEnum} msgType
   * @returns {number}
   */
  private getMsgCount(msgType: MessageTypeEnum): number {
    for (let message of MainViewData.getInstance().messageList) {
      if (msgType == message.messageType) {
        return message.count;
      }
    }
    return 0;
  }

  /**
   * 当页面将要销毁同时页面上元素移除时触发
   */
  ionViewWillUnload() {
    this.destroyArray(this.manageGroups);
    this.destroyArray(this.consumeItems);
    this.destroyArray(this.leaguerItems);
    this.destroyArray(this.productItems);
    this.destroyArray(this.otherItems);
  }

  /**
   * 销毁数组
   * @param {Array<T>} array
   */
  private destroyArray<T>(array: Array<T>) {
    if (AppUtils.isEmpty(array)) return;
    //回收 数组
    array.splice(0, array.length);
    array = null;
  }

  /**
   * 将ManagerItems排序
   */
  sortManagerItems() {
    this.consumeItems.sort(this.sort);
    this.leaguerItems.sort(this.sort);
    this.productItems.sort(this.sort);
    this.otherItems.sort(this.sort);
  }

  /**
   * 排序方法
   * @param {ManageItem} a
   * @param {ManageItem} b
   * @returns {number}
   */
  private sort(a: ManageItem, b: ManageItem): number {
    return a.index - b.index;
  }
}





