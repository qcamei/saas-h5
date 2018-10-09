import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {AppUtils} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {OrderDetail} from "./data/OrderDetail";

@Injectable()
export class OrderDetailMgr {

  public static getInstance(): OrderDetailMgr {
    return MgrPool.getInstance().get("OrderDetailMgr",OrderDetailMgr);
  }

  private orderDetailDao: OrderDetailDao;

  constructor() {
    this.orderDetailDao = new OrderDetailDao();
  }

  public get(storeId: string, orderId: string): Promise<OrderDetail> {
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern, storeId, orderId);
    return this.orderDetailDao.getByUri(uri);
  }
}

export class OrderDetailDao extends AsyncRestDao<OrderDetail> {
  constructor() {
    var table = "orderDetail";
    super(OrderDetail, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
