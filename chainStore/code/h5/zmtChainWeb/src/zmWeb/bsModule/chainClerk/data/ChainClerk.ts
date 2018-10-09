import {ZmMap} from "../../../comModule/AppUtils";
import {ClerkInfo} from "./ClerkInfo";
import {EntityStateEnum} from "../../../comModule/enum/EntityStateEnum";
import {AdminRole} from "./adminRole/AdminRole";
import {AdminRoleState} from "./adminRole/AdminRoleState";

export class ChainClerk {
    constructor(){}
    id:number;
    chainId:number;
    roleIdIndex:number;
    roleMap:any;//ZmMap<AdminRole>
    clerkInfoMap:any;//ZmMap<ClerkInfo>
    createdTime:number;
    lastUpdateTime:number;
    ver:number;


  public getAllClerkInfoMap():ZmMap<ClerkInfo>{
    let clerkMap = new ZmMap<ClerkInfo>();
    for (let index in this.clerkInfoMap) {
      let item:ClerkInfo = this.clerkInfoMap[index];
      clerkMap.put(item.userId.toString(), item);
    }
    return clerkMap;
  }

  public getValidClerkInfoMap():ZmMap<ClerkInfo>{
    let clerkMap = new ZmMap<ClerkInfo>();
    for (let index in this.clerkInfoMap) {
      let item:ClerkInfo = this.clerkInfoMap[index];
      if(item.entityState == EntityStateEnum.Normal){
        clerkMap.put(item.userId.toString(), item);
      }
    }
    return clerkMap;
  }


  public getRoleMap():ZmMap<AdminRole>{
    let roleMap = new ZmMap<AdminRole>();
    for (let index in this.roleMap) {
      let item:AdminRole = this.roleMap[index];
      if(item.state == AdminRoleState.Available){
        roleMap.put(item.id, item);
      }
    }
    return roleMap;
  }

  public getEditRoleMap():ZmMap<AdminRole>{
    let roleMap = new ZmMap<AdminRole>();
    for (let index in this.roleMap) {
      let item:AdminRole = this.roleMap[index];
      if(item.state == AdminRoleState.Available && (item.id != "2")){//不包含老板角色
        roleMap.put(item.id, item);
      }
    }
    return roleMap;
  }

}
