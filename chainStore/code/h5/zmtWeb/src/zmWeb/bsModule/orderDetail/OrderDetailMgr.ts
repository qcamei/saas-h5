
import {Injectable} from "@angular/core";
import {OrderDetail} from "./data/OrderDetail";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class OrderDetailMgr{
  private orderDetailDao:OrderDetailDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.orderDetailDao = new OrderDetailDao(restProxy);
  }

  public getOrderDetail(orderId:string):Promise<OrderDetail>{
    return this.orderDetailDao.get(orderId);
  }

}

export class OrderDetailDao extends AsyncRestDao<OrderDetail>{

  constructor(restProxy:AsyncRestProxy){
    var table="orderDetail";
    super(OrderDetail,restProxy,table);
  }

  getService(){
    return AppCfg.getInstance().getServiceAddress();
  }

}
