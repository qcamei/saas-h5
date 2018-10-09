export enum ChainClerkUpdateType {
  AddAdminRole = 0,
  UpdateAdminRole = 1,
  RemoveAdminRole = 2,

  AddClerk = 3,
  ReomveClerk = 4,

  SaveRoleSet2Clerk = 5,//("赋予员工角色"),
  UpdateClerk = 6,

  AllotStore = 7,//("分配到店"),
  BatchAllotStore = 8 //("批量分配到店"),
}
