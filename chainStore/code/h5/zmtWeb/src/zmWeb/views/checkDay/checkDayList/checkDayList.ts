import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {DaySnapshot} from "../../../bsModule/checkDay/data/DaySnapshot";
import {DaySnapshotClientMgr} from "../../../bsModule/checkDay/DaySnapshotClientMgr";
import {CheckDayViewDataMgr} from "../checkDayViewDataMgr";
import {PageResp} from "../../../comModule/PageResp";
import {DaySnapshotQueryForm} from "../../../bsModule/checkDay/apiData/DaySnapshotQueryForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";

@Component({
  selector: 'checkDay-list',
  templateUrl: 'checkDayList.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CheckDayListPage implements OnInit, OnDestroy {

  private viewDataSub: any;
  private service: CheckDayListService;
  public viewData: CheckDayListViewData;

  @Input() timeSlotEnums: Array<TimeSlotEnum>;

  constructor(private daySnapshotClientMgr: DaySnapshotClientMgr,
              private checkDayViewDataMgr: CheckDayViewDataMgr,
              private cdRef: ChangeDetectorRef) {

    this.timeSlotEnums = new Array<TimeSlotEnum>();//默认情况是，今天、昨天、过去的七天内
    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.THIS_MONTH);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_MONTH);

    this.service = new CheckDayListService(this.daySnapshotClientMgr, this.checkDayViewDataMgr);

  }

  ngOnInit(): void {
    this.viewDataSub = this.checkDayViewDataMgr.subscribeCheckDayListVD((viewDataP: CheckDayListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })

    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 根据账号查询消息 点击事件
   */
  queryListByAccount() {
    this.service.queryListReq(this.viewData, (viewDataTmp: CheckDayListViewData) => {
      this.handleResult(viewDataTmp)
    });
  }

  private handleResult(viewDataTmp: CheckDayListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.checkList = viewDataTmp.checkList;
      this.viewData.recordCount = viewDataTmp.recordCount;
      this.viewData.curPage = 1;
    }
    this.checkDayViewDataMgr.setCheckDayListViewData(this.viewData);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.getPageData(curPage, this.viewData);
  }

  /**
   * 时间段选择组件回调
   * @param {TimeSlot} timeSlot
   */
  onTimeSlotCb(timeSlot: TimeSlot) {
    console.log("时间段选择。。。。", timeSlot);
    if (AppUtils.isNullObj(this.viewData) || AppUtils.isNullObj(timeSlot)) return;
    this.viewData.minTime = timeSlot.getMinTime();
    this.viewData.maxTime = timeSlot.getMaxTime();
    this.queryListByAccount();
  }

  goDetail(dayId:number){
    AppRouter.goCheckDayDetail(dayId);
  }
}

export class CheckDayListService {
  constructor(private daySnapshotClientMgr: DaySnapshotClientMgr,
              private checkDayViewDataMgr: CheckDayViewDataMgr,) {
  }

  public initViewData() {
    let viewDataTmp = new CheckDayListViewData();
    this.checkDayViewDataMgr.setCheckDayListViewData(viewDataTmp);

    this.buildViewData((viewDataP: CheckDayListViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: CheckDayListViewData) {
    this.checkDayViewDataMgr.setCheckDayListViewData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: CheckDayListViewData) => void) {
    let viewDataTmp = new CheckDayListViewData();
    //请求店铺所有日结
    viewDataTmp.checkDayQueryForm = this.buildCheckDayQueryForm(1, viewDataTmp);
    let pageResp: PageResp = await this.daySnapshotClientMgr.findPageInfo(viewDataTmp.checkDayQueryForm);
    viewDataTmp.checkList = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.curPage = 1;
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  private buildCheckDayQueryForm(curPage, viewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let checkDayQueryForm = new DaySnapshotQueryForm();
    checkDayQueryForm.storeId = storeId;
    checkDayQueryForm.name = viewData.account;
    checkDayQueryForm.pageItemCount = 10;
    checkDayQueryForm.pageNo = curPage;
    checkDayQueryForm.minTime = viewData.minTime;
    checkDayQueryForm.maxTime = viewData.maxTime;
    return checkDayQueryForm;
  }

  /**
   * 根据账号查询列表
   * @param viewData
   * @param {(viewDataTmp: CheckDayListViewData) => void} handleCallBack
   */

  public async queryListReq(viewData, handleCallBack: (viewDataTmp: CheckDayListViewData) => void) {
    //请求店铺所有日结
    viewData.checkDayQueryForm = this.buildCheckDayQueryForm(1, viewData);
    let pageResp: PageResp = await this.daySnapshotClientMgr.findPageInfo(viewData.checkDayQueryForm);
    viewData.checkList = pageResp.list;
    viewData.recordCount = pageResp.totalCount;
    viewData.curPage = 1;
    viewData.loadingFinish = true;
    handleCallBack(viewData);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewData: CheckDayListViewData) {
    let viewDataTmp = new CheckDayListViewData();
    AppUtils.copy(viewDataTmp, viewData);
    viewDataTmp.recordCount = 0;
    viewDataTmp.loadingFinish = false;
    viewDataTmp.checkList = [];
    //请求所有消息
    viewDataTmp.checkDayQueryForm = this.buildCheckDayQueryForm(curPage, viewDataTmp);
    let pageResp: PageResp = await this.daySnapshotClientMgr.findPageInfo(viewDataTmp.checkDayQueryForm);

    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.checkList = pageResp.list;

    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

}

export class CheckDayListViewData {

  public checkList: Array<DaySnapshot> = new Array<DaySnapshot>();
  public checkDayQueryForm: DaySnapshotQueryForm = new DaySnapshotQueryForm();

  //过滤的参数
  public account: string;
  public minTime: any;
  public maxTime: any;


  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

}

