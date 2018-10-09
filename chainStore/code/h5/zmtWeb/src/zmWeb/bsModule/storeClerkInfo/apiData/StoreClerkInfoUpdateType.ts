export enum StoreClerkInfoUpdateType {
  AddStoreAdminRole = 0,//添加岗位
  UpdateStoreAdminRole = 1,//更新角色/岗位信息
  ApplyClerk = 2,//员工申请
  HandleApplyClerk = 3,//处理员工申请
  AddClerk = 4,//添加员工
  ReomveRoleOfClerk = 5,//移除员工角色
  AddRoleSet2Clerk = 6,//赋予员工角色 设置多个角色覆盖更新
  ReomveClerk = 7,//移除员工
  SetMonthPayDays = 8,//设置店铺工资月结天数
  HandleGroupApplyClerk = 9,//("批量审核员工"),//批量审核员工
}
