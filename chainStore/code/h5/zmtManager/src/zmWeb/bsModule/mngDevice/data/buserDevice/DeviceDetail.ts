export class DeviceDetail {

  id: number;

  iotRecordId: number//设备后台记录ID;

  buserId: string;

  storeId: number;
  storeName:string;

  //设备id
  clientId: string;
  //设备系列号
  mseriesId: string;
  //设备系列名称(预留，不存值)
  mseriesName: string;
  //设备型号id
  mtypeId: string;
  //设备型号名称(预留，不存值)
  mtypeName: string;
  //SN
  snCode: string;
  //IMSI码
  private String
  imsiCode: string;
  //密钥
  secretKey: string;

  //绑定系统 MClientBandingSystemEnum
  bandingSystem: number;

  //绑定账户
  bandingAccount: string;

  //联网状态 MClientStatusEnum
  status: number;
  //控制状态 MClientCtrlStateEnum
  ctrlState: number;
  //锁定状态 MClientLockStateEnum
  lockState: number;

  //绑定时间
  bandingTime: number;

  constructor() {
  }
}
