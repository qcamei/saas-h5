export enum AdminPermEnum {
  BOSS = 0,//("chain:*:*:{}","老板"),
  CHAIN_CLERK_ADMIN = 1,//("chain:chainClerk:*:{}","连锁店员工管理"),
  CARD_ADMIN = 2, //("chain:card:*:{}","会员卡管理"),
  SELL_PRODUCT_ADMIN = 3,//("chain:sellProduct:*:{}","产品库管理"),
  CHAIN_ADMIN = 4,//("chain:chain:*:{}","店铺管理"),
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
    let storePermList = [
      new PermItem(1,"员工管理",AdminPermType.MANAGE),
      new PermItem(2,"会员卡管理",AdminPermType.MANAGE),
      new PermItem(3,"产品管理",AdminPermType.MANAGE),
      new PermItem(4,"店铺管理",AdminPermType.MANAGE),
    ];
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
}

export enum AdminPermType{
  MANAGE = 0,//管理权限
  BUSINESS = 1,//店务权限
  SECRECY = 2,//保密权限
}

export class PermData{
  permItem:PermItem;
  checked:boolean = false;
}
