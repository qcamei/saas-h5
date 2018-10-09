import {ClerkInfo} from "./ClerkInfo";
import {StoreAdminRole} from "./storeAdminRole/StoreAdminRole";
import {ApplyClerkInfo} from "./ApplyClerkInfo";
import {ZmMap} from "../../../comModule/AppUtils";
import {StoreAdminRoleState} from "./storeAdminRole/StoreAdminRoleState";
import {ApplyState} from "../apiData/ApplyState";
import {EntityState} from "../../../comModule/enum/EntityState";

export class StoreClerkInfo {
  id:string;
  storeId:string;
  roleIdIndex:number;
  //管理员角色权限定义
  roleMap:Array<StoreAdminRole>;
  clerkInfoMap:Array<ClerkInfo>;
  applyClerkInfoMap:Array<ApplyClerkInfo>;
  //对应店铺工资月结天数
  monthPayDays:number;
  createdTime:string;
  lastUpdateTime:string;
  ver:number;

  public getClerkMap():ZmMap<ClerkInfo>{
    let clerkMap = new ZmMap<ClerkInfo>();
    for (let index in this.clerkInfoMap) {
      let item = this.clerkInfoMap[index];
      clerkMap.put(item.buserId, item);
    }
    return clerkMap;
  }

  public getApplyClerkMap():ZmMap<ApplyClerkInfo>{
    let applyClerkMap = new ZmMap<ApplyClerkInfo>();
    for (let index in this.applyClerkInfoMap) {
      let item = this.applyClerkInfoMap[index];
      if(item.state == ApplyState.Pending){
        applyClerkMap.put(item.buserId, item);
      }
    }
    return applyClerkMap;
  }

  public getRoleMap():ZmMap<StoreAdminRole>{
    let roleMap = new ZmMap<StoreAdminRole>();
    for (let index in this.roleMap) {
      let item = this.roleMap[index];
      if(item.state == StoreAdminRoleState.Available){
        roleMap.put(item.id, item);
      }
    }
    return roleMap;
  }

  public getEditRoleMap():ZmMap<StoreAdminRole>{
    let roleMap = new ZmMap<StoreAdminRole>();
    for (let index in this.roleMap) {
      let item = this.roleMap[index];
      if(item.state == StoreAdminRoleState.Available && (item.id != "2")){//不包含老板角色
        roleMap.put(item.id, item);
      }
    }
    return roleMap;
  }

  public getValidClerkMap():ZmMap<ClerkInfo>{
    let clerkMap = new ZmMap<ClerkInfo>();
    for (let index in this.clerkInfoMap) {
      let item:ClerkInfo = this.clerkInfoMap[index];
      if(item.entityState == EntityState.Normal){
        clerkMap.put(item.buserId, item);
      }
    }
    return clerkMap;
  }

}




















