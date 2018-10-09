import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
export enum StoreAdminPermEnum{
  BOSS=0,//("store:*:*:{}","老板"),
  CLERK_ADMIN=1,//("store:clerk:*:{}","店员管理"),
  PRODUCT_ADMIN=2,//("store:product:*:{}","项目管理"),
  APPOINTMENT_ADMIN=3,//("store:appointment:*:{}","预约管理"),
  SALARY_ADMIN=4,//("store:salary:*:{}","工资管理"),
  LEAGUER_ADMIN=5,//("store:leaguer:*:{}","会员管理"),
  ORDER_ADMIN=6,//("store:order:*:{}","订单管理"),
  CASHIER_ADMIN=7,//("store:cashier:*:{}","收银管理"),
  MATERIAL_ADMIN=8,//("store:material:*:{}","耗材管理"),
  REPORT_ADMIN=9,//("store:report:*:{}","数据报表"),
  CARD_ADMIN=10,//("store:card:*:{}","卡包管理"),
  GOODS_ADMIN=11,//("store:goods:*:{}","商品管理"),
  BONUS_ADMIN=12,//("store:bonus:*:{}","提成管理"),
  PURCHASE_ADMIN=13,//("store:purchase:*:{}","开单收银"),
  RECHARGE_ADMIN=14,//("store:recharge:*:{}","会员充值"),
  DEVICE_ADMIN=15,//("store:device:*:{}","仪器管理"),
  ARREARAGE_ADMIN=16,//("store:arrearage:*:{}","欠款管理"),
  PHONE_ADMIN=17,//("store:phone:*:{}","号码可见"),
  PACKAGE_ADMIN=18,//("store:package:*:{}","套餐管理"),
  SYNDATA_ADMIN=19,//("store:syndata:*:{}","数据获取"),
  INCOME_PAY_ADMIN = 20,//("store:incomepay:*:{}","收入支出"),
  STORE_CONFIG_ADMIN = 21,//("store:config:*:{}","管理设置"),
  DAYSNAPSHOT_ADMIN = 22,//("store:daySnapshot:*:{}","交班日结"),
  OPLOG_ADMIN = 23,//("store:oplog:*:{}","操作日志"),
}

export class PermItem{
  public permNum:number;
  public permName:string;
  public permType:number;//权限类型
  constructor(permNumP:number,permNameP:string,permTypeP:number){
    this.permNum = permNumP;
    this.permName = permNameP;
    this.permType = permTypeP;
  }
}

export class StorePermBuilder{

  public static buildPermList(permTypeP:number):Array<PermData>{
    let vipContent = SessionUtil.getInstance().getVipContent();
    let managePermSet = vipContent.permSet;
    managePermSet = AppUtils.toNumber(managePermSet);

    let storePermList = [
      new PermItem(5,"会员档案",AdminPermType.MANAGE),
      new PermItem(1,"员工管理",AdminPermType.MANAGE),
      new PermItem(2,"项目管理",AdminPermType.MANAGE),
      new PermItem(3,"预约列表",AdminPermType.BUSINESS),
      // new PermData(4,"工资管理",AdminPermType.MANAGE),
      new PermItem(6,"订单列表",AdminPermType.BUSINESS),
      // new PermData(7,"收银管理",AdminPermType.MANAGE),
      // new PermData(8,"耗材管理",AdminPermType.MANAGE),
      new PermItem(9,"数据统计",AdminPermType.DATA),
      new PermItem(10,"卡包管理",AdminPermType.MANAGE),
      new PermItem(11,"商品管理",AdminPermType.MANAGE),
      new PermItem(12,"提成管理",AdminPermType.MANAGE),
      new PermItem(13,"开单列表",AdminPermType.BUSINESS),
      new PermItem(14,"会员充值",AdminPermType.BUSINESS),
      new PermItem(15,"仪器管理",AdminPermType.MANAGE),
      new PermItem(16,"欠款管理",AdminPermType.MANAGE),
      new PermItem(17,"会员电话可见",AdminPermType.SECRECY),
      new PermItem(18,"套餐管理",AdminPermType.MANAGE),
      new PermItem(19,"数据获取",AdminPermType.MANAGE),
      new PermItem(20,"收入支出",AdminPermType.DATA),
      new PermItem(21,"管理设置",AdminPermType.MANAGE),
      new PermItem(22,"交班日结",AdminPermType.MANAGE),
      new PermItem(23,"操作日志",AdminPermType.MANAGE),
    ];

    storePermList = storePermList.filter((item)=>{
      if(AppUtils.arrayContains(managePermSet,item.permNum)){
        return true;
      }else {
        return false;
      }
    });

    return storePermList.filter((item)=>{
      if(item.permType == permTypeP){
        return true;
      }else{
        return false;
      }
    }).map((item)=>{
      let permData = new PermData();
      permData.permItem = item;
      return permData;
    });
  }

  public static getVipPermList(permSet:Array<number>):Array<PermItem>{

    let storePermList = [
      new PermItem(5,"会员档案",AdminPermType.MANAGE),
      new PermItem(1,"员工管理",AdminPermType.MANAGE),
      new PermItem(2,"项目管理",AdminPermType.MANAGE),
      new PermItem(3,"预约列表",AdminPermType.BUSINESS),
      // new PermData(4,"工资管理",AdminPermType.MANAGE),
      new PermItem(6,"订单列表",AdminPermType.BUSINESS),
      // new PermData(7,"收银管理",AdminPermType.MANAGE),
      // new PermData(8,"耗材管理",AdminPermType.MANAGE),
      new PermItem(9,"数据统计",AdminPermType.DATA),
      new PermItem(10,"卡包管理",AdminPermType.MANAGE),
      new PermItem(11,"商品管理",AdminPermType.MANAGE),
      new PermItem(12,"提成管理",AdminPermType.MANAGE),
      new PermItem(13,"开单列表",AdminPermType.BUSINESS),
      new PermItem(14,"会员充值",AdminPermType.BUSINESS),
      new PermItem(15,"仪器管理",AdminPermType.MANAGE),
      new PermItem(16,"欠款管理",AdminPermType.MANAGE),
      new PermItem(17,"会员电话可见",AdminPermType.SECRECY),
      new PermItem(18,"套餐管理",AdminPermType.MANAGE),
      new PermItem(19,"数据获取",AdminPermType.MANAGE),
      new PermItem(20,"收入支出",AdminPermType.DATA),
      new PermItem(21,"管理设置",AdminPermType.MANAGE),
      new PermItem(22,"交班日结",AdminPermType.MANAGE),
      new PermItem(23,"操作日志",AdminPermType.MANAGE),
    ];

    storePermList = storePermList.filter((item)=>{
      if(AppUtils.arrayContains(permSet,item.permNum)){
        return true;
      }else {
        return false;
      }
    });

    return storePermList;
  }

}

export enum AdminPermType{
  MANAGE = 0,//管理权限
  BUSINESS = 1,//店务权限
  SECRECY = 2,//保密权限
  DATA = 3,//数据权限
}

export class PermData{
  permItem:PermItem;
  checked:boolean = false;
}

