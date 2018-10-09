
export enum StoreVipLevelEnum {
  ExperienceUser = 0, //("体验会员"),//会员初始状态为“体验用户”，通过设置变为其它用户，体验时长为1个月
  InnerBetaUser = 1, //("内测会员"),//内测会员，体验时长为1年
  SilverUser = 2, //("白银会员"),
  GoldUser = 3, //("黄金会员"),
  DiamondUser = 4,//("钻石会员"),
  HonKonUser = 5,//("宏强定制会员"),
  StandardUser = 6 //("标准会员"),
}
