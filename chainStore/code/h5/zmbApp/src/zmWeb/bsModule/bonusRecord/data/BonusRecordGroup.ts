export class BonusRecordGroup {
  //日期字符串; 格式：yyyy-MM
  dateStr:string;
  // 用户ID
  buserId:string;
  // 业绩金额
  amountCost:number;
  // 提成金额
  bonusCost:number;

  /*******************************衍生信息*******************************/
    // 手机号码
  buserPhone:string;
  // 用户名称
  buserName:string;
  //头像
  buserHeadImg:string;
  //性别
  gender:number;
  // 岗位
  roleNames:Array<string>;
  constructor(){}
}
