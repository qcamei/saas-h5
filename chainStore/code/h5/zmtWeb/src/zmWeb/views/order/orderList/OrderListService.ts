import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PageResp} from "../../../comModule/PageResp";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {OrderListViewData, OrderVD} from "./OrderListViewData";
import {OrderQueryForm} from "../../../bsModule/order/apiData/OrderQueryForm";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {OrderTypeEnum} from "../../../bsModule/order/data/OrderTypeEnum";

export class OrderListService {
  constructor(private orderMgr: OrderMgr,
              private orderViewDataMgr: OrderViewDataMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,) {
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: OrderListViewData) {
    this.orderViewDataMgr.setOrderListViewData(viewDataP);
  }

  public async buildViewData(viewData: OrderListViewData) {
    let viewDataTmp = new OrderListViewData();
    viewDataTmp.itemActiveIndex = viewData.itemActiveIndex;
    viewDataTmp.status = viewData.status;

    let storeId = SessionUtil.getInstance().getStoreId();
    let storeLeaguerInfo: StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    viewDataTmp.leaguerMap = storeLeaguerInfo.getAllLeaguerMap();

    //请求店铺所有订单
    viewDataTmp.orderQueryForm = this.buildOrderQueryForm(viewData);
    let pageResp: PageResp = await this.orderMgr.findOrderPageInfo(viewDataTmp.orderQueryForm);
    if(pageResp && pageResp.list){
      viewDataTmp.orderList = pageResp.list.map((item)=>{return OrderVD.fromStore(item)});
      viewDataTmp.recordCount = pageResp.totalCount;
    }
    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewData: OrderListViewData) {
    let viewDataTmp = new OrderListViewData();
    AppUtils.copy(viewDataTmp, viewData);
    viewDataTmp.recordCount = 0;
    viewDataTmp.loadingFinish = false;
    viewDataTmp.orderList = [];

    //请求店铺所有订单
    viewDataTmp.orderQueryForm = this.buildOrderQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.orderMgr.findOrderPageInfo(viewDataTmp.orderQueryForm);

    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.orderList = pageResp.list.map((item)=>{return OrderVD.fromStore(item)});

    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

  private buildOrderQueryForm(viewData: OrderListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let orderQueryForm = new OrderQueryForm();
    orderQueryForm.storeId = storeId;
    orderQueryForm.orderType = OrderTypeEnum.PURCHASE;
    orderQueryForm.pageItemCount = 10;
    orderQueryForm.status = viewData.status;
    if (!AppUtils.isNullObj(viewData)) {
      orderQueryForm.numberOrName = viewData.orderQueryForm.numberOrName;
      orderQueryForm.pageNo = viewData.curPage;
      orderQueryForm.minTime = viewData.orderQueryForm.minTime;
      orderQueryForm.maxTime = viewData.orderQueryForm.maxTime;
    }
    return orderQueryForm;
  }

}
