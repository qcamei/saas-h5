import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {OrderTrack} from "./data/OrderTrack";
import {OrderTrackQueryForm} from "./apiData/OrderTrackQueryForm";
import {OrderTrackUpdateType} from "./apiData/OrderTrackUpdateType";
import {OrderTrackUpdateApiForm} from "./apiData/OrderTrackUpdateApiForm";
import {OrderTrackUpdateStatusForm} from "./apiData/OrderTrackUpdateStatusForm";

@Injectable()
export class OrderTrackMgr {

  public static getInstance(): OrderTrackMgr {
    return MgrPool.getInstance().get("OrderTrackMgr",OrderTrackMgr);
  }

  private orderTrackDao: OrderTrackDao;

  constructor() {
    this.orderTrackDao = new OrderTrackDao();
  }

  public get(storeId: string, orderId: string): Promise<OrderTrack> {
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern, storeId, orderId);
    return this.orderTrackDao.getByUri(uri);
  }

  public updateOrderTrackState(storeId: string, orderId: string, updateStatusData: OrderTrackUpdateStatusForm): Promise<boolean> {
    let updateOrderTrackForm: OrderTrackUpdateApiForm = new OrderTrackUpdateApiForm();
    updateOrderTrackForm.updateType = OrderTrackUpdateType.UpdateStatus;
    updateOrderTrackForm.trackUpdateStatusForm = updateStatusData;
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern, storeId, orderId);
    return this.updateOrderTrack(uri, updateOrderTrackForm);
  }

  public updateOrderTrack(orderId:string, updateOrderTrackForm: OrderTrackUpdateApiForm): Promise<boolean> {
    return this.orderTrackDao.updateWithId(orderId, updateOrderTrackForm);
  }

}

export class OrderTrackDao extends AsyncRestDao<OrderTrack> {
  constructor() {
    var table = "orderTrack";
    super(OrderTrack, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
