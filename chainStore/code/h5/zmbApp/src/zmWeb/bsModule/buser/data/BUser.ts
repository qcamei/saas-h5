export class BUser {

  id: string;
  areaCode:string;//手机号码区号
  name: string;
  phone: string;
  password: string;
  headImg: string;
  gender: number;
  age: number;
  salt: string;
  storeIdSet: Array<string>;
  chainIds:Array<number>;// 用户关联的连锁店id列表
  origin:number;//来源 对应 BuserOriginEnum
  createdTime: string;
  lastUpdateTime: string;
  ver: number;
  state: number;
  roleSet: Array<number>;

  vipType:number;//会员类型
  expiredTime:number;//会员到期时间
  businessPhone:number;//商务手机

  constructor() {

  }

}












