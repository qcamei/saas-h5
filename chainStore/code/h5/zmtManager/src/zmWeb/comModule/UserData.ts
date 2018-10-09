export class UserData{
  private _userId:string;
  private _userName:string;
  private _accessToken:string;

  public static newInstance():UserData{
    return new UserData();
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

}

export class StoreData{
  private _storeId:string;
  private _storeName:string;
  private _simpleStoreList:Array<SimpleStore>;

  public static newInstance():StoreData{
    return new StoreData();
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

  public setStoreId(value: string) {
    this._storeId = value;
  }

  public setStoreName(value: string) {
    this._storeName = value;
  }

  public setSimpleStoreList(value: Array<SimpleStore>) {
    this._simpleStoreList = value;
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
  isPurchaseAdmin: boolean = false;//购买消费
  isRechargeAdmin: boolean = false;//会员充值
  isDeviceAdmin: boolean = false;//仪器管理
  //老板标志
  isBoss: boolean = false;
}

export class SimpleStore{
  public id:string;
  public name:string;
}
