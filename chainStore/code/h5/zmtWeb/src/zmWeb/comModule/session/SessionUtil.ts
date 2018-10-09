import {UserData, StoreData, CurrentStore, UserPermData, SimpleStore, RoleData} from "./SessionData";
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
  private _storeData:StoreData = new StoreData();//店铺数据
  private _roleData:RoleData = new RoleData();//权限数据
  private _reload:boolean = false;//main依赖数据是否已加载过


  constructor() {
    this.localLoad();
  }

  private localLoad(){
    this._userData = LocalStorageUtil.getUserData();
    this._storeData = LocalStorageUtil.getStoreData();
    this._roleData = LocalStorageUtil.getRoleData();
  }

  private localSave(){
    LocalStorageUtil.saveUserData(this._userData);
    LocalStorageUtil.saveStoreData(this._storeData);
    LocalStorageUtil.saveRoleData(this._roleData);
  }

  /**
   * 数据是否已加载
   * @returns {boolean|(()=>boolean)}
   */
  public isReload():boolean{
    return this._reload;
  }

  /**
   * 标记数据加载
   */
  public setReload(reload:boolean){
    this._reload = reload;
  }

  public getVipContent(){
    return this._roleData.getVipContent();
  }

  public getAccount():string{
    return this._userData.getAccount();
  }
  public setAccount(accountP:string){
    this._userData.setAccount(accountP);
    this.localSave();
  }

  public getLoginDate():number{
    return this._userData.getLoginDate();
  }

  public setLoginDate(loginDateP:number){
    this._userData.setLoginDate(loginDateP);
    this.localSave();
  }

  public getUserId(): string {
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

  public setTryOut(isTryOutP:boolean){
    this._userData.setTryOut(isTryOutP);
    this.localSave();
  }

  public isTryOut():boolean{
    return this._userData.isTryOut();
  }

  public getStoreId(): string {
    return this.getCurrentStore().getStoreId();
  }

  public getStoreName(): string {
    return this.getCurrentStore().getStoreName();
  }

  public getSimpleStoreList(): Array<SimpleStore> {
    return this._storeData.getSimpleStoreList();
  }

  public setSimpleStoreList(storeList:Array<SimpleStore>) {
    this._storeData.setSimpleStoreList(storeList);
  }

  public getUserPermData(): UserPermData {
    return this.getCurrentStore().getUserPermData();
  }

  public setUserPermData(value: UserPermData) {
    this.getCurrentStore().setUserPermData(value);
    this.localSave();
  }

  public getIndex(): number {
    return this.getCurrentStore().getIndex();
  }

  public setIndex(value: number) {
    this.getCurrentStore().setIndex(value);
    this.localSave();
  }

  public getBossId(): string {
    return this.getCurrentStore().getBossId();
  }

  private getCurrentStore():CurrentStore{
    return this._storeData.getCurrentStore();
  }

  /**
   * 根据storeId获取storeClerkInfoId
   * @param storeId
   * @returns {string}
   */
  public getIdByStoreId(storeId: string): string {
    return Constants.STORE_CLERKINFO_ID_SUFFFIX + storeId;
  }

  /**
   * 清空数据 退出登录调用
   */
  public clearData() {
    this.setReload(false);
    LocalStorageUtil.clearStorage();
    this.localLoad();
  }

  /**
   * 设置用户数据
   */
  public setUserData(userData: UserData) {
    this._userData = userData;
    this.localSave();
    //设置同步ownerId
    DataSynCtrl.Instance.setOwnerId(this._userData.getUserId());
  }

  /**
   * 设置店铺数据
   */
  public setStoreData(storeData: StoreData) {
    this._storeData = storeData;
    this.localSave();
  }

  /**
   * 设置店铺数据
   */
  public setRoleData(roleData: RoleData) {
    this._roleData = roleData;
    this.localSave();
  }

  /**
   * 连锁店总部id
   * @param chainId
   */
  public getChainId():number{
    return this.getCurrentStore().getChainId();
  }

  /**
   * 设置当前店铺
   * @param currentStore
   */
  public setCurrentStore(currentStore: CurrentStore) {
    this._storeData.setCurrentStore(currentStore);
    this.localSave();
  }

}


