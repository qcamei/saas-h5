import {Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {AppRouter} from "../../../comModule/AppRouter";
import {BillViewDataMgr} from "../billViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {WorkFlowMgr} from "../../../bsModule/workFlow/WorkFlowMgr";
import {WorkFlowTypeMgr} from "../../../bsModule/workFlowType/WorkFlowTypeMgr";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {WorkFlowDataQueryForm} from "../../../bsModule/workFlow/apiData/WorkFlowDataQueryForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PageResp} from "../../../comModule/PageResp";
import {WorkFlowType} from "../../../bsModule/workFlowType/data/WorkFlowType";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {Constants} from "../../common/Util/Constants";
import {CancelBillPopup} from "../comp/cancelBillPopup";
import {WorkFlowDataCancelForm} from "../../../bsModule/workFlow/apiData/WorkFlowDataCancelForm";
import {Order} from "../../../bsModule/order/data/Order";
import {ChargebackInfoComp} from "../../order/Comp/chargebackInfo/chargebackInfo";
import {OrderSynDataHolder} from "../../../bsModule/order/OrderSynDataHolder";
import {ShowCompEnum} from "../billDetail/showCompEnum";
import {WorkFlowDataStatusEnum} from "../../../bsModule/workFlow/data/WorkFlowDataStatusEnum";
import {OrderStatusEnum} from "../../../bsModule/order/data/OrderStatusEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {OrderDataTypeEnum} from "../../../bsModule/order/data/OrderDataTypeEnum";
import {OldRecordHelper} from "../../../bsModule/workFlow/apiData/save/OldRecordHelper";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {MgrPool} from "../../../comModule/MgrPool";

@Component({
  selector: 'bill-list',
  templateUrl: 'billList.html',
  styleUrls: ['billList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillListPage implements OnInit {

  private service: BillListService;
  public viewData: BillListViewData;

  public timeSlotEnums: Array<TimeSlotEnum> = new Array<TimeSlotEnum>();

  constructor(private workFlowMgr: WorkFlowMgr,
              private workFlowTypeMgr: WorkFlowTypeMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private orderSynDataHolder: OrderSynDataHolder,
              private billViewDataMgr: BillViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_SEVEN_DAYS);

    this.service = new BillListService(this.workFlowMgr,
      this.workFlowTypeMgr,
      this.storeLeaguerInfoSynDataHolder,
      this.billViewDataMgr);
  }

  ngOnInit(): void {
    OldRecordHelper.reset();//重置和补单相关的字段

    this.billViewDataMgr.setListViewData(new BillListViewData());
    this.billViewDataMgr.subscribeListVD((viewDataP: BillListViewData) => {
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
    this.viewData.workFlowDataQueryForm.minTime = timeSlot.getMinTime().toString();
    this.viewData.workFlowDataQueryForm.maxTime = timeSlot.getMaxTime().toString();
    this.find();
  }

  /**
   * 查询事件
   */
  find() {
    this.viewData.workFlowDataQueryForm.leaguerNameOrPhone ? this.viewData.workFlowDataQueryForm.leaguerNameOrPhone = AppUtils.trimBlank(this.viewData.workFlowDataQueryForm.leaguerNameOrPhone) : '';
    this.service.buildViewData(this.viewData);
  }

  /**
   * 开单按钮点击事件
   */
  goConsume() {
    AppRouter.goConsume(0);
  }

  /**
   * 跳转到补单页
   */
  goAddOldRecord() {
    OldRecordHelper.getInstance().isOldRecord = true;//表示进入补单操作
    this.goConsume();
  }

  /**
   * true 表示是 补单
   * @param {number} recordType
   */
  isOldRecordOrder(recordType: number): boolean {
    return recordType === OrderDataTypeEnum.OLD_RCD;
  }

  /**
   * 点击事件 跳转开单详情
   * @param workFlowId
   */
  goBillDetail(workFlowId) {
    AppRouter.goBillDetail(workFlowId);
  }

  /**
   * 点击事件 跳转开单详情-预约详情
   * @param simpleWFItem
   */
  goAppoint(simpleWFItem: SimpleWFItem) {
    if (simpleWFItem.hasAppoint) {
      AppRouter.goBillDetailByComp(simpleWFItem.id, ShowCompEnum.Appoint);
    } else {
      AppRouter.goBillDetail(simpleWFItem.id);
    }
  }

  /**
   * 点击事件 跳转开单详情-跟进记录
   * @param simpleWFItem
   */
  goDetailRecord(simpleWFItem: SimpleWFItem) {
    let split = simpleWFItem.leaguerId.split("_");
    if ((split[1] == Constants.LEAGUER_MALE_SUFFIX) || (split[1] == Constants.LEAGUER_FEMALE_SUFFIX)) {
      AppUtils.showWarn("提示", "散客暂不支持添加跟进记录");
    } else {
      AppRouter.goBillDetailByComp(simpleWFItem.id, ShowCompEnum.Record);
    }
  }

  /**
   * 点击事件 跳转开单详情-修改提成
   * @param simpleWFItem
   */
  goEditBonus(simpleWFItem: SimpleWFItem) {
    if (simpleWFItem.hasOrder && simpleWFItem.status != 2) {
      AppRouter.goBillDetailByComp(simpleWFItem.id, ShowCompEnum.Bonus);
    }

  }


  /**
   * 退单
   * @param item
   */
  chargeback(item: SimpleWFItem) {
    if ((item.status == WorkFlowDataStatusEnum.HASPAY) && !AppUtils.isNullObj(item.orderId)) {
      this.orderSynDataHolder.getData(item.orderId.toString()).then((order: Order) => {
        if (order.status == OrderStatusEnum.CHARGEBACK_ALL) {//已经退单
          AppUtils.showWarn("提示", "该流程已完成退单");
        } else {
          const activeModal = ZmModalMgr.getInstance().newModal(ChargebackInfoComp, null, null);
          activeModal.componentInstance.order = order;
          activeModal.componentInstance.callbackFun = () => {
          }
        }
      })
    } else {
      AppUtils.showWarn("提示", "改流程状态不支持退单");
    }
  }

  /**
   * 继续
   * @param item
   */
  continue(item: SimpleWFItem) {
    if (item.status == WorkFlowDataStatusEnum.COMPLETE) {
      AppRouter.goOrderPay(item.orderId);
    } else {
      OldRecordHelper.getInstance().isOldRecord = true;//表示进入补单操作
      AppRouter.goBillDetail(item.id);
    }
  }

  /**
   * 作废
   * @param workFlowDataId
   */
  cancelWorkFlowData(workFlowDataId) {
    const activeModal = ZmModalMgr.getInstance().newModal(CancelBillPopup, null, null);
    activeModal.componentInstance.action = (reason) => {
      this.service.cancelWorkFlowData(workFlowDataId, reason).then((success: boolean) => {
        if (success) {
          AppUtils.showSuccess("提示", "作废成功");
          this.find();
        } else {
          AppUtils.showError("提示", "作废失败");
        }
      })
    }
  }


  /**
   * 点击切换tab
   * @param n
   */
  switchTab(status: string) {
    this.viewData.status = status;
    this.find();
  }

  /**
   * 点击事件 跳转支付
   * @param simpleWFItem
   */
  goOrderPay(simpleWFItem: SimpleWFItem) {
    if ((simpleWFItem.status == WorkFlowDataStatusEnum.COMPLETE) && !AppUtils.isNullObj(simpleWFItem.orderId) && !AppUtils.isNullOrWhiteSpace(simpleWFItem.orderId.toString())) {
      AppRouter.goOrderPay(simpleWFItem.orderId);
    } else {
      // AppUtils.showWarn("提示","该流程状态不支持支付");
    }
  }


  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.find();
  }

}

export class BillListService {

  constructor(private workFlowMgr: WorkFlowMgr,
              private workFlowTypeMgr: WorkFlowTypeMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private billViewDataMgr: BillViewDataMgr,) {
  }


  public async buildViewData(viewDataP: BillListViewData) {
    let viewDataTmp = new BillListViewData();
    viewDataTmp.itemActiveIndex = viewDataP.itemActiveIndex;
    viewDataTmp.status = viewDataP.status;

    let workFlowType: WorkFlowType = await this.workFlowTypeMgr.findByName("开单收银");
    let storeId = SessionUtil.getInstance().getStoreId();

    let queryFrom = this.buildQueryForm(viewDataP);
    if (!AppUtils.isNullObj(workFlowType)) {
      queryFrom.workFlowTypeId = workFlowType.id;
    }

    let storeLeaguerInfo: StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    let pageResp: PageResp = await this.workFlowMgr.getWorkFlowPageInfo(queryFrom);
    if (!AppUtils.isNullObj(pageResp) && !AppUtils.isNullObj(storeLeaguerInfo)) {
      viewDataTmp.leaguerMap = storeLeaguerInfo.getAllLeaguerMap();
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.wfList = this.buildListData(viewDataTmp.leaguerMap, pageResp.list);
    }
    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewData: BillListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let queryForm = new WorkFlowDataQueryForm();
    queryForm.storeId = storeId;
    queryForm.pageItemCount = 10;
    queryForm.status = viewData.status;
    queryForm.leaguerNameOrPhone = viewData.workFlowDataQueryForm.leaguerNameOrPhone;
    queryForm.pageNo = viewData.curPage;
    queryForm.minTime = viewData.workFlowDataQueryForm.minTime;
    queryForm.maxTime = viewData.workFlowDataQueryForm.maxTime;

    return queryForm;
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: BillListViewData) {
    this.billViewDataMgr.setListViewData(viewDataP);
  }

  /**
   * 组装页面列表数据
   * @param allLeaguerMap
   * @param workFlowDataList
   * @returns {SimpleWFItem[]}
   */
  private buildListData(allLeaguerMap: ZmMap<Leaguer>, workFlowDataList: Array<WorkFlowData>): Array<SimpleWFItem> {
    let wfList = new Array<SimpleWFItem>();
    for (let i = 0; i < workFlowDataList.length; i++) {
      let item = workFlowDataList[i];
      let simpleWFItem = new SimpleWFItem();
      simpleWFItem.id = item.id;
      simpleWFItem.number = item.number;
      simpleWFItem.status = item.status;
      simpleWFItem.recordType = item.recordType;
      simpleWFItem.orderTime = item.orderTime;
      simpleWFItem.lastUpdateTime = parseInt(item.lastUpdateTime);
      if (item.leaguerInfo) {
        let leaguer: Leaguer = allLeaguerMap.get(item.leaguerInfo.leaguerId);
        simpleWFItem.leaguerId = leaguer ? leaguer.id : '';
        simpleWFItem.leaguerName = leaguer ? leaguer.name : '-';
        simpleWFItem.leaguerPhone = leaguer ? leaguer.encryptLeaguerDetail4New().phone : '-';
        simpleWFItem.hasLeaguer = true;
        if (!AppUtils.isNullObj(item.leaguerInfo.followUserId)
          && !AppUtils.isNullOrWhiteSpace(item.leaguerInfo.followUserId) && AppUtils.isPositiveInteger(item.leaguerInfo.followUserId)) {
          simpleWFItem.hasFollowClerk = true;
        }
      }
      if (item.appointInfo) {
        simpleWFItem.hasAppoint = true;
      }
      if ((!AppUtils.isNullObj(item.delimitCardRecordMap) && (Object.keys(item.delimitCardRecordMap).length > 0))
        || (!AppUtils.isNullObj(item.prodRecordMap) && (Object.keys(item.prodRecordMap).length > 0))
        || (!AppUtils.isNullObj(item.prdCardRecordMap) && (Object.keys(item.prdCardRecordMap).length > 0))
        || (!AppUtils.isNullObj(item.goodsRecordMap) && (Object.keys(item.goodsRecordMap).length > 0))
        || (!AppUtils.isNullObj(item.packagePrjRecordMap) && (Object.keys(item.packagePrjRecordMap).length > 0))) {
        simpleWFItem.hasPurchase = true;
      }
      if (item.orderInfo) {
        simpleWFItem.hasOrder = true;
        simpleWFItem.orderId = item.orderInfo.orderId;
      }
      if (!AppUtils.isNullObj(item.bonusInfoMap) && (Object.keys(item.bonusInfoMap).length > 0)) {
        simpleWFItem.hasBonus = true;
      }
      wfList.push(simpleWFItem);
    }
    return wfList;
  }

  public cancelWorkFlowData(workFlowDataId: string, reason: string): Promise<boolean> {
    let workFlowDataCancelForm = new WorkFlowDataCancelForm();
    workFlowDataCancelForm.cancelReason = reason;
    return this.workFlowMgr.cancelWorkFlowData(workFlowDataId, workFlowDataCancelForm);
  }

}

export class BillListViewData {

  public leaguerMap: ZmMap<Leaguer>;
  public workFlowDataQueryForm: WorkFlowDataQueryForm = new WorkFlowDataQueryForm();
  public wfList: Array<SimpleWFItem> = new Array<SimpleWFItem>();

  public timeSlot: TimeSlot;//时间段
  public itemActiveIndex: number = 2;//默认选中的下标

  public status: string = "0";
  public curPage: number = 1;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

  constructor() {

  }
}

export class SimpleWFItem {
  public id: string;
  public number: string;
  public status: number;
  public leaguerId: string;
  public leaguerName: string;
  public leaguerPhone: string;
  public lastUpdateTime: number;
  public hasAppoint: boolean = false;
  public hasLeaguer: boolean = false;
  public hasFollowClerk: boolean = false;
  public hasPurchase: boolean = false;
  public hasOrder: boolean = false;
  public hasBonus: boolean = false;
  public orderId: number;

  public recordType: number;// 开单类型 WfDataTypeEnum 补单、开单
  public orderTime: number;//补单时间
}
