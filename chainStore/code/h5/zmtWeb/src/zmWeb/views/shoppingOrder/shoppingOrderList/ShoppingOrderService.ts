import {ShoppingOrderViewDataMgr} from "../ShoppingOrderViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PageResp} from "../../../comModule/PageResp";
import {Constants} from "../../common/Util/Constants";
import {ShoppingOrderListViewData} from "./shoppingListViewData";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {MallOrderQueryForm} from "../../../bsModule/order/apiData/MallOrderQueryForm";
import {MallOrder} from "../../../bsModule/order/data/MallOrder";
import {OrderTrackStatusEnum} from "../../../bsModule/order/data/OrderTrackStatusEnum";
import {OrderTrackMgr} from "../../../bsModule/orderTrack/OrderTrackMgr";
import {OrderTrackUpdateApiForm} from "../../../bsModule/orderTrack/apiData/OrderTrackUpdateApiForm";
import {OrderTrackUpdateStatusForm} from "../../../bsModule/orderTrack/apiData/OrderTrackUpdateStatusForm";
import {OrderTrackUpdateType} from "../../../bsModule/orderTrack/data/OrderTrackUpdateType";

export class ShoppingOrderService {

  constructor(private orderMgr: OrderMgr,private orderTrackMgr: OrderTrackMgr, private shoppingOrderViewDataMgr: ShoppingOrderViewDataMgr) {
  }

  public handleViewData(viewDataP: ShoppingOrderListViewData) {
    this.shoppingOrderViewDataMgr.setShoppingOrderListViewData(viewDataP);
  }

  /**
   * 获取列表
   * @param {ShoppingOrderListViewData} viewData
   * @returns {Promise<void>}
   */
  public async getPageData(viewData: ShoppingOrderListViewData) {
    viewData.loadingFinish = false;

    let queryForm: MallOrderQueryForm = this.buildQueryForm(viewData);//构建表单

    let pageResp: PageResp = await this.orderMgr.findMallOrderPage(queryForm);
    if (!AppUtils.isNullObj(pageResp)) {
      viewData.mallOrders = this.buildShoppingOrderDataList(pageResp.list);
      viewData.recordCount = pageResp.totalCount;
    } else {
      viewData.mallOrders = new Array<MallOrder>();
    }
    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  private buildQueryForm(viewDataTmp: ShoppingOrderListViewData) {
    let storeId: number = parseInt(SessionUtil.getInstance().getStoreId());
    let queryForm: MallOrderQueryForm = new MallOrderQueryForm();
    queryForm.storeId = storeId;
    queryForm.numberOrName = viewDataTmp.searchKey;

    queryForm.maxTime = viewDataTmp.timeSlot.getMaxTime();
    queryForm.minTime = viewDataTmp.timeSlot.getMinTime();
    queryForm.pageNo = viewDataTmp.curPage;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.status  = new Array<number>();
    if(viewDataTmp.trackStatus == -1){//全部
      queryForm.status.push(OrderTrackStatusEnum.New,OrderTrackStatusEnum.Pay,OrderTrackStatusEnum.Send,OrderTrackStatusEnum.Finish,OrderTrackStatusEnum.Cancel);
    }else {
      queryForm.status.push(viewDataTmp.trackStatus);
    }

    return queryForm;
  }

  private buildShoppingOrderDataList(list: Array<MallOrder>) {
    let shoppingOrderListTmp = new Array<MallOrder>();
    AppUtils.copyJson(shoppingOrderListTmp, JSON.stringify(list));//深度copy数组
    return shoppingOrderListTmp;
  }

  /**
   * 修改 物流信息 状态
   * @param {string} storeId 店铺id
   * @param {string} orderId 订单id 也是 OrderTrack 的 id
   * @param {OrderTrackUpdateStatusForm} updateStatusForm 修改状态表单
   * @returns {Promise<boolean>}
   */
  public updateOrderTrackStatus(storeId: string, orderId: string, updateStatusForm: OrderTrackUpdateStatusForm): Promise<boolean> {
    return new Promise(resolve => {
      this.orderTrackMgr.updateOrderTrackStatus(storeId, orderId, updateStatusForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  }

}
