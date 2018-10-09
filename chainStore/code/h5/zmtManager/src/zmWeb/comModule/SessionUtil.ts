
import {AppRouter} from "./AppRouter";
import {AppUtils} from "./AppUtils";
import {SimpleStore, UserPermData, UserData, StoreData} from "./UserData";
import {Store} from "../bsModule/store/apiData/Store";
import {HostConfig} from "./HostConfig";
import {Constants} from "../views/common/Util/Constants";
import {DataSynCtrl} from "./dataSyn/DataSynCtrl";
import {AppCfg} from "./AppCfg";

export class SessionUtil {

  public static Instance: SessionUtil;

  public readonly HEADER_ACCESS_TOKEN_NAME = "access_token";
  public readonly USER_ID = "user_id";
  public readonly USER_NAME = "user_name";
  public readonly STORE_ID = "store_id";
  public readonly STORE_NAME = "store_name";
  public readonly STORE_LIST = "store_list";
  public readonly STORE_CLERKINFO_ID_SUFFFIX = "_sci";

  public static getInstance(): SessionUtil {
    if (AppUtils.isNullObj(SessionUtil.Instance)) {
      SessionUtil.Instance = new SessionUtil();
    }
    return SessionUtil.Instance;
  }

  public static isAuth: boolean = true;//是否需要登录   测试时需设置为true

  private _userId: string;
  private _userName: string;
  private _accessToken: string;
  private _storeId: string;
  private _storeName: string;
  private _simpleStoreList: Array<SimpleStore>;

  private _isExpired: boolean;//是否过期
  //用户对应权限
  private _userPermData: UserPermData = new UserPermData();
  private _index:number = 0;

  //服务地址
  // private imgPreUrl;
  // private serviceAddress;

  constructor() {
    // this.serviceAddress = HostConfig.serviceAddress;
    // this.imgPreUrl = HostConfig.imgPreUrl;
  }

  public getIndex(): number {
    return this._index;
  }

  public setIndex(index:number) {
    this._index = index;
  }

  public getUserId(): string {
    return this._userId;
  }

  public getUserName(): string {
    return this._userName;
  }

  public getStoreId(): string {
    return this._storeId;
  }

  public getStoreName(): string {
    return this._storeName;
  }

  public getSimpleStoreList(): Array<SimpleStore> {
    return this._simpleStoreList;
  }

  public getAccessToken() {
    return this._accessToken;
  }

  public getIsExpired(): boolean {
    return this._isExpired;
  }

  public getServiceAddress() {
    // return this.serviceAddress;
    return AppCfg.getInstance().getServiceAddress();
  }

  public setServiceAddress(serviceAddress: string) {
    // this.serviceAddress = serviceAddress;
  }

  public  getImgPreUrl() {
    // return this.imgPreUrl;
    return AppCfg.getInstance().getImgPreUrl();
  }

  public  setImgPreUrl(imgPreUrl: string) {
    // this.imgPreUrl = imgPreUrl;
  }

  public getUserPermData() {
    return this._userPermData;
  }

  public setUserPermData(value: UserPermData) {
    this._userPermData = value;
  }

  public setIsExpired(value: boolean) {
    this._isExpired = value;
  }

  public getIdByStoreId(storeId: string): string {
    return this.STORE_CLERKINFO_ID_SUFFFIX + storeId;
  }




  /**
   * 检查设置页面依赖的公共数据
   */
  public checkUserData(): void {
    //f5刷新页面 需要取出持久化数据
    let userId = localStorage.getItem(this.USER_ID);
    let access_token = localStorage.getItem(this.HEADER_ACCESS_TOKEN_NAME);
    if (AppUtils.isNullOrWhiteSpace(userId) || AppUtils.isNullOrWhiteSpace(access_token)) {
      AppRouter.goLogin();
    } else {
      this._userId = userId;
      this._userName = localStorage.getItem(this.USER_NAME);
      this._accessToken = access_token;
      this._storeId = localStorage.getItem(this.STORE_ID);
      this._storeName = localStorage.getItem(this.STORE_NAME);
      let storeListJson = localStorage.getItem(this.STORE_LIST);
      if (!AppUtils.isNullOrWhiteSpace(storeListJson)) {
        let storeList = AppUtils.fromJsonToList<SimpleStore>(SimpleStore, storeListJson);
        this._simpleStoreList = storeList;
      }
    }
  }

  /**
   * 清空数据 退出登录调用
   */
  public clearData() {
    this._storeId = null;
    this._storeName = null;
    this._simpleStoreList = null;
    this._accessToken = null;
    this._userId = null;
    this._userName = null;
    localStorage.removeItem(this.USER_ID);
    localStorage.removeItem(this.USER_NAME);
    localStorage.removeItem(this.HEADER_ACCESS_TOKEN_NAME);
    localStorage.removeItem(this.STORE_ID);
    localStorage.removeItem(this.STORE_NAME);
    localStorage.removeItem(this.STORE_LIST);
    this.setIndex(0);
    if(this.getPhone() == Constants.EXPERIENCE_PHONE){
      localStorage.removeItem("phone");
    }
    localStorage.removeItem(Constants.ISEXPERIENCE)
  }

  /**
   * 记住账号
   */
  public setPhone(valueP: string) {
    localStorage.setItem("phone", valueP);
  }

  public getPhone() {
    return localStorage.getItem("phone");
  }

  /**
   * 持久化数据 使用localStorage存储 只保存公共依赖数据 例如：用户信息buser 店铺信息store
   * @param keyP
   * @param valueP
   */
  public static setItem(keyP: string, valueP: any) {
    if (!AppUtils.isNullOrWhiteSpace(keyP) && !AppUtils.isNullOrWhiteSpace(valueP)) {
      let value = AppUtils.toJson(valueP);
      localStorage.setItem(keyP, value);
      console.log("localStorage: save " + keyP);
    } else {
      console.log("save key or value is null");
    }
  }

  /**
   * 从localStorage取出缓存数据
   * @param keyP
   * @param tc
   * @returns {any}
   */
  public static getItem<T>(keyP: string, tc: new() => T): T {
    if (!AppUtils.isNullOrWhiteSpace(keyP)) {
      let item = localStorage.getItem(keyP);
      console.log("getData : " + keyP);
      return AppUtils.fromJson<T>(tc, item);
    } else {
      console.log("keyP is null");
      return null;
    }
  }

  /**
   * 从localStorage取出缓存数据
   * @param keyP
   * @returns {any}
   */
  public static getItemOrigin(keyP: string): string {
    return localStorage.getItem(keyP);
  }

  /**
   * 删除指定缓存项
   * @param keyP
   */
  public static removeItem(keyP:string){
    localStorage.removeItem(keyP);
  }


  public setStoreListP(keyP: string, listP: Array<Store>) {
    for (let index in listP) {
      let store = listP[index];
      SessionUtil.setItem(store.id, store);
    }
  }




  /**
   * 设置用户数据
   */
  public setUserData(userData: UserData) {
    this._userId = userData.getUserId();
    this._userName = userData.getUserName();
    this._accessToken = userData.getAccessToken();
    this.saveUserData(userData);
    //设置同步ownerId
    DataSynCtrl.Instance.setOwnerId(this._userId);
  }

  /**
   * 持久化用户数据
   */
  private saveUserData(userData: UserData) {
    localStorage.setItem(this.HEADER_ACCESS_TOKEN_NAME, userData.getAccessToken());
    localStorage.setItem(this.USER_ID, userData.getUserId());
    localStorage.setItem(this.USER_NAME, userData.getUserName());
  }

  /**
   * 设置店铺数据
   */
  public setStoreData(storeData: StoreData) {
    this._storeId = storeData.getStoreId();
    this._storeName = storeData.getStoreName();
    this._simpleStoreList = storeData.getSimpleStoreList();
    this.persistenceStoreData(storeData);
  }

  /**
   * 持久化用户店铺数据
   */
  private persistenceStoreData(storeData: StoreData) {
    localStorage.setItem(SessionUtil.getInstance().STORE_ID, storeData.getStoreId());
    localStorage.setItem(SessionUtil.getInstance().STORE_NAME, storeData.getStoreName());
    let storeArrJson = AppUtils.toJson(storeData.getSimpleStoreList());
    localStorage.setItem(SessionUtil.getInstance().STORE_LIST, storeArrJson);
  }

  /**
   * 初始化环境配置
   */
  public static initEnv() {
    SessionUtil.removeItem(Constants.ISEXPERIENCE);
    AppCfg.getInstance().setEnv("");
    AppCfg.getInstance().initEnv();
  }

  /**
   * 切换到体验环境
   */
  public static switchToExperienceEnv() {
    AppCfg.getInstance().setEnv(Constants.EXPERIENCE);
    AppCfg.getInstance().initEnv();
    SessionUtil.setItem(Constants.ISEXPERIENCE,"true");
  }


}


