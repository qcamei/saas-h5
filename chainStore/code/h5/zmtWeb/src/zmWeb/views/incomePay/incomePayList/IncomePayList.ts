import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppRouter} from "../../../comModule/AppRouter";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {IncomePayMgr} from "../../../bsModule/incomePay/IncomePayMgr";
import {StoreIncomePaySynDataHolder} from "../../../bsModule/incomePay/StoreIncomePaySynDataHolder";
import {StoreIncomePayViewDataMgr} from "../StoreIncomePayViewDataMgr";
import {PageResp} from "../../../comModule/PageResp";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {IncomePayQueryForm} from "../../../bsModule/incomePay/apiData/IncomePayQueryForm";
import {IncomePay} from "../../../bsModule/incomePay/data/IncomePay";
import {IncomePayType} from "../../../bsModule/incomePay/data/IncomePayType";
import {StoreIncomePay} from "../../../bsModule/incomePay/data/StoreIncomePay";
import {IncomePayCategoryEnum} from "../../../bsModule/incomePay/apiData/IncomePayCategoryEnum";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {Popup} from "../../common/popup/popup";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";


@Component({
  selector: 'income-payList-page',
  templateUrl: 'incomePayList.html',
  styles: [`

    @media (max-width: 599px) {
      .ml-20 {
        margin-left: 0 !important;
      }

      .mat-toolbar-row, .mat-toolbar-single-row {
        height: auto !important;
      }

      .mat-toolbar-row, .mat-toolbar-single-row {
        height: auto !important;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomePayListPage implements OnInit, OnDestroy {

  private viewDataSub: any;
  private service: IncomePayListService;
  public viewData: IncomePayListViewData;

  public curPage = 1;

  constructor(
    private incomePayMgr: IncomePayMgr,
    private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
    private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
    private buserMgr: BUserMgr,
    private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
    private cdRef: ChangeDetectorRef,
    private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new IncomePayListService(
      this.incomePayMgr,
      this.storeIncomePayViewDataMgr,
      this.storeIncomePaySynDataHolder,
      this.buserMgr,
      this.storeClerkInfoSynDataHolder);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeIncomePayViewDataMgr.subscribeIncomePayListVD((viewDataP: IncomePayListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.curPage);
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 页面点击事件 选择时间今天、昨天、七天
   * @param index
   */
  chooseIncomePayTime(index) {
    switch (index) {
      case 0:
        this.setTodayTime();
        break;
      case 1:
        this.setYesterdayTime();
        break;
      case 2:
        this.setLastWeekTime();
        break;
    }
  }

  /**
   * 页面点击事件 今天
   */
  setTodayTime() {
    let date = new Date();
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.findIncomePays();
  }

  /**
   * 页面点击事件 昨日
   */
  setYesterdayTime() {
    let nowDate = new Date();
    let yesterdayTime = nowDate.getTime() - 1000 * 60 * 60 * 24;
    let date = new Date(yesterdayTime);
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: date.getDate()};
    this.findIncomePays();
  }

  /**
   * 页面点击事件 近7天
   */
  setLastWeekTime() {
    let nowDate = new Date();
    let lastWeekTime = nowDate.getTime() - 1000 * 60 * 60 * 24 * 7;
    let date = new Date(lastWeekTime);
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: nowDate.getDate()};
    this.findIncomePays();
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.curPage = curPage;
    this.service.getPageData(curPage, this.viewData);
  }

  findIncomePays() {
    this.service.getPageData(1, this.viewData);
  }


  onTabSelect(e) {
    if (this.viewData.category == e.index){
      return;
    }
    this.viewData.category = e.index;
    this.viewData.maxPrice = null;
    this.viewData.minPrice = null;
    this.findIncomePays();
  }


// 查询方法
  getIncomePayListByReq() {
    this.findIncomePays();
  }

  // 新增
  goAddIncomePay() {
    AppRouter.goAddIncomePayByCagegory(this.viewData.category);
  }

  getTypeNameWithId(typeId: string): string {
    let typeName: string = '';
    for (let item of this.viewData.incomePayTypeList) {
      if (item.id == typeId) {
        typeName = item.name;
      }
    }
    return typeName.length > 0 ? typeName : '-';
  }

  //获取跟进人员名称
  getBuserNameWithId(buserId: string): string {
    let buserName: string;
    buserName = this.viewData.buserMap.get(buserId).name;
    return buserName.length > 0 ? buserName : '-';
  }

  // 编辑
  goEditIncomePay(incomePayId: string) {
    AppRouter.goEditIncomePay(incomePayId);
  }

  /**删除收支*/
  removeIncomePay(incomePayId: string) {
    Popup.getInstance().open("删除收支", "确定删除?", () => {
      this.service.deleteIncomePay(incomePayId).then((success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
          this.curPage = 1;
          this.service.initViewData(this.curPage);
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
        }
      });
    });
  }

}

export class IncomePayListService {

  constructor(private incomePayMgr: IncomePayMgr,
              private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
              private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
              private buserMgr: BUserMgr,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,) {
  }

  public initViewData(curPage) {
    let viewDataTmp = new IncomePayListViewData();
    this.storeIncomePayViewDataMgr.setIncomePayListViewData(viewDataTmp);

    this.buildViewData(curPage).then(
      (viewDataTmp: IncomePayListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: IncomePayListViewData) {
    this.storeIncomePayViewDataMgr.setIncomePayListViewData(viewDataP);
  }

  public async buildViewData(curPage): Promise<IncomePayListViewData> {
    let viewDataTmp = new IncomePayListViewData();

    let storeId = SessionUtil.getInstance().getStoreId();
    let storeIncomePay: StoreIncomePay = await this.storeIncomePaySynDataHolder.getData(storeId);

    viewDataTmp.incomePayTypeList = storeIncomePay.getValidIncomePayTypeList();

    let date = new Date();
    let lastWeekTime = date.getTime() - 1000 * 60 * 60 * 24 * 7;
    let lastWeekDate = new Date(lastWeekTime);
    viewDataTmp.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    viewDataTmp.minTime = {
      year: lastWeekDate.getFullYear(),
      month: lastWeekDate.getMonth() + 1,
      day: lastWeekDate.getDate()
    };

    //请求店铺所有收支
    let incomePayQueryForm = this.buildIncomePayQueryForm(1, viewDataTmp);
    let pageResp: PageResp = await this.incomePayMgr.findIncomePayPageInfo(incomePayQueryForm);
    viewDataTmp.incomePayList = pageResp.list;
    viewDataTmp.payList = pageResp.list.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.PAY) {
        return true;
      } else {
        return false;
      }
    })

    viewDataTmp.incomeList = pageResp.list.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.INCOME) {
        return true;
      } else {
        return false;
      }
    })
    viewDataTmp.recordCount = pageResp.totalCount;

    //获取跟进人员数据
    let storeClerkInfo: StoreClerkInfo = await this.storeClerkInfoSynDataHolder.getData(SessionUtil.getInstance().getIdByStoreId(storeId));
    if (!AppUtils.isNullObj(storeClerkInfo) && storeClerkInfo.getClerkMap().keys().length > 0) {
      let buserList: Array<BUser> = await this.buserMgr.findByMultitId(storeClerkInfo.getClerkMap().keys());
      viewDataTmp.buserMap = this.buildBuserMap(buserList);
    }

    viewDataTmp.curPage = 1;
    viewDataTmp.loadingFinish = true;
    return new Promise<IncomePayListViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  /**
   * 组装员工详情
   * @param buserList
   */
  private buildBuserMap(buserList: Array<BUser>): ZmMap<BUser> {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewData: IncomePayListViewData) {
    let viewDataTmp = new IncomePayListViewData();
    AppUtils.copy(viewDataTmp, viewData);
    viewDataTmp.recordCount = 0;
    viewDataTmp.loadingFinish = false;
    viewDataTmp.incomePayList = [];
    viewDataTmp.incomeList = [];
    viewDataTmp.payList = [];


    //请求店铺所有收支
    let incomePayQueryForm = this.buildIncomePayQueryForm(curPage, viewDataTmp);
    let pageResp: PageResp = await this.incomePayMgr.findIncomePayPageInfo(incomePayQueryForm);

    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.incomePayList = pageResp.list;
    viewDataTmp.payList = pageResp.list.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.PAY) {
        return true;
      } else {
        return false;
      }
    })

    viewDataTmp.incomeList = pageResp.list.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.INCOME) {
        return true;
      } else {
        return false;
      }
    })

    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }


  private buildIncomePayQueryForm(curPage, viewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let incomePayQueryForm = new IncomePayQueryForm();
    incomePayQueryForm.storeId = storeId;
    incomePayQueryForm.category = viewData.category;
    incomePayQueryForm.pageItemCount = 10;
    incomePayQueryForm.pageNo = curPage;
    if (viewData.minTime) {
      incomePayQueryForm.minIncomePayTime = AppUtils.getMinTime(viewData.minTime);
    }
    if (viewData.maxTime) {
      incomePayQueryForm.maxIncomePayTime = AppUtils.getMaxTime(viewData.maxTime);
    }
    if (viewData.minPrice) {
      incomePayQueryForm.minMoney = viewData.minPrice;
    }
    if (viewData.maxPrice){
      incomePayQueryForm.maxMoney = viewData.maxPrice;
    }
    return incomePayQueryForm;
  }

  public deleteIncomePay(incomePayId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise(resolve => {
      this.incomePayMgr.deleteIncomePay(storeId,incomePayId).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

}

export class IncomePayListViewData {

  public incomePayList: Array<IncomePay> = new Array<IncomePay>();

  public incomeList: Array<IncomePay> = new Array<IncomePay>();
  public payList: Array<IncomePay> = new Array<IncomePay>();

  public incomePayTypeList: Array<IncomePayType> = new Array<IncomePayType>();

  public chooseIncomePayType: IncomePayType = new IncomePayType();

  //buserMap
  public buserMap: ZmMap<BUser> = new ZmMap<BUser>();

  //订单过滤参数
  public category: number;

  public minTime: any;
  public maxTime: any;

  public minPrice: number;
  public maxPrice: number;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

  constructor() {
    this.category = IncomePayCategoryEnum.PAY;
  }

}

