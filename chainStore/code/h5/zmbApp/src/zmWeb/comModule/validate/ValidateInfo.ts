export class ValidateInfo{
  bossId:string;
  storeId:string;
  appId:number;
  public static newInstance(storeIdP:string):ValidateInfo{
    let validateInfo = new ValidateInfo();
    // validateInfo.bossId = bossIdP;
    validateInfo.storeId = storeIdP;
    // validateInfo.appId = 1; //web前台不要传
    return validateInfo;
  }
}
