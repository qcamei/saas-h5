import {DeviceInfo} from "./DeviceInfo";
export class BUserDevice{
  id: number;
  index: number;
  buserId: number;
  salesman: string;
  phone: string;
  deviceInfoList: Array<DeviceInfo>;
  createTime: number;
  lastUpdateTime: number;
  ver: number;

  constructor() {
  }
}
