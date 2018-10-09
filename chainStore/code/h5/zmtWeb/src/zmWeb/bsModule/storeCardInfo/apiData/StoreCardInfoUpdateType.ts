export enum StoreCardInfoUpdateType {

  AddMembershipCard = 0,
  DelMembershipCard = 1,
  UpdMembershipCard = 2,
  UpdateMemberCardState = 3,
  BatchUpdateMemberCardState = 4,

  AddProductCard = 5,
  DelProductCard = 6,
  UpdProductCard = 7,
  UpdateProductCardState = 8,
  BatchUpdateProductCardState = 9,

  AddDiscountCard = 10,
  DelDiscountCard = 11,
  UpdDiscountCard = 12,

  AddMembershipCardList = 13,

  AddPrdCardType = 14,
  DelPrdCardType = 15,
  UpdPrdCardType = 16,

  /*************************连锁店数据同步**************************************/
  PullCardFromChain = 17,//("拉取连锁店次卡"),
  CancelChainCard = 18,//("取消获取连锁店次卡"),
  BatchPullCardFromChain = 19,//("批量拉取连锁店次卡"),
  BatchCancelChainCard = 20,//("批量取消连锁店次卡"),

  PullMemberCardFromChain = 21,//("拉取连锁店会员卡"),
  CancelChainMemberCard = 22,//("取消获取连锁店会员卡"),
  BatchPullMemberCardFromChain = 23,//("批量拉取连锁店会员卡"),
  BatchCancelChainMemberCard = 24,//("批量取消连锁店会员卡"),

  AddPrdCardTop = 25,//("次卡置顶"),
  CancelPrdCardTop = 26,//("取消置顶"),
}
