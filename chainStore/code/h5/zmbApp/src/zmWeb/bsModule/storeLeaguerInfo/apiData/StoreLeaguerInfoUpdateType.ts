export enum StoreLeaguerInfoUpdateType {
  UpdateLeaguerInfo = 0,//("修改店铺会员")
  AddLeaguerInfo = 1,//("新增店铺会员")
  AddLeaguerInfoList = 2,//("批量新增会员")
  AddAttention = 3,//("添加标星店铺会员")
  RemoveAttention = 4,//("移除标星店铺会员")
  DelLeaguer = 5,//("删除会员")
  UpdateMemberCard = 6, //("设置会员卡")
  RechargeMemberCard = 7, //("会员卡充值")
  PurchaseProductCard = 8,//("购买耗卡")
  ReduceProductCardCount = 9, //("更新次卡使用次数")
  AddListFromStore = 10,//("从店铺批量新增店铺会员")
  AddListFromExcel = 11,//("从Excel批量新增店铺会员")
  AddListOfLeaguerIds = 12,//("通过id列表批量新增会员"),
  AddLeaguerLabel=13,//("添加标签"),
  RemoveLeaguerLabel=14,//("删除标签"),
  UpdateLeaguerLabel=15,//("编辑标签"),
  AddLeaguerLabelList=16,//("批量添加标签"),

}
