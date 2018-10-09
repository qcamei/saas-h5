import {VipContent} from "../../bsModule/buserRole/data/VipContent";
import {Store} from "../../bsModule/store/apiData/Store";
export class UserData{

  //保存的登陆账号
  private _account:string;
  //保存登录时间
  private _loginDate:number;
  //是否体验账号
  private _tryOut:boolean = false;
  private _userId:string;
  private _userName:string;
  private _accessToken:string;
  private _vipLevel: number = -1;//会员等级

  public static newInstance(userIdP:string,userNameP:string):UserData{
    let userData = new UserData();
    userData._userId = userIdP;
    userData._userName = userNameP;
    return userData;
  }

  public clear():void{
    //account 要保留
    this._tryOut = false;
    this._userId = null;
    this._userName=null;
    this._accessToken=null;
    this._vipLevel = -1;//会员等级
  }

  public getAccount(): string {
    return this._account;
  }

  public setAccount(value: string) {
    this._account = value;
  }


  public getLoginDate(): number {
    return this._loginDate;
  }

  public setLoginDate(value: number) {
    this._loginDate = value;
  }

  public setTryOut(isTryOutP:boolean){
    this._tryOut = isTryOutP;
  }

  public isTryOut():boolean{
    return this._tryOut;
  }

  public setUserId(value: string) {
    this._userId = value;
  }

  public setUserName(value: string) {
    this._userName = value;
  }

  public setAccessToken(value: string) {
    this._accessToken = value;
  }

  public getUserId(): string {
    return this._userId;
  }

  public getUserName(): string {
    return this._userName;
  }

  public getAccessToken(): string {
    return this._accessToken;
  }

  public getVipLevel(): number {
    return this._vipLevel;
  }

  public setVipLevel(value: number) {
    this._vipLevel = value;
  }
}

export class StoreData{
  private _currentStore:CurrentStore = new CurrentStore();//当前店铺数据
  private _simpleStoreList:Array<SimpleStore> = new Array<SimpleStore>();//店铺列表

  public static newInstance():StoreData{
    return new StoreData();
  }

  public getCurrentStore(): CurrentStore {
    return this._currentStore;
  }

  public setCurrentStore(value: CurrentStore) {
    this._currentStore = value;
  }

  public getSimpleStoreList(): Array<SimpleStore> {
    return this._simpleStoreList;
  }

  public setSimpleStoreList(value: Array<SimpleStore>) {
    this._simpleStoreList = value;
  }
}

export class CurrentStore{
  private _storeId:string;
  private _storeName:string;
  private _bossId:string;//店铺老板id
  private _chainId:number;//连锁店总部id
  private _userPermData: UserPermData = new UserPermData();//用户对应权限
  private _index:number = 0;//使用引导当前引导下标

  public static newInstance(store:Store,userPermData?:UserPermData,index?:number):CurrentStore{
    let currentStore = new CurrentStore();
    currentStore._storeId = store.id;
    currentStore._storeName = store.name;
    currentStore._bossId = store.bossId;
    currentStore._chainId = store.chainIds&&store.chainIds[0]?store.chainIds[0]:undefined;
    currentStore._userPermData = userPermData?userPermData:currentStore._userPermData;
    currentStore._index = index?index:currentStore._index;
    return currentStore;
  }

  public static newInstance4Web(storeId:string):CurrentStore{
    let currentStore = new CurrentStore();
    currentStore._storeId = storeId;
    return currentStore;
  }

  public getStoreId(): string {
    return this._storeId;
  }

  public getStoreName(): string {
    return this._storeName;
  }

  public getBossId(): string {
    return this._bossId;
  }

  public getChainId(): number {
    return this._chainId;
  }

  public getUserPermData(): UserPermData {
    return this._userPermData;
  }

  public setUserPermData(value: UserPermData) {
    this._userPermData = value;
  }

  public getIndex(): number {
    return this._index;
  }

  public setIndex(value: number) {
    this._index = value;
  }

}

export class RoleData{
  constructor(){}

  bossId:string;
  vipContent:VipContent;

  public static newInstance(bossIdP:string,vipContentP:VipContent):RoleData{
    let roleData = new RoleData();
    roleData.bossId = bossIdP;
    roleData.vipContent = vipContentP;
    return roleData;
  }

  public getBossId(){
    return this.bossId;
  }

  public setBossId(value:string){
    this.bossId = value;
  }

  public getVipContent(){
    return this.vipContent;
  }

  public setVipContent(value:VipContent){
    this.vipContent = value;
  }
}


//用户对应的模块权限
export class UserPermData{
  //对应各模块
  isClerkAdmin: boolean = false;//店铺管理
  isProductAdmin: boolean = false;//项目管理
  isAppointmentAdmin: boolean = false;//预约管理
  isSalaryAdmin: boolean = false;//工资管理
  isLeaguerAdmin: boolean = false;//会员管理
  isOrderAdmin: boolean = false;//订单管理
  isCashierAdmin: boolean = false;//收银管理
  isMaterialAdmin: boolean = false;//耗材管理
  isReportAdmin: boolean = false;//报表管理
  isCardAdmin: boolean = false;//卡包管理
  isGoodsAdmin: boolean = false;//商品管理
  isBonusAdmin: boolean = false;//提成管理
  isPurchaseAdmin: boolean = false;//开单收银
  isRechargeAdmin: boolean = false;//会员充值
  isDeviceAdmin: boolean = false;//仪器管理
  isArrearageAdmin: boolean = false;//欠款管理
  isPhoneAdmin: boolean = false;//会员电话可见
  isPackageAdmin:boolean = false;//套餐管理
  isSynDataAdmin:boolean = false;//数据获取
  isIncomePayAdmin:boolean = false;//收入支出
  isStoreConfigAdmin:boolean = false;//管理设置
  isDaySnapshotAdmin:boolean = false;//交班日结
  isOplogAdmin:boolean = false;//操作日志
  showSynData:boolean = false;//是否显示数据获取
  isBoss: boolean = false;//老板标志
  roleEnum:number = 2;//角色
}

export class SimpleStore{
  public id:string;
  public name:string;
  public bossId:string;
  private constructor(){}
  public static newInstance(storeIdP:string,storeNameP:string,bossIdP:string):SimpleStore{
    let simpleStore = new SimpleStore();
    simpleStore.id = storeIdP;
    simpleStore.name = storeNameP;
    simpleStore.bossId = bossIdP;
    return simpleStore;
  }
}
