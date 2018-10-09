export class ValidateInfo{
  bossId:string;
  storeId:string;
  public static newInstance(bossIdP:string,storeIdP:string):ValidateInfo{
    let validateInfo = new ValidateInfo();
    validateInfo.bossId = bossIdP;
    validateInfo.storeId = storeIdP;
    return validateInfo;
  }
}
