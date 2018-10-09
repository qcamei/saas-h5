import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {OpLogQueryForm} from "../../../bsModule/opLog/apiData/OpLogQueryForm";
import {OpLog} from "../../../bsModule/opLog/data/OpLog";
import {PreDaySnapshotData} from "../../../bsModule/checkDay/data/PreDaySnapshotData";
import {DaySnapshotClientMgr} from "../../../bsModule/checkDay/DaySnapshotClientMgr";
import {CheckDayViewDataMgr} from "../checkDayViewDataMgr";
import {OpLogMgr} from "../../../bsModule/opLog/OpLogMgr";
import {PageResp} from "../../../comModule/PageResp";
import {DaySnapshotQueryForm} from "../../../bsModule/checkDay/apiData/DaySnapshotQueryForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {OpLogTypeEnum} from "../../../bsModule/opLog/data/OpLogTypeEnum";
import {AppUtils} from "../../../comModule/AppUtils";
import {DaySnapshotAddForm} from "../../../bsModule/checkDay/apiData/DaySnapshotAddForm";
import {DataDetailCacheMgr} from "../../../comModule/dataDetail/DataDetailCacheMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {DataSynCtrl} from "../../../comModule/dataSyn/DataSynCtrl";


@Component({
  selector: 'checkDay-Hand',
  templateUrl: 'checkDayHand.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class checkDayHandPage implements OnInit, OnDestroy {

  private service: CheckDayHandService;
  public viewData: CheckDayHandViewData;
  private viewDataSub: any;

  public today: Date;  //今天
  public loginDate: number;   //登录时间

  //开始时间
  private _minDate: any;
  get minDate(): any {
    return this._minDate;
  }

  set minDate(value: any) {
    this._minDate = value;
  }

  public curMinDate: any;

  //结束时间
  private _maxDate: any;
  get maxDate(): any {
    return this._maxDate;
  }

  set maxDate(value: any) {
    this._maxDate = value;
  }

  public curMaxDate: any;

  constructor(private daySnapshotClientMgr: DaySnapshotClientMgr,
              private opLogMgr: OpLogMgr,
              private checkDayViewDataMgr: CheckDayViewDataMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new CheckDayHandService(
      this.daySnapshotClientMgr,
      this.opLogMgr,
      this.checkDayViewDataMgr);
  }

  // 日期组件方法
  getPreDaySnapshotByReq() {
    let minTime = this.getMinTime(this._minDate, this.curMinDate);
    let maxTime = this.getMaxTime(this._maxDate, this.curMaxDate);
    this.service.initViewData(minTime, maxTime);
  }

  ngOnInit(): void {
    this.viewDataSub = this.checkDayViewDataMgr.subscribePreCheckDayVD((viewDataP: CheckDayHandViewData) => {

      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    //初始化日历控件初始化
    this.initMinAndMaxTime();
    let minTime = this.getMinTime(this._minDate, this.curMinDate);
    let maxTime = this.getMaxTime(this._maxDate, this.curMaxDate);
    this.service.initViewData(minTime, maxTime);
  }

  ngOnDestroy(): void {

  }

  initMinAndMaxTime() {
    const now = new Date();
    this.today = now;
    this.loginDate  = SessionUtil.getInstance().getLoginDate();
    let dateLogin:Date = new Date(this.loginDate);
    this._minDate = {
      year: dateLogin.getFullYear(),
      month: dateLogin.getMonth() + 1,
      day: dateLogin.getDate()
    };
    this.curMinDate = {hour: dateLogin.getHours(), minute: dateLogin.getMinutes()};
    this._maxDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.curMaxDate = {hour: now.getHours(), minute: now.getMinutes()};
  }

  /**
   * 组装开始时间
   * @return 时间戳
   */
  private getMinTime(minDateTmp, minTimeTmp) {
    let minDate = this.formatDate(minDateTmp);
    let minTime = this.formatTime(minTimeTmp);
    let date = new Date(minDate + " " + minTime);
    let time = date.getTime();
    return time;
  }

  /**
   * 组装结束时间
   * @return 时间戳
   */
  private getMaxTime(maxDateTmp, maxTimeTmp) {
    let maxDate = this.formatDate(maxDateTmp);
    let maxTime = this.formatTime(maxTimeTmp);
    let date = new Date(maxDate + " " + maxTime);
    let time = date.getTime();
    return time;
  }

  /**日期格式*/
  private formatDate(timeTmp: any): string {
    let arrTmp = [timeTmp.year, timeTmp.month, timeTmp.day];
    let date: string = arrTmp.join("/");
    return date;
  }

  /**时间格式*/
  private formatTime(timeTmp: any): string {
    let arrTmp = [timeTmp.hour, timeTmp.minute];
    let time: string = arrTmp.join(":");
    return time;
  }

  getTypeName(type: number): string {
    let typeName: string = '-';
    switch (type) {
      case OpLogTypeEnum.Leaguer: {
        typeName = '客户管理';
      }
        break;
      case OpLogTypeEnum.Product: {
        typeName = '项目管理';
      }
        break;
      case OpLogTypeEnum.Clerk: {
        typeName = '员工管理';
      }
        break;
      case OpLogTypeEnum.Appoint: {
        typeName = '预约管理';
      }
        break;
      case OpLogTypeEnum.Order: {
        typeName = '订单管理';
      }
        break;
    }
    return typeName;
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.getPageData(curPage, this.viewData);
  }

  // 打印
  print() {
  }

  // 取消
  cancel() {

  }

  // 保存并推出
  saveAndExit() {
    this.service.savePreDayshotAndExit(this.viewData);
  }

}

export class CheckDayHandService {
  constructor(private daySnapshotClientMgr: DaySnapshotClientMgr,
              private opLogMgr: OpLogMgr,
              private checkDayViewDataMgr: CheckDayViewDataMgr,) {
  }

  public initViewData(minTime, maxTime): void {

    this.checkDayViewDataMgr.setPreCheckDayViewData(new CheckDayHandViewData());
    this.buildViewData(minTime, maxTime, viewDataTmp => {
      this.handleViewData(viewDataTmp);
    })
  }

  public handleViewData(viewDataP: CheckDayHandViewData) {
    this.checkDayViewDataMgr.setPreCheckDayViewData(viewDataP);
  }

  buildQueryForm(curPage: number, viewdataTmp: CheckDayHandViewData): OpLogQueryForm {
    let opLogQueryForm = new OpLogQueryForm();
    opLogQueryForm.minTime = viewdataTmp.minTime;
    opLogQueryForm.maxTime = viewdataTmp.maxTime;
    opLogQueryForm.storeId = Number(SessionUtil.getInstance().getStoreId());
    opLogQueryForm.pageItemCount = 10;
    opLogQueryForm.buserName = viewdataTmp.buserName;
    opLogQueryForm.pageNo = curPage;
    opLogQueryForm.type = -1;
    return opLogQueryForm;
  }

  buildDayshotQueryForm(viewdataTmp: CheckDayHandViewData): DaySnapshotQueryForm {
    let daySnapshotQueryForm = new DaySnapshotQueryForm();
    daySnapshotQueryForm.minTime = viewdataTmp.minTime;
    daySnapshotQueryForm.maxTime = viewdataTmp.maxTime;
    daySnapshotQueryForm.storeId = SessionUtil.getInstance().getStoreId();
    return daySnapshotQueryForm;
  }

  public async buildViewData(minTime, maxTime, callback: (viewDataTmp: CheckDayHandViewData) => void) {
    let viewDataTmp: CheckDayHandViewData = new CheckDayHandViewData();
    viewDataTmp.minTime = minTime;
    viewDataTmp.maxTime = maxTime;
    viewDataTmp.daySnapshotQueryForm = this.buildDayshotQueryForm(viewDataTmp);
    let preDaySnapshotData: PreDaySnapshotData = await this.daySnapshotClientMgr.findPreDayInfo(viewDataTmp.daySnapshotQueryForm);
    if (preDaySnapshotData) {
      viewDataTmp.preDaySnapshotData = preDaySnapshotData;
    }
    viewDataTmp.opLogQueryForm = this.buildQueryForm(1, viewDataTmp);
    let pageResp: PageResp = await this.opLogMgr.getOpLogPageInfo(viewDataTmp.opLogQueryForm);
    viewDataTmp.oplist = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.curPage = 1;
    viewDataTmp.loadingFinish = true;

    callback(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewData: CheckDayHandViewData) {
    let viewDataTmp = new CheckDayHandViewData();
    AppUtils.copy(viewDataTmp, viewData);
    viewDataTmp.recordCount = 0;
    viewDataTmp.loadingFinish = false;
    viewDataTmp.oplist = [];
    //请求所有消息
    viewDataTmp.opLogQueryForm = this.buildQueryForm(curPage, viewDataTmp);
    let pageResp: PageResp = await this.opLogMgr.getOpLogPageInfo(viewDataTmp.opLogQueryForm);

    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.oplist = pageResp.list;
    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

  public savePreDayshotAndExit(viewData: CheckDayHandViewData) {
    let daySnapshotAddForm: DaySnapshotAddForm = new DaySnapshotAddForm();
    AppUtils.copy(daySnapshotAddForm, viewData.preDaySnapshotData);
    daySnapshotAddForm.storeId = Number(SessionUtil.getInstance().getStoreId());
    daySnapshotAddForm.startTime = viewData.minTime;
    daySnapshotAddForm.endTime = viewData.maxTime;
    daySnapshotAddForm.remark = viewData.remark;
    daySnapshotAddForm.buserId = Number(SessionUtil.getInstance().getUserId());
    daySnapshotAddForm.buserName = viewData.buserName;
    this.daySnapshotClientMgr.addDaySnapshot(daySnapshotAddForm).then(value => {
      if(!AppUtils.isNullObj(value)){
        AppUtils.showSuccess("提示","提交成功");
        //退出登录
        // this.logOut();
      }else{
        AppUtils.showError("提示","提交失败");
      }
    });
  }

  /**
   * 退出登录
   */

  public logOut(){
    //清空持久化数据
    SessionUtil.getInstance().clearData();
    DataSynCtrl.Instance.clear();//清空同步数据
    DataDetailCacheMgr.getInstance().clear();//清空缓存数据
    AppRouter.goLogin();
  }

}

export class CheckDayHandViewData {

  public preDaySnapshotData: PreDaySnapshotData = new PreDaySnapshotData();

  public opLogQueryForm: OpLogQueryForm = new OpLogQueryForm();
  public oplist: Array<OpLog> = new Array<OpLog>();

  //过滤的参数
  public minTime: any;
  public maxTime: any;

  public remark: string = '';
  public buserName:string = '';

  public daySnapshotQueryForm: DaySnapshotQueryForm = new DaySnapshotQueryForm();

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

  constructor() {
    this.buserName = SessionUtil.getInstance().getUserName();
  }

}


