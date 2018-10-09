export class MClient {

  id:number;
  //设备id
  clientId:string;
  //设备系列号
  mseriesId:string;
  //设备系列名称(预留，不存值)
  mseriesName:string;
  //设备型号id
  mtypeId:string;
  //设备型号名称(预留，不存值)
  mtypeName:string;
  //SN
  snCode:string;
  //IMSI码
  imsiCode:string;
  //密钥
  secretKey:string;
  //绑定系统 MClientBandingSystemEnum
  bandingSystem:number;
  //绑定账户
  bandingAccount:string;

  //是否激活(绑定就是激活) MClientIsActivatedEnum
  isActivated:number;
  //定位信息
  location:string;
  //定位经纬度
  locationGps:string;
  //定位地图url
  locationUrl:string;

  //联网状态 MClientStatusEnum
  status:number;
  //控制状态 MClientCtrlStateEnum
  ctrlState:number;
  //锁定状态 MClientLockStateEnum
  lockState: number;

  //绑定时间
  bandingTime:number;
  //创建时间
  createdTime:number;
  //最后修改时间
  lastUpdateTime:number;
  //版本
  ver:number;
}
