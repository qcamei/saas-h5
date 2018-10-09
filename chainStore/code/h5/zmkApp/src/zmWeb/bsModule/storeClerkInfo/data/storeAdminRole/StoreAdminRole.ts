import {ZmMap} from "../../../../comModule/AppUtils";
export class StoreAdminRole{
  id:string;
  name:string;
  storeId:string;
  descript:string;
  //role的状态，是否有效等
  state:number;
  permSet:Array<number>;
}

export class StoreAdminPermMap{
  permMap = new ZmMap<string>();
  permList = new Array<string>();
  constructor(){
      this.permMap.put("1","店员管理");
      this.permMap.put("2","项目管理");
      this.permMap.put("3","预约管理");
      this.permMap.put("4","工资管理");
      this.permMap.put("5","会员管理");
      this.permMap.put("6","订单管理");
      this.permMap.put("7","收银管理");
      this.permMap.put("8","耗材管理");
      this.permMap.put("9","数据报表");
      this.permMap.put("10","卡包管理");
  }
}
