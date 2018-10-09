import {StoreClerkInfo} from "../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {UserPermData} from "../../comModule/session/SessionData";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreAdminPermEnum} from "../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminPermEnum";
import {BUser} from "../../bsModule/buser/apiData/BUser";
import {StoreAdminRoleState} from "../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRoleState";
export class StoreAdminUtil{

  public static buildUserPermData(storeClerkInfo:StoreClerkInfo,managePermSet:Array<number>):UserPermData {
    let permSet:Array<number> = StoreAdminUtil.getPermSet(storeClerkInfo);
    let userPermData:UserPermData = StoreAdminUtil.getUserPermData(permSet,managePermSet);
    return userPermData;
  }

  /**
   * 获取员工所在店铺权限
   * @param storeClerkInfo
   * @returns {Array<number>}
   */
  public static getPermSet(storeClerkInfo:StoreClerkInfo):Array<number> {
    let permSet:Array<number> = [];//员工对应权限enum数组
    let userId = SessionUtil.getInstance().getUserId();//当前登录员工
    let roleMap = storeClerkInfo.roleMap;
    let clerkInfoMap = storeClerkInfo.clerkInfoMap;
    for(let key in clerkInfoMap){//遍历所有员工 获取当前登录用户对应的员工信息、角色信息
      let clerkInfo = clerkInfoMap[key];
      if(clerkInfo.buserId == userId){
        let roleSet = clerkInfo.roleSet;
        if(roleSet){
          roleSet.forEach((roleId) =>{//遍历员工持有你的所有角色
            for(let key in roleMap){//遍历所有角色 判断角色有效性 添加角色对应的权限enum
              let role = roleMap[key];
              if (role.state == StoreAdminRoleState.Available && role.id == roleId && role.permSet) {
                permSet = AppUtils.addAll(permSet, role.permSet);
              }
            }
          })
        }
      }
    }
    //权限enum去重
    permSet = AppUtils.uniquelize(permSet);
    return permSet;
  }

  private static getUserPermData(userPermSet:Array<number>,managePermSet:Array<number>):UserPermData{

    let userPermData:UserPermData = new UserPermData();
    userPermData.roleEnum = 1;
    let permSet = AppUtils.repeat(userPermSet,managePermSet);
    this.getPermData(userPermData,permSet);
    return userPermData;
  }
  //组装权限与管理后台的设置取交集
  public static buildBossUserPermData(managePermSet:Array<number>):UserPermData {
    let userPermData:UserPermData = new UserPermData();
    userPermData.roleEnum = 0;
    userPermData.isBoss = true;

    let userPermSet = new Array<number>();
    for(let i in StoreAdminPermEnum){
      let reg = new RegExp("^[A-Z]+_?[A-Z]*_?[A-Z]*$");
      if(i!= "0" && AppUtils.isNullObj(i.match(reg))){
        userPermSet.push(parseInt(i));
      }
    }

    let permSet = AppUtils.repeat(managePermSet,userPermSet);
    this.getPermData(userPermData,permSet);
    return userPermData;
  }

  private static getPermData(userPermData,permSet:Array<number>):UserPermData{
    for(let index in permSet){
      let permS = permSet[index];
      let perm = parseInt(permS.toString());
      switch (perm){
        case StoreAdminPermEnum.CLERK_ADMIN:
          userPermData.isClerkAdmin = true;
          break;
        case StoreAdminPermEnum.PRODUCT_ADMIN:
          userPermData.isProductAdmin = true;
          break;
        case StoreAdminPermEnum.APPOINTMENT_ADMIN:
          userPermData.isAppointmentAdmin = true;
          break;
        case StoreAdminPermEnum.SALARY_ADMIN:
          userPermData.isSalaryAdmin = true;
          break;
        case StoreAdminPermEnum.LEAGUER_ADMIN:
          userPermData.isLeaguerAdmin = true;
          break;
        case StoreAdminPermEnum.ORDER_ADMIN:
          userPermData.isOrderAdmin = true;
          break;
        case StoreAdminPermEnum.CASHIER_ADMIN:
          userPermData.isCashierAdmin = true;
          break;
        case StoreAdminPermEnum.MATERIAL_ADMIN:
          userPermData.isMaterialAdmin = true;
          break;
        case StoreAdminPermEnum.REPORT_ADMIN:
          userPermData.isReportAdmin = true;
          break;
        case StoreAdminPermEnum.CARD_ADMIN:
          userPermData.isCardAdmin = true;
          break;
        case StoreAdminPermEnum.GOODS_ADMIN:
          userPermData.isGoodsAdmin = true;
          break;
        case StoreAdminPermEnum.BONUS_ADMIN:
          userPermData.isBonusAdmin = true;
          break;
        case StoreAdminPermEnum.PURCHASE_ADMIN:
          userPermData.isPurchaseAdmin = true;
          break;
        case StoreAdminPermEnum.RECHARGE_ADMIN:
          userPermData.isRechargeAdmin = true;
          break;
        case StoreAdminPermEnum.DEVICE_ADMIN:
          userPermData.isDeviceAdmin = true;
          break;
        case StoreAdminPermEnum.ARREARAGE_ADMIN:
          userPermData.isArrearageAdmin = true;
          break;
        case StoreAdminPermEnum.PHONE_ADMIN:
          userPermData.isPhoneAdmin = true;
          break;
        case StoreAdminPermEnum.PACKAGE_ADMIN:
          userPermData.isPackageAdmin = true;
          break;
        case StoreAdminPermEnum.SYNDATA_ADMIN:
          userPermData.isSynDataAdmin = true;
          break;
        case StoreAdminPermEnum.INCOME_PAY_ADMIN:
          userPermData.isIncomePayAdmin = true;
          break;
        case StoreAdminPermEnum.STORE_CONFIG_ADMIN:
          userPermData.isStoreConfigAdmin = true;
          break;
        case StoreAdminPermEnum.DAYSNAPSHOT_ADMIN:
          userPermData.isDaySnapshotAdmin = true;
          break;
        case StoreAdminPermEnum.OPLOG_ADMIN:
          userPermData.isOplogAdmin = true;
          break;
      }
    }
    return userPermData;
  }

  public static buildNoStoreUserPermData(buser:BUser):UserPermData {
    let userPermData:UserPermData = new UserPermData();
    if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "2")){
      userPermData.roleEnum = 2;
    }else if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "0")){
      userPermData.roleEnum = 0;
      userPermData.isBoss = true;
    }else if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "1")){
      userPermData.roleEnum = 1;
      userPermData.isBoss = false;
    }
    return userPermData;
  }


}
