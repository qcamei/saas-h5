export enum MClientCtrlStateEnum {
  Poweroff=0,//("已关机"),
  Poweron=1,//("已开机"),
  RequestingData=2,//("请求数据中"),
  Standby=3,//("待机中"),
  Readying=4,//("准备中"),
  Working=5,//("工作中"),
  Locked=6,//("已锁定"),
  LockedBySupplier=7,//("被厂家锁定")
}
