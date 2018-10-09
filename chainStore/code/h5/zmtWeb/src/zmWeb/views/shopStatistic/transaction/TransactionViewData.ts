import {TradingFlow} from "../../../bsModule/dataReport/apiData/TradingFlow";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {TradingFlowReportQueryForm} from "../../../bsModule/dataReport/apiData/TradingFlowReportQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {MgrPool} from "../../../comModule/MgrPool";
import {AppUtils} from "../../../comModule/AppUtils";

export class TransactionViewData {

  queryForm: TradingFlowReportQueryForm;
  //查询参数
  public minTime: any;
  public maxTime: any;
  pageRest: PageResp;

  tradingFlows: Array<TradingFlow>;
  loadingFinish: boolean = false;
  recordCount: number;
  pageNo: number = 0;
  pageSize: number = 10;

  removable: boolean = true;
  payFilterItems: Array<FilterItem> = [];
  tradeFilterItems: Array<FilterItem> = [];
  itemActiveIndex:number = 0;


  public static newInstance(): TransactionViewData {
    let target: TransactionViewData = new TransactionViewData();
    target.queryForm = new TradingFlowReportQueryForm();
    let date = new Date();
    target.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    target.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    target.queryForm.storeId = SessionUtil.getInstance().getStoreId();
    target.pageRest = new PageResp();
    target.pageRest.list = [];
    return target;
  }

  public static getInstance():TransactionViewData{
    let target:TransactionViewData =   MgrPool.getInstance().get("TransactionViewData",TransactionViewData);
    if (AppUtils.isNullObj(target.pageRest)){
      let date = new Date();
      target.queryForm = new TradingFlowReportQueryForm();
      target.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
      target.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
      target.queryForm.storeId = SessionUtil.getInstance().getStoreId();
      target.pageRest = new PageResp();
      target.pageRest.list = [];
    }
    return target;
}


  public buildTodayQueryForm() {
    this.resetPage();
    let date = new Date();
    this.minTime = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.maxTime = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  public buildYesterdayQueryForm() {
    this.resetPage();
    let date = new Date();
    let timeY = date.getTime() - 1000 * 60 * 60 * 24;
    let dateY = new Date(timeY);
    this.minTime = {year: dateY.getFullYear(), month: dateY.getMonth() + 1, day: dateY.getDate()};
    this.maxTime = {year: dateY.getFullYear(), month: dateY.getMonth() + 1, day: dateY.getDate()};
  }

  public buildCurrMonthQueryForm() {
    this.resetPage();
    let date = new Date();
    this.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    this.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  public buildLastMonthQueryForm() {
    this.resetPage();
    let date = new Date();
    let day = date.getDate();
    let lastMonthTime = date.getTime() - 1000 * 60 * 60 * 24 * day;
    let lastMonthDate = new Date(lastMonthTime);
    this.minTime = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: 1};
    this.maxTime = {
      year: lastMonthDate.getFullYear(),
      month: lastMonthDate.getMonth() + 1,
      day: lastMonthDate.getDate()
    };
  }

  public setPageResp(pageRest: PageResp): void {
    if (pageRest) {
      this.pageRest = pageRest;
      if (this.pageRest.list) {
        for (let i = 0; i < this.pageRest.list.length; i++) {
          this.pageRest.list[i].position = i + 1 + (this.pageNo - 1) * this.pageSize;
        }
      }
    }

  }


  resetPage() {
    this.pageNo = 1;
  }


  /**
   * 交易方式筛选
   * @param index
   */
  changeTradeType(index) {
    this.resetPage();
    switch (index) {
      case -1:
        this.addTradeTypeFilter(0);
        this.addTradeTypeFilter(1);
        break;
      case 0:
      case 1:
        this.addTradeTypeFilter(index);
        break
    }
  }

  /**
   * 增加交易方式筛选条件
   * @param {number} type
   */
  addTradeTypeFilter(type: number) {
    if (this.tradeFilterItems) {
      for (let i = 0; i < this.tradeFilterItems.length; i++) {
        let filterItem = this.tradeFilterItems[i];
        if (filterItem.type == type) {
          return;
        }
      }
      this.queryForm.tradeType.push(type);
      let typeName;
      switch (type) {
        case 0:
          typeName = "收款";
          break;
        case 1:
          typeName = "退款";
          break
      }
      let item: FilterItem = new FilterItem(1, type, typeName);
      this.tradeFilterItems.push(item);
    }
  }


  /**
   * 选择时间筛选
   */
  chooseTime(index) {

    switch (index) {
      case 0:
        this.buildTodayQueryForm();
        break;
      case 1:
        this.buildYesterdayQueryForm();
        break;
      case 2:
        this.buildCurrMonthQueryForm();
        break;
      case 3:
        this.buildLastMonthQueryForm();
        break;
    }
  }


  /**
   * 删除指定 filterItem
   * @param filterItem
   */
  removeFilter(filterItem) {
    if (filterItem.filterType == 0) {//支付方式
      this.payFilterItems = this.payFilterItems.filter(item => ![filterItem].includes(item));
      this.queryForm.payType = this.queryForm.payType.filter(item => !(item == filterItem.type));
    } else {
      this.tradeFilterItems = this.tradeFilterItems.filter(item => ![filterItem].includes(item));
      this.queryForm.tradeType = this.queryForm.tradeType.filter(item => !(item == filterItem.type));
    }
  }


  /**
   * 改变支付方式
   * @param index
   */
  changePayType(index) {
    this.resetPage();
    switch (index) {
      case -1:
        this.addPayFilterItemsIfNotExists(1);
        this.addPayFilterItemsIfNotExists(2);
        break;
      case -2:
        this.addPayFilterItemsIfNotExists(0);
        this.addPayFilterItemsIfNotExists(3);
        this.addPayFilterItemsIfNotExists(4);
        this.addPayFilterItemsIfNotExists(5);
        break;
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        this.addPayFilterItemsIfNotExists(index);
        break;
    }
  }

  /**
   * 增加支付方式筛选条件
   * @param {number} type
   */
  addPayFilterItemsIfNotExists(type: number) {
    if (this.payFilterItems) {
      for (let i = 0; i < this.payFilterItems.length; i++) {
        let filterItem = this.payFilterItems[i];
        if (filterItem.type == type) {
          return;
        }
      }
      this.queryForm.payType.push(type);
      let typeName;
      switch (type) {
        case 0:
          typeName = "现金";
          break;
        case 1:
          typeName = "支付宝";
          break;
        case 2:
          typeName = "微信";
          break;
        case 3:
          typeName = "刷卡";
          break;
        case 4:
          typeName = "会员卡";
          break;
        case 5:
          typeName = "欠款";
          break;
      }
      let item: FilterItem = new FilterItem(0, type, typeName);
      this.payFilterItems.push(item);
    }
  }


}

export class FilterItem {
  filterType: number;//分为支付方式 0，交易方式 1
  type: number;// filterType下面的子类型
  typeName: string;//类型名

  constructor(filterType: number, type: number, typeName: string) {
    this.filterType = filterType;
    this.type = type;
    this.typeName = typeName;
  }

}
