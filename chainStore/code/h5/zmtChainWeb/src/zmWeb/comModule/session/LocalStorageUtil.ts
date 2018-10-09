import {UserData, CurrentChain} from "./SessionData";
import {AppUtils} from "../AppUtils";

export class LocalStorageUtil{

  private static readonly USER_DATA = "userData";
  private static readonly CHAIN_DATA = "chainData";

  /**
   * 清空缓存数据
   */
  public static clearStorage() {
    //保留账号
    let userData:UserData = LocalStorageUtil.getUserData();
    userData.clear();
    LocalStorageUtil.saveUserData(userData);
    localStorage.removeItem(LocalStorageUtil.CHAIN_DATA);
  }

  private static setItem(keyP: string, valueP: any) {
    if (!AppUtils.isNullOrWhiteSpace(keyP) && !AppUtils.isNullOrWhiteSpace(valueP)) {
      let value = AppUtils.toJson(valueP);
      localStorage.setItem(keyP, value);
    } else {
    }
  }
  private static removeItem(keyP:string){
    localStorage.removeItem(keyP);
  }
  private static getItem<T>(keyP: string, tc: new() => T): T {
    if (!AppUtils.isNullOrWhiteSpace(keyP)) {
      let item = localStorage.getItem(keyP);
      return AppUtils.fromJson<T>(tc, item);
    } else {
      return null;
    }
  }


  /**
   * 持久化用户数据
   */
  public static saveUserData(userData: UserData) {
    LocalStorageUtil.setItem(LocalStorageUtil.USER_DATA,userData);
  }

  public static getUserData():UserData{
    let target:UserData = LocalStorageUtil.getItem(LocalStorageUtil.USER_DATA,UserData);
    if(AppUtils.isNullObj(target)){
      target = new UserData();
    }
    return target;
  }

  /**
   * 持久化用户店铺数据
   */
  public static saveCurrentChain(currentChain: CurrentChain) {
    LocalStorageUtil.setItem(LocalStorageUtil.CHAIN_DATA,currentChain);
  }

  public static getCurrentChain():CurrentChain{
    let target:CurrentChain = LocalStorageUtil.getItem(LocalStorageUtil.CHAIN_DATA,CurrentChain);
    if(AppUtils.isNullObj(target)){
      target = new CurrentChain();
    }else if(!AppUtils.isNullObj(target)){
      //要对currentchain做特殊处理，因为json序列化出来的对象是没有方法的
      let curChain:CurrentChain = new CurrentChain();
      AppUtils.copy(curChain,target);
      target = curChain;
    }
    return target;
  }



}
