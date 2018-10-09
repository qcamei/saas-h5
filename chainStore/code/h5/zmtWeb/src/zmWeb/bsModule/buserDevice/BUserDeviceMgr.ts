import {Injectable} from '@angular/core';
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {BUserDevice} from "./data/BUserDevice";
import {ReqMap} from "../../comModule/AppUtils";
import {BindDeviceForm} from "./apiData/BindDeviceForm";
import {BUserDeviceUpdateForm} from "./apiData/BUserDeviceUpdateForm";
import {MCtrlLockApiForm} from "./apiData/MCtrlLockApiForm";
import {RestResp} from "../../comModule/RestResp";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class BUserDeviceMgr {

  private buserDeviceDao: BUserDeviceDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserDeviceDao = new BUserDeviceDao(restProxy);
  }

  public getBuserDevice(id: string): Promise<BUserDevice> {
    return this.buserDeviceDao.get(id);
  }

  public getByBUser(buserId: string): Promise<BUserDevice> {
    let uriPath = "getByBUser";
    let reqMap = new ReqMap();
    reqMap.add("buserId", buserId);
    return this.buserDeviceDao.findOneWithReqParam(uriPath, reqMap);
  }


  /***
   *
   */
  public lock(iotRecordId,lockForm:MCtrlLockApiForm):Promise<RestResp>{
    let uriPath = "lock/"+iotRecordId;
    return this.buserDeviceDao.rawReq(uriPath,lockForm);
  }

  public bindDevice(bindForm: BindDeviceForm): Promise<BUserDevice> {
    let findPath = "bindDevice";
    return this.buserDeviceDao.addFormByCond(bindForm, findPath);
  }

  public update(id: string, updateForm:BUserDeviceUpdateForm): Promise<boolean> {
    return this.buserDeviceDao.updateWithId(id, updateForm);
  }

}

class BUserDeviceDao extends AsyncRestDao<BUserDevice> {

  constructor(restProxy: AsyncRestProxy) {

    let table: string = "buserDevice";

    super(BUserDevice, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}


