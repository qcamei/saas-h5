export class BUser {

  id: string;
  name: string;
  phone: string;
  password: string;
  headImg: string;
  gender: number;
  age: number;
  salt: string;
  storeIdSet: Array<string>;
  createdTime: string;
  lastUpdateTime: string;
  ver: number;
  state: number;
  roleSet: Array<number>;

  vipType:number;//会员等级
  expiredTime:number;//会员到期时间
  businessPhone:number;//商务手机

  constructor() {

  }

}












