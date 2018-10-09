import {AppRouter} from "./AppRouter";
import {AppUtils} from "./AppUtils";
import {UserData} from "./UserData";

export class SessionUtil {

  public static Instance: SessionUtil;

  public readonly HEADER_ACCESS_TOKEN_NAME = "access_token";
  public readonly OPUSER_ID = "opuser_id";
  public readonly OPUSER_NAME = "opuser_name";

  private serviceAddress:string;
  private imgPreUrl:string;

  private _opuserId: number;
  private _opuserName: string;
  private _accessToken: string;

  constructor() {

  }

  public static getInstance(): SessionUtil {
    if (AppUtils.isNullObj(SessionUtil.Instance)) {
      SessionUtil.Instance = new SessionUtil();
    }
    return SessionUtil.Instance;
  }


  public getOPUserId(): number {
    return this._opuserId;
  }

  public getOPUserName(): string {
    return this._opuserName;
  }


  public getAccessToken() {
    return this._accessToken;
  }

  public getServiceAddress() {
    return this.serviceAddress;
  }

  public setServiceAddress(serviceAddress: string) {
    this.serviceAddress = serviceAddress;
  }

  public  getImgPreUrl() {
    return this.imgPreUrl;
  }

  public  setImgPreUrl(imgPreUrl: string) {
    this.imgPreUrl = imgPreUrl;
  }


  /**
   * 检查设置页面依赖的公共数据
   */
  public checkUserData(): void {
    //f5刷新页面 需要取出持久化数据
    let opuserId = localStorage.getItem(this.OPUSER_ID);
    let access_token = localStorage.getItem(this.HEADER_ACCESS_TOKEN_NAME);
    if (AppUtils.isNullOrWhiteSpace(opuserId) || AppUtils.isNullOrWhiteSpace(access_token)) {
      AppRouter.goLogin();
    } else {
      this._opuserId = parseInt(opuserId);
      this._opuserName = localStorage.getItem(this.OPUSER_NAME);
      this._accessToken = access_token;
    }
  }

  /**
   * 清空数据 退出登录调用
   */
  public clearData() {
    this._accessToken = null;
    this._opuserId = null;
    this._opuserName = null;
    localStorage.removeItem(this.OPUSER_ID);
    localStorage.removeItem(this.OPUSER_NAME);
    localStorage.removeItem(this.HEADER_ACCESS_TOKEN_NAME);
  }

  /**
   * 记住账号
   */
  public setName(valueP: string) {
    localStorage.setItem("name", valueP);
  }

  public getName() {
    return localStorage.getItem("name");
  }

  /**
   * 持久化数据 使用localStorage存储 只保存公共依赖数据 例如：用户信息buser 店铺信息store
   * @param keyP
   * @param valueP
   */
  public setItem(keyP: string, valueP: any) {
    if (!AppUtils.isNullOrWhiteSpace(keyP) && !AppUtils.isNullOrWhiteSpace(valueP)) {
      let value = AppUtils.toJson(valueP);
      localStorage.setItem(keyP, value);
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
  public getItem<T>(keyP: string, tc: new() => T): T {
    if (!AppUtils.isNullOrWhiteSpace(keyP)) {
      let item = localStorage.getItem(keyP);
      return AppUtils.fromJson<T>(tc, item);
    } else {
      return null;
    }
  }

  /**
   * 设置用户数据
   */
  public setUserData(userData: UserData) {
    this._opuserId = userData.getOPUserId();
    this._opuserName = userData.getOPUserName();
    this._accessToken = userData.getAccessToken();
    this.saveUserData(userData);
  }

  /**
   * 持久化用户数据
   */
  private saveUserData(userData: UserData) {
    localStorage.setItem(this.HEADER_ACCESS_TOKEN_NAME, userData.getAccessToken());
    localStorage.setItem(this.OPUSER_ID, userData.getOPUserId()+"");
    localStorage.setItem(this.OPUSER_NAME, userData.getOPUserName()+"");
  }

}


