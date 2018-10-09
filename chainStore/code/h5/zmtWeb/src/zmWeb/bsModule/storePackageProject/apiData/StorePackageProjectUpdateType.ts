export enum StorePackageProjectUpdateType {
  AddPackageProject = 0,
  RemovePackageProject = 1,
  UpdatePackageProject = 2,
  UpdPackageProjectState = 3,
  BatchUpdatePackageProjectState = 4,
  AddPackageProjectType = 5,
  RemovePackageProjectType = 6,
  UpdatePackageProjectType = 7,

  /**********************************同步连锁店数据***************************************/
  PullPackageFromChain = 8,//("拉取连锁店套餐"),
  CancelChainPackage = 9,//("取消获取连锁店套餐"),
  BatchPullPackageFromChain = 10,//("批量拉取连锁店套餐"),
  BatchCancelChainPackage = 11,//("批量取消连锁店套餐"),

  AddPackageProjectTop = 12,//("套餐置顶"),
  CancelPackageProjectTop = 13,//("取消置顶"),
}
