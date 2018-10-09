import {LocalData} from "./SessionData";
import {AppUtils} from "../AppUtils";

export class LocalStorageUtil{

  private static readonly LOCAL_DATA = "zm_local_data";
  /**
   * 清空缓存数据
   */
  public static clearStorage() {
    localStorage.removeItem(LocalStorageUtil.LOCAL_DATA);
  }

  public static setItem(keyP: string, valueP: any) {
    if (!AppUtils.isNullOrWhiteSpace(keyP) && !AppUtils.isNullOrWhiteSpace(valueP)) {
      let value = AppUtils.toJson(valueP);
      localStorage.setItem(keyP, value);
    } else {
    }
  }

  public static removeItem(keyP:string){
    localStorage.removeItem(keyP);
  }

  public static getItem<T>(keyP: string, tc: new() => T): T {
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
  public static saveLocalData(localData: LocalData) {
    LocalStorageUtil.setItem(LocalStorageUtil.LOCAL_DATA,localData);
  }

  public static getLocalData():LocalData{
    let target:LocalData = LocalStorageUtil.getItem(LocalStorageUtil.LOCAL_DATA,LocalData);
    if(AppUtils.isNullObj(target)){
      return new LocalData();
    }
    return target;
  }

}
