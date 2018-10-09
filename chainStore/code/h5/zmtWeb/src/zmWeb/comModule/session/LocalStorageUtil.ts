import {StoreData, UserData, CurrentStore, RoleData} from "./SessionData";
import {AppUtils} from "../AppUtils";

export class LocalStorageUtil{

  private static readonly USER_DATA = "userData";
  private static readonly STORE_DATA = "storeData";
  private static readonly ROLE_DATA = "roleData";

  /**
   * 清空缓存数据
   */
  public static clearStorage() {
    //保留账号
    let userData:UserData = LocalStorageUtil.getUserData();
    userData.clear();
    LocalStorageUtil.saveUserData(userData);
    localStorage.removeItem(LocalStorageUtil.STORE_DATA);
    localStorage.removeItem(LocalStorageUtil.ROLE_DATA);
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
  public static saveStoreData(storeData: StoreData) {
    LocalStorageUtil.setItem(LocalStorageUtil.STORE_DATA,storeData);
  }

  public static getStoreData():StoreData{
    let target:StoreData = LocalStorageUtil.getItem(LocalStorageUtil.STORE_DATA,StoreData);
    if(AppUtils.isNullObj(target)){
      target = new StoreData();
    }else if(!AppUtils.isNullObj(target.getCurrentStore())){
      //要对currentstore做特殊处理，因为json序列化出来的对象是没有方法的
      let curStore:CurrentStore = new CurrentStore();
      AppUtils.copy(curStore,target.getCurrentStore());
      target.setCurrentStore(curStore);
    }
    return target;
  }


  /**
   * 持久化用户权限数据
   */
  public static saveRoleData(roleData: RoleData) {
    LocalStorageUtil.setItem(LocalStorageUtil.ROLE_DATA,roleData);
  }

  public static getRoleData():RoleData{
    let target:RoleData = LocalStorageUtil.getItem(LocalStorageUtil.ROLE_DATA,RoleData);
    if(AppUtils.isNullObj(target)){
      target = new RoleData();
    }
    return target;
  }


}
