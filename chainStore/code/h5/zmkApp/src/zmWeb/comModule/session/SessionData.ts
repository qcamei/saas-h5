import {CUser} from "../../bsModule/cuser/data/CUser";
import {Store} from "../../bsModule/store/data/Store";

export class LocalData{
  //保存的登陆信息 f5要用到，退出登录的时候才清空
  loginData:LoginData = new LoginData();

}

export class LoginData{
  accessToken:string;
  cuser: CUser; //当前登陆用户
  curStoreId: string; //当前店铺
}

export class MainData{
  curStore: Store = null; //当前店铺
  storeList:Array<Store> = null; //店铺列表
  cuser:CUser = null; //当前用户
}
