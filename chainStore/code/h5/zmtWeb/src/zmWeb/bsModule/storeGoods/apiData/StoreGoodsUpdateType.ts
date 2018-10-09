export enum StoreGoodsUpdateType {
  AddGoods = 0,
  UpdateGoods = 1,
  RemoveGoods = 2,

  UpdateGoodsState = 3,
  BatchUpdateGoodsState = 4,

  AddGoodsType = 5,
  RemoveGoodsType = 6,
  UpdateGoodsType = 7,

  AddGoodsToTop = 8,
  CancelGoodsFromTop = 9,

  AddListFromExcel = 10,
  AddListFromStore = 11,

  PullGoodsFromChain = 12,//("拉取连锁店商品"),
  CancelChainGoods = 13,//("取消获取连锁店商品"),
  BatchPullGoodsFromChain = 14,//("批量拉取连锁店商品"),
  BatchCancelChainGoods = 15,//("批量取消连锁店商品"),
}
