import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils} from "../../comModule/AppUtils";
import {OrderInfo} from "./data/OrderInfo";
import {OrderInfoForm} from "./apiData/OrderInfoForm";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class OrderWFMgr {
  private orderWFDao: OrderWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.orderWFDao = new OrderWFDao(restProxy);
  }

  /**
   * 工作流 添加订单
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addOrderWF(workFlowDataId,orderInfoForm:OrderInfoForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.orderWFDao.rawReq(workFlowDataId,orderInfoForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改订单信息
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateOrderWF(workFlowDataId,orderId,orderInfoForm:OrderInfoForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, orderId);
    return this.orderWFDao.updateWithId(uri,orderInfoForm);
  }

}

//订单
export class OrderWFDao extends AsyncRestDao<OrderInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/orderInfo";
    super(OrderInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
