import {LocalStorageUtil} from "./LocalStorageUtil";
import {LocalData, LoginData} from "./SessionData";
import {AppUtils} from "../AppUtils";
import {LoginResp} from "../../bsModule/cuser/apiData/LoginResp";
import {CUser} from "../../bsModule/cuser/data/CUser";
import {Store} from "../../bsModule/store/data/Store";
// import {StoreMgr} from "../../bsModule/store/StoreMgr";
import {StoreMonitor} from "./StoreMonitor";
import {StoreCacheMgr} from "../../bsModule/store/StoreCacheMgr";
import {Constants} from "../../views/zmComUtils/Constants";
import {AppRouter} from "../../views/zmComUtils/AppRouter";
import {DataSynCtrl} from "../dataSyn/DataSynCtrl";
import {DataDetailCacheMgr} from "../dataDetail/DataDetailCacheMgr";

export class SessionUtil {

  public static readonly HEADER_ACCESS_TOKEN_NAME = "access_token";
  public static readonly HEADER_ACCESS_VALIDATE_INFO = "validateInfo";

  public static readonly SCENE_STORE_ID = "sceneStoreId";
  public static readonly JS_CODE = "jsCode";
  public static readonly SCENE_MINI_APP_ID = "sceneMiniAppId";

  private static Instance: SessionUtil = new SessionUtil();

  public static getInstance(): SessionUtil {
    return SessionUtil.Instance;
  }

  private _loginData:LoginData = new LoginData();//登陆数据
  private _localData:LocalData = new LocalData();//本地持久化数据
  // private _mainData:MainData = new MainData();

  constructor() {
    this.localLoad();
  }

  private localLoad(){
    this._localData = LocalStorageUtil.getLocalData();
    this._loginData = this._localData.loginData;
    //直接本地load 出来的对象是没有自定义方法的，所以要处理一下
    if(AppUtils.isNullObj(this._loginData) && AppUtils.isNullObj(this._loginData.cuser)){
      let cuser:CUser = new CUser;
      AppUtils.copy(cuser,this._loginData.cuser);
    }
  }

  private localSave(){
    LocalStorageUtil.saveLocalData(this._localData);
  }

  private saveLoginDataToLocal(){
    this._localData = LocalStorageUtil.getLocalData();
    this._localData.loginData = this.loginData;
    this.localSave();
  }

  set localData(value: LocalData) {
    this._localData = value;
    this.localSave();
  }

  get loginData(): LoginData {
    return this._loginData;
  }

  set loginData(value: LoginData) {
    this._loginData = value;
  }

  public getLoginCUser():CUser{
    return this._loginData.cuser;
  }

  public getLoginCUserId():string{
    return this._loginData.cuser.id;
  }

  public isLogin():boolean{
    return !AppUtils.isNullObj(this._loginData.accessToken);
  }

  /**
   * 清空本地持久化数据
   */
  private clearData() {
    LocalStorageUtil.clearStorage();
    this.localLoad();
  }

  /**
   * 退出登录时的相关处理
   */
  public onLogout(){
    this.clearData(); //清空本地持久化数据
    DataSynCtrl.Instance.clear();//清空同步数据
    DataDetailCacheMgr.getInstance().clear();//清空缓存数据
    AppRouter.getInstance().goLogin();
  }

  /**
   * 登录成功时的相关处理
   * @param {LoginResp} loginResp
   */
  public onLoginSuccess(loginResp:LoginResp){
    this._loginData.cuser = loginResp.cuser;
    this._loginData.curStoreId = this.getCurStoreIdFromCUser(loginResp.cuser);
    this._loginData.accessToken = loginResp.token;
    this.saveLoginDataToLocal();//保存到本地
  }

  private getCurStoreIdFromCUser(cuser:CUser):string{
    let target = null;
    let storeIdList = cuser.storeIdSet;
    if(!AppUtils.isNullObj(storeIdList) && storeIdList.length > 0 ){
      target = storeIdList[0];
    }
    return target;
  }

  public getAccessToken():string{
    return this._loginData.accessToken;
  }

  public async switchStore(storeId:string){
    this.loginData.curStoreId = storeId;
    this.saveLoginDataToLocal();
    StoreMonitor.getInstance().notify();
    AppRouter.getInstance().goMain();
  }

  public getCurStoreId():string{
    let curStoreId = this.loginData.curStoreId; //内存中获取
    if(AppUtils.isNullOrWhiteSpace(curStoreId)){
      this.localLoad(); //本地获取
      curStoreId = this.loginData.curStoreId;
    }
    return curStoreId;
  }

  public async getCurStore():Promise<Store>{
    let curStoreId = this.getCurStoreId();
    if(AppUtils.isNullOrWhiteSpace(curStoreId)) {
      return null;
    }
    //获取store
    // let curStore = await StoreMgr.getInstance().getStore(curStoreId);
    let curStore = await StoreCacheMgr.getInstance().get(curStoreId);
    return curStore;
  }

  public getStoreIdsFromCache(){
    let storeIds = new Array();
    //获取cuser中的storeId
    let cuserStoreIds = this.getLoginCUser().storeIdSet;
    if(AppUtils.isNotNullObjs(cuserStoreIds)){
      cuserStoreIds.forEach((storeId)=>{
        storeIds.push(storeId);
      });
    }
    //获取店铺列表中的storeId
    let storeList: Array<Store> = StoreCacheMgr.getInstance().getListFromCache();
     storeList.forEach((item)=>{
       storeIds.push(item.id);
     });
    //合并去重
    storeIds = AppUtils.uniquelize(storeIds);
    return storeIds;
  }

  /**
   * 根据storeId获取storeClerkInfoId
   * @param storeId
   * @returns {string}
   */
  public getStoreClerkInfoIdByStoreId(storeId: string): string {
    return Constants.STORE_CLERKINFO_ID_SUFFFIX + storeId;
  }

  /**
   * 获取webview传来的storeId
   * @returns {string}
   */
  public getSceneStoreId():string{
    return localStorage.getItem(SessionUtil.SCENE_STORE_ID);
  }

  /**
   * 清除webview传来的storeId
   */
  public removeSceneStoreId(){
    localStorage.removeItem(SessionUtil.SCENE_STORE_ID);
  }

  /**
   * 获取webview传来的jsCode
   * @returns {string}
   */
  public getJsCode():string{
    return localStorage.getItem(SessionUtil.JS_CODE);
  }


  /**
   * 获取webveiw传来的miniAppId, 小程序定制化时会用到
   * @returns {string}
   */
  public getSceneMiniAppId():string{
    return localStorage.getItem(SessionUtil.SCENE_MINI_APP_ID);
  }

  /**
   * 当前用户的openId
   */
  private _openId:string;
  public setOpenId(openId:string){
    this._openId = openId;
  }
  public getOpenId():string{
    return this._openId;
  }

}


