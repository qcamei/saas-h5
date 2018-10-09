import {Injectable} from '@angular/core';
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {DeviceDetail} from "./data/DeviceDetail";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class DeviceDetailListMgr {

  private deviceDetailDao: DeviceDetailDao;

  constructor(restProxy: AsyncRestProxy) {
    this.deviceDetailDao = new DeviceDetailDao(restProxy);
  }

  public getDeviceList(buserId:string): Promise<Array<DeviceDetail>> {
    let findPath = "getList/"+buserId;
    let pageItemCount = -1;
    let pageNo = -1;
    return this.deviceDetailDao.findList(findPath, pageItemCount, pageNo);
  }



}

class DeviceDetailDao extends AsyncRestDao<DeviceDetail> {

  constructor(restProxy: AsyncRestProxy) {

    let table: string = "deviceDetail";

    super(DeviceDetail, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}


