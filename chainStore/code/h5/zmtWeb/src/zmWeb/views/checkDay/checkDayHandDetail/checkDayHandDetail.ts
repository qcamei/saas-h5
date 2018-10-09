import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DaySnapshotClientMgr} from "../../../bsModule/checkDay/DaySnapshotClientMgr";
import {CheckDayViewDataMgr} from "../checkDayViewDataMgr";
import {DaySnapshot} from "../../../bsModule/checkDay/data/DaySnapshot";
import {PageResp} from "../../../comModule/PageResp";
import {OpLog} from "../../../bsModule/opLog/data/OpLog";
import {OpLogMgr} from "../../../bsModule/opLog/OpLogMgr";
import {OpLogQueryForm} from "../../../bsModule/opLog/apiData/OpLogQueryForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";
import {AppUtils} from "../../../comModule/AppUtils";
import {OpLogTypeEnum} from "../../../bsModule/opLog/data/OpLogTypeEnum";


@Component({
  selector: 'checkDayHand-detail',
  templateUrl: 'checkDayHandDetail.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CheckDayHandDetailPage implements OnInit, OnDestroy {

  private service: CheckDayHandDetailService;
  public viewData: CheckDayHandDetailViewData;
  private viewDataSub: any;
  private paramsSub: any;
  private dayId: string;

  constructor(private daySnapshotClientMgr: DaySnapshotClientMgr,
              private opLogMgr: OpLogMgr,
              private checkDayViewDataMgr: CheckDayViewDataMgr,
              public route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) {
    this.service = new CheckDayHandDetailService(
      this.daySnapshotClientMgr,
      this.opLogMgr,
      this.checkDayViewDataMgr);
  }


// 打印
  print() {

  }

// 返回
  cancel() {
    AppRouter.goCheckDayList();
  }

// 保存并推出
  save() {

  }


  ngOnInit(): void {
    this.viewDataSub = this.checkDayViewDataMgr.subscribeCheckDayDetailVD((viewDataP: CheckDayHandDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    this.paramsSub = this.route.params.subscribe(params => {
      this.dayId = params['checkDayId'];
      this.service.initViewData(this.dayId);
    });
  }

  ngOnDestroy(): void {

  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.getPageData(curPage, this.viewData);
  }

  getTypeName(type:number):string{
    let typeName:string = '-';
    switch (type){
      case OpLogTypeEnum.Leaguer: {
        typeName = '客户管理';
      } break;
      case OpLogTypeEnum.Product: {
        typeName =  '项目管理';
      } break;
      case OpLogTypeEnum.Clerk: {
        typeName =  '员工管理';
      } break;
      case OpLogTypeEnum.Appoint: {
        typeName =  '预约管理';
      } break;
      case OpLogTypeEnum.Order: {
        typeName =  '订单管理';
      } break;
    }
    return typeName;
  }

}

export class CheckDayHandDetailService {
  constructor(private daySnapshotClientMgr: DaySnapshotClientMgr,
              private opLogMgr: OpLogMgr,
              private checkDayViewDataMgr: CheckDayViewDataMgr,) {
  }

  public initViewData(dayId: string): void {

    this.checkDayViewDataMgr.setCheckDayDetailViewData(new CheckDayHandDetailViewData());

    this.buildViewData(dayId, viewDataTmp => {
      this.handleViewData(viewDataTmp);
    })
  }

  public handleViewData(viewDataP: CheckDayHandDetailViewData) {
    this.checkDayViewDataMgr.setCheckDayDetailViewData(viewDataP);
  }

  public async buildViewData(dayId: string, callback: (viewDataTmp: CheckDayHandDetailViewData) => void) {
    let viewDataTmp: CheckDayHandDetailViewData = new CheckDayHandDetailViewData();
    let daySnapshot: DaySnapshot = await this.daySnapshotClientMgr.get(Number(dayId));
    if (daySnapshot) {
      viewDataTmp.daySnapshot = daySnapshot;
    }
    viewDataTmp.opLogQueryForm = this.buildQueryForm(1,viewDataTmp);
    let pageResp: PageResp = await this.opLogMgr.getOpLogPageInfo(viewDataTmp.opLogQueryForm);
    viewDataTmp.oplist = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.curPage = 1;
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  buildQueryForm(curPage:number,viewdataTmp: CheckDayHandDetailViewData): OpLogQueryForm {
    let daySnapshot:DaySnapshot = viewdataTmp.daySnapshot;
    let opLogQueryForm = new OpLogQueryForm();
    opLogQueryForm.minTime = Number(daySnapshot.startTime);
    opLogQueryForm.maxTime = Number(daySnapshot.endTime);
    opLogQueryForm.storeId = Number(SessionUtil.getInstance().getStoreId());
    opLogQueryForm.buserName = daySnapshot.buserName;
    opLogQueryForm.pageItemCount = 10;
    opLogQueryForm.pageNo = curPage;
    opLogQueryForm.type = -1;
    return opLogQueryForm;
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewData: CheckDayHandDetailViewData) {
    let viewDataTmp = new CheckDayHandDetailViewData();
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

}

export class CheckDayHandDetailViewData {
  public daySnapshot: DaySnapshot = new DaySnapshot();

  public opLogQueryForm: OpLogQueryForm = new OpLogQueryForm();
  public oplist: Array<OpLog> = new Array<OpLog>();

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

  constructor() {
  }

}


