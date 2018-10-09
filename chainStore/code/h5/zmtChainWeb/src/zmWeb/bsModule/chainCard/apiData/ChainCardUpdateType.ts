export enum ChainCardUpdateType {
  AddMembershipCard = 0,
  DelMembershipCard = 1,
  UpdMembershipCard = 2,
  UpdMemberCardState = 3,
  BatchUpdMemberCardState = 4,

  AddProductCard = 5,
  DelProductCard = 6,
  UpdProductCard = 7,
  UpdProductCardState = 8,
  BatchUpdProductCardState = 9,

  AddPrdCardType = 10,
  DelPrdCardType = 11,
  UpdPrdCardType = 12,

  MemberCardAllot = 13,//("会员卡分配到店"),
  MemberCardBatchAllot = 14,//("会员卡批量分配到店"),
  ProductCardAllot = 15,//("次卡分配到店"),
  ProductCardBatchAllot = 16//("次卡批量分配到店"),
}
