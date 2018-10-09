import {DeviceInfo} from "./DeviceInfo";
export class BUserDevice {
  id: number;
  index: number;
  buserId: number;
  deviceInfoList: Array<DeviceInfo>;

  salesman: number; //客户代表
  phone: number;//手机号

  createTime: number;
  lastUpdateTime: number;
  ver: number;

  constructor() {
  }

}
