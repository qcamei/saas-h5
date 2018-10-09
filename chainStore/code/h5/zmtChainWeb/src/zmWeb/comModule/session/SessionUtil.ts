import {AppRouter} from "../AppRouter";
import {AppUtils} from "../AppUtils";
import {UserData, UserPermData, CurrentChain, SimpleChain, ChainData} from "./SessionData";
import {DataSynCtrl} from "../dataSyn/DataSynCtrl";
import {LocalStorageUtil} from "./LocalStorageUtil";
import {Constants} from "../../views/common/Util/Constants";

export class SessionUtil {
  public static readonly HEADER_ACCESS_TOKEN_NAME = "access_token";
  public static readonly HEADER_BOSS_ID = "validateInfo";

  private static Instance: SessionUtil = new SessionUtil();

  public static getInstance(): SessionUtil {
    return SessionUtil.Instance;
  }

  private _userData:UserData = new UserData();//用户数据
  private _chainData:ChainData = new ChainData();//店铺数据
  private _currentChain:CurrentChain = new CurrentChain();//当前连锁店


  constructor() {
    this.localLoad();
  }

  private localLoad(){
    this._userData = LocalStorageUtil.getUserData();
    this._currentChain = LocalStorageUtil.getCurrentChain();
  }

  private localSave(){
    LocalStorageUtil.saveUserData(this._userData);
    LocalStorageUtil.saveCurrentChain(this._currentChain);
  }

  public getAccount():string{
    return this._userData.getAccount();
  }
  public setAccount(accountP:string){
    this._userData.setAccount(accountP);
    this.localSave();
  }

  public getUserId(): number {
    return this._userData.getUserId();
  }

  public getUserName(): string {
    return this._userData.getUserName();
  }

  public getAccessToken(): string {
    return this._userData.getAccessToken();
  }

  public getVipLevel(): number {
    return this._userData.getVipLevel();
  }

  public setVipLevel(value: number) {
    this._userData.setVipLevel(value);
    this.localSave();
  }


  public getChainId(): string {
    return this.getCurrentChain().getChainId();
  }

  public getChainName(): string {
    return this.getCurrentChain().getChainName();
  }

  public getUserPermData(): UserPermData {
    return this.getCurrentChain().getUserPermData();
  }

  public setUserPermData(value: UserPermData) {
    this.getCurrentChain().setUserPermData(value);
    this.localSave();
  }

  public getBossId(): number {
    return this.getCurrentChain().getBossId();
  }

  public getSimpleChainList(): Array<SimpleChain> {
    return this._chainData.getSimpleChainList();
  }

  public setSimpleChainList(chainList:Array<SimpleChain>) {
    this._chainData.setSimpleChainList(chainList);
  }

  private getCurrentChain():CurrentChain{
    return this._currentChain;
  }

  /**
   * 设置页面依赖的公共数据
   * f5刷新页面 需要取出持久化数据
   */
  public checkUserData(): void {
    let userId = this._userData.getUserId();
    let access_token = this._userData.getAccessToken();
    if (AppUtils.isNullObj(userId) || AppUtils.isNullOrWhiteSpace(access_token)) {
      AppRouter.goLogin();
    }
  }


  /**
   * 清空数据 退出登录调用
   */
  public clearData() {
    LocalStorageUtil.clearStorage();
    this.localLoad();
  }

  public setChainData(chainData: ChainData) {
    this._chainData = chainData;
    this.localSave();
  }

  /**
   * 设置用户数据
   */
  public setUserData(userData: UserData) {
    this._userData = userData;
    this.localSave();
    //设置同步ownerId
    DataSynCtrl.Instance.setOwnerId(this._userData.getUserId().toString());
  }

  /**
   * 设置店铺数据
   */
  public setCurrentChain(currentChain: CurrentChain) {
    this._currentChain = currentChain;
    this.localSave();
  }

}


