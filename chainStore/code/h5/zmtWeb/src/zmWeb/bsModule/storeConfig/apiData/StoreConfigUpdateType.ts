export enum StoreConfigUpdateType {
  UpdateBaseAttribute=0,//("设置会员基础属性"),

  AddExpandAttribute=1,//("添加会员扩展属性"),
  SortExpandAttribute=2,//("扩展属性升降操作"),
  UpdateExpandAttribute=3,//("更新扩展属性信息"),
  StatusExpandAttribute=4,//("设置属性启用必填信息"),

  AddLeaguerOrigin=5,//("添加会员来源"),
  RemoveLeaguerOrigin=6,//("删除会员来源"),
  UpdateLeaguerOrigin=7,//("修改会员来源"),

  UpdateLeaguerType=8,//("设置会员类型"),

  UpdateAppointTime=9,//("设置预约时间段"),

  AddCancelReason=10,//("添加取消原因"),
  RemoveCancelReason=11,//("删除取消原因"),
  UpdateCancelReason=12,//("更新取消原因"),

  SaveShareData=13,//("数据权限设置"),

  UpdateLeaguerAnalysis=14,//("会员分析设置"),
}
