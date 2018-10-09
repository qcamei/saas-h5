import {BUser} from "../../buser/apiData/BUser";
import {BonusRecord} from "./BonusRecord";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreClerkInfo} from "../../storeClerkInfo/data/StoreClerkInfo";
import {ClerkInfo} from "../../storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../storeClerkInfo/data/storeAdminRole/StoreAdminRole";

export class BonusRecordDataHelper {
  constructor(){}

  /**
   * 构建用户的月度提成信息Map
   * @param {Array<BonusRecord>} bonusRecordList
   * @param {ZmMap<BuserRoleBonusInfo>} buserRoleBonusInfoMap
   * @returns {ZmMap<BuserMonthBonus>}
   */
  public static buildBuserMonthBonusMap(bonusRecordList: Array<BonusRecord>, buserRoleBonusInfoMap:ZmMap<BuserRoleBonusInfo>):ZmMap<BuserMonthBonus>{
    let buserMonthBonusMap = new ZmMap<BuserMonthBonus>();
    for(let index in bonusRecordList){
      let monthStr:string = this.getMonthStr(bonusRecordList[index].orderTime);
      let buserId:string = bonusRecordList[index].buserId;
      let amount:number = bonusRecordList[index].amount ? bonusRecordList[index].amount:0;
      let cost:number = bonusRecordList[index].cost ? bonusRecordList[index].cost: 0;
      let key:string= AppUtils.format("{0}_{1}",monthStr,buserId)
      let buserMonthBonus:BuserMonthBonus= buserMonthBonusMap.get(key);
      if(AppUtils.isNullObj(buserMonthBonus)){
        buserMonthBonus = new BuserMonthBonus();
        buserMonthBonus.id=key;
        buserMonthBonus.dateStr=monthStr;
        buserMonthBonus.buserId=bonusRecordList[index].buserId;
        buserMonthBonus.amount=0;
        buserMonthBonus.cost=0;
        let buserRoleBonusInfo=buserRoleBonusInfoMap.get(bonusRecordList[index].buserId);
        if(!AppUtils.isNullObj(buserRoleBonusInfo) && !AppUtils.isNullObj(buserRoleBonusInfo.buser)){
          buserMonthBonus.buserName=buserRoleBonusInfo.buser.name;
        }else{
          buserMonthBonus.buserName="-";
        }
      }
      buserMonthBonus.amount=parseFloat((buserMonthBonus.amount*1.0 + amount*1.0).toFixed(2));
      buserMonthBonus.cost=parseFloat((buserMonthBonus.cost*1.0+cost*1.0).toFixed(2));
      buserMonthBonusMap.put(key, buserMonthBonus);
    }
    return buserMonthBonusMap;
  }

  /**
   * 构建用户和用户的角色信息Map
   * @param {StoreClerkInfo} storeClerkInfo
   * @param {Array<BUser>} buserList
   * @returns {ZmMap<BuserRoleBonusInfo>}
   */
  public static buildBuserRoleBonusInfo(storeClerkInfo:StoreClerkInfo, buserList:Array<BUser>):ZmMap<BuserRoleBonusInfo>{
    let clerkInfoList:Array<ClerkInfo> = storeClerkInfo.clerkInfoMap;
    let storeAdminRoleList:Array<StoreAdminRole> = storeClerkInfo.roleMap;

    let clerkInfoMap:ZmMap<ClerkInfo>=new ZmMap<ClerkInfo>();
    for (let index in clerkInfoList) {
      clerkInfoMap.put(clerkInfoList[index].buserId, clerkInfoList[index]);
    }

    let storeAdminRoleMap:ZmMap<StoreAdminRole>=new ZmMap<StoreAdminRole>();
    for (let index in storeAdminRoleList) {
      storeAdminRoleMap.put(storeAdminRoleList[index].id, storeAdminRoleList[index]);
    }

    let buserRoleBonusInfoMap:ZmMap<BuserRoleBonusInfo>=new ZmMap<BuserRoleBonusInfo>();
    for(let index in buserList){
      let buser:BUser = buserList[index];
      let buserRoleBonusInfo:BuserRoleBonusInfo = new BuserRoleBonusInfo();
      buserRoleBonusInfo.buserId=buser.id;
      buserRoleBonusInfo.buser=buser;
      let roleIds:Array<string> = clerkInfoMap.get(buser.id).roleSet;
      let roleNames:Array<string> = new Array<string>();
      for(let idx in roleIds){
        roleNames.push(storeAdminRoleMap.get(roleIds[idx]) ? storeAdminRoleMap.get(roleIds[idx]).name:"-");
      }
      buserRoleBonusInfo.roleName=roleNames.join(",");
      buserRoleBonusInfoMap.put(buserRoleBonusInfo.buserId, buserRoleBonusInfo);
    }
    return buserRoleBonusInfoMap;
  }

  public static getMonthStr(orderTime:number):string{
    let date:Date = new Date(orderTime * 1);
    return date.getFullYear()+"/"+(date.getMonth()+1);
  }
}

//用户节本信息与角色信息
export class BuserRoleBonusInfo{
  public buserId:string;
  public buser:BUser;
  public roleName:string;
}

//用户月度提成信息
export class BuserMonthBonus{
  public id:string;
  public dateStr:string;
  public buserId:string;
  public buserName:string;
  public amount:number;
  public cost:number;
}
