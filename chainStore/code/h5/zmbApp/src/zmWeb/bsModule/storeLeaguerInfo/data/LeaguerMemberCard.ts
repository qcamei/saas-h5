
export class LeaguerMemberCard{
  cardId:string;//会员卡类型id 对应membershipCard id
  number:string;//会员卡编号
  balance:number = 0.0;//账户余额
  limitTime:number;//有效期 单位为天 eg：365天/1年
  limitUnit:number;//有效期时间的单位 对应LimitUnitEnum
  endTime:string;//到期时间
  state:number;//会员卡状态 对应MemberCardStateEnum
  settingTime:string;//设置会员卡的时间 每次设置都会刷新
  createdTime:string;//创建时间
}
