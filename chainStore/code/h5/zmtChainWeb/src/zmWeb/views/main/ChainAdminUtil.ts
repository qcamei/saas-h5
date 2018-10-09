import {UserPermData} from "../../comModule/session/SessionData";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {AppUtils} from "../../comModule/AppUtils";
import {AdminPermEnum} from "../../bsModule/chainClerk/data/adminRole/AdminPermEnum";
import {AdminRoleState} from "../../bsModule/chainClerk/data/adminRole/AdminRoleState";
import {ChainClerk} from "../../bsModule/chainClerk/data/ChainClerk";
import {ChainUserRoleEnum} from "../../bsModule/chainUser/data/ChainUserRoleEnum";
import {ChainStoreUserRelative} from "../../bsModule/chainUser/data/ChainStoreUserRelative";
import {ClerkInfo} from "../../bsModule/chainClerk/data/ClerkInfo";
export class ChainAdminUtil{

  public static buildUserPermData(chainClerk:ChainClerk):UserPermData {
    let permSet:Array<number> = ChainAdminUtil.getPermSet(chainClerk);
    let userPermData:UserPermData = ChainAdminUtil.getUserPermData(permSet);
    return userPermData;
  }

  /**
   * 获取员工所在店铺权限
   * @param storeClerkInfo
   * @returns {Array<number>}
   */
  public static getPermSet(chainClerk:ChainClerk):Array<number>{
    let permSet:Array<number> = [];//员工对应权限enum数组
    let userId = SessionUtil.getInstance().getUserId();//当前登录员工
    let roleMap = chainClerk.getRoleMap();
    let clerkInfoMap = chainClerk.getAllClerkInfoMap();

    let clerkInfo:ClerkInfo = clerkInfoMap.get(userId.toString());
    if(clerkInfo && clerkInfo.roleSet){
      clerkInfo.roleSet.forEach((roleId) =>{//遍历员工持有你的所有角色
          let role = roleMap.get(roleId);
          if (role.state == AdminRoleState.Available && role.permSet) {
            permSet = AppUtils.addAll(permSet, role.permSet);
          }
      })
    }

    //权限enum去重
    permSet = AppUtils.uniquelize(permSet);
    return permSet;
  }

  private static getUserPermData(permSet:Array<number>):UserPermData{
    let userPermData:UserPermData = new UserPermData();
    userPermData.roleEnum = ChainUserRoleEnum.CLERK;
    for(let index in permSet){
      let permS = permSet[index];
      let perm = parseInt(permS.toString());
      switch (perm){
        case AdminPermEnum.CHAIN_CLERK_ADMIN:
          userPermData.isChainClerkAdmin = true;
          break;
        case AdminPermEnum.CARD_ADMIN:
          userPermData.isCardAdmin = true;
          break;
        case AdminPermEnum.SELL_PRODUCT_ADMIN:
          userPermData.isSellProductAdmin = true;
          break;
        case AdminPermEnum.CHAIN_ADMIN:
          userPermData.isChainAdmin = true;
          break;
        case AdminPermEnum.BOSS:
          userPermData.isBoss = true;
          break;
      }
    }
    return userPermData;
  }

  public static buildBossUserPermData():UserPermData {
    let userPermData:UserPermData = new UserPermData();
    userPermData.roleEnum = 0;
    userPermData.isBoss = true;
    //boss加载所有模块
    userPermData.isChainClerkAdmin = true;
    userPermData.isCardAdmin = true;
    userPermData.isSellProductAdmin = true;
    userPermData.isChainAdmin = true;
    return userPermData;
  }

  public static buildNoChainUserPermData(chainSU:ChainStoreUserRelative):UserPermData {
    let userPermData:UserPermData = new UserPermData();
    if(chainSU && chainSU.role){
      if(chainSU.role == ChainUserRoleEnum.INIT){
        userPermData.roleEnum = ChainUserRoleEnum.INIT;
      }else if(chainSU.role == ChainUserRoleEnum.BOSS){
        userPermData.roleEnum = ChainUserRoleEnum.BOSS;
        userPermData.isBoss = true;
      }else if(chainSU.role == ChainUserRoleEnum.CLERK){
        userPermData.roleEnum = ChainUserRoleEnum.CLERK;
        userPermData.isBoss = false;
      }
    }

    return userPermData;
  }


}
