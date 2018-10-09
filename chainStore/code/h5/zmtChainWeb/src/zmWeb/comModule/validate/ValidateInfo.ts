export class ValidateInfo{
  bossId:number;
  public static newInstance(bossIdP:number):ValidateInfo{
    let validateInfo = new ValidateInfo();
    validateInfo.bossId = bossIdP;
    return validateInfo;
  }
}
