import {ChainUserRoleEnum} from "../../bsModule/chainUser/data/ChainUserRoleEnum";
export class UserData{

  //保存的登陆账号
  private _account:string;
  private _userId:number;
  private _userName:string;
  private _accessToken:string;
  private _vipLevel: number = -1;//会员等级


  public static newInstance(userIdP:number,userNameP:string):UserData{
    let userData = new UserData();
    userData._userId = userIdP;
    userData._userName = userNameP;
    return userData;
  }

  public clear():void{
    //account 要保留
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


  public setUserId(value: number) {
    this._userId = value;
  }

  public setUserName(value: string) {
    this._userName = value;
  }

  public setAccessToken(value: string) {
    this._accessToken = value;
  }

  public getUserId(): number {
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

export class ChainData{
  private _currentChain:CurrentChain = new CurrentChain();//当前店铺数据
  private _simpleChainList:Array<SimpleChain> = new Array<SimpleChain>();//店铺列表

  public static newInstance():ChainData{
    return new ChainData();
  }

  public getCurrentChain(): CurrentChain {
    return this._currentChain;
  }

  public setCurrentChain(value: CurrentChain) {
    this._currentChain = value;
  }

  public getSimpleChainList(): Array<SimpleChain> {
    return this._simpleChainList;
  }

  public setSimpleChainList(value: Array<SimpleChain>) {
    this._simpleChainList = value;
  }
}

export class CurrentChain{
  private _chainId:string;
  private _chainName:string;
  private _userPermData: UserPermData = new UserPermData();//用户对应权限
  private _bossId:number;//店铺老板id

  public static newInstance(chainIdP:string,chainNameP:string,bossIdP:number):CurrentChain{
    let currentChain = new CurrentChain();
    currentChain._chainId = chainIdP;
    currentChain._chainName = chainNameP;
    currentChain._bossId = bossIdP;
    return currentChain;
  }

  public getChainId(): string {
    return this._chainId;
  }

  public getChainName(): string {
    return this._chainName;
  }

  public setChainId(value: string) {
    this._chainId = value;
  }

  public setChainName(value: string) {
    this._chainName = value;
  }

  public getUserPermData(): UserPermData {
    return this._userPermData;
  }

  public setUserPermData(value: UserPermData) {
    this._userPermData = value;
  }

  public getBossId(): number {
    return this._bossId;
  }

  public setBossId(value: number) {
    this._bossId = value;
  }
}

//用户对应的模块权限
export class UserPermData{
  //对应各模块
  isChainClerkAdmin:boolean = false;//连锁店员工管理
  isStoreClerkAdmin:boolean = false;//店铺员工管理
  isProductAdmin: boolean = false;//项目管理
  isCardAdmin: boolean = false;//卡包管理
  isGoodsAdmin: boolean = false;//商品管理
  isPackageAdmin: boolean = false;//套餐管理
  isSellProductAdmin:boolean = false;//产品库管理",
  isChainAdmin:boolean = false;//店铺管理
  isBoss: boolean = false;//老板标志
  roleEnum:number = ChainUserRoleEnum.INIT;//角色
}

export class SimpleChain{
  public id:string;
  public name:string;
  public bossId:number;
  private constructor(){}
  public static newInstance(chainIdP:string,chainNameP:string,bossIdP:number):SimpleChain{
    let simpleChain = new SimpleChain();
    simpleChain.id = chainIdP;
    simpleChain.name = chainNameP;
    simpleChain.bossId = bossIdP;
    return simpleChain;
  }
}
