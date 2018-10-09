
import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AppCfg} from "../../comModule/AppCfg";
import {OrderNotes} from "./data/OrderNotes";
import {ChargeBackRecordAddForm} from "./apiData/ChargeBackRecordAddForm";
import {AppUtils} from "../../comModule/AppUtils";
import {RevokeContentAddForm} from "./apiData/RevokeContentAddForm";
import {RestResp} from "../../comModule/RestResp";

@Injectable()
export class OrderNotesMgr{

  private orderNotesDao:OrderNotesDao;
  private chargeBackRecordDao:ChargeBackRecordDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.orderNotesDao = new OrderNotesDao(restProxy);
    this.chargeBackRecordDao = new ChargeBackRecordDao(restProxy);
  }

  public getOrderNotes(orderId:string){
    return this.orderNotesDao.get(orderId);
  }

  public addChargeBackRecord(orderId:string,inputForm:ChargeBackRecordAddForm){
    let uriPattern = "{0}/{1}";
    let findPath = AppUtils.format(uriPattern,"chargeBackRecord",orderId);
    return this.chargeBackRecordDao.addFormByCond(inputForm,findPath);
  }

  public revokeOrder(storeId:string,orderId:string,addForm:RevokeContentAddForm):Promise<RestResp>{
    let uriPattern = "{0}/{1}/{2}";
    let path = "revokeContent";
    let findPath = AppUtils.format(uriPattern,path,storeId,orderId);
    return this.chargeBackRecordDao.addFormWithResp(findPath,addForm);
  }

}

export class ChargeBackRecordDao extends AsyncRestDao<OrderNotes>{

  constructor(restProxy:AsyncRestProxy){
    var table="orderNotes";
    super(OrderNotes,restProxy,table);
  }

  getService(){
    return AppCfg.getInstance().getServiceAddress();
  }

}

export class OrderNotesDao extends AsyncRestDao<OrderNotes>{

  constructor(restProxy:AsyncRestProxy){
    var table="orderNotes";
    super(OrderNotes,restProxy,table);
  }

  getService(){
    return AppCfg.getInstance().getServiceAddress();
  }

}
