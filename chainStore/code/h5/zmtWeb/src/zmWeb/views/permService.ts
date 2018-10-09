import {SessionUtil} from "../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../comModule/AppUtils";
import {Injectable} from "@angular/core";
import {BUser} from "../bsModule/buser/apiData/BUser";
import {StoreFindTypeEnum} from "../bsModule/store/apiData/StoreFindTypeEnum";
import {Store} from "../bsModule/store/apiData/Store";
import {SimpleStore, CurrentStore, StoreData, UserPermData, RoleData} from "../comModule/session/SessionData";
import {StoreClerkInfoSynDataHolder} from "../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {StoreMgr} from "../bsModule/store/StoreMgr";
import {StoreAdminUtil} from "./main/StoreAdminUtil";
import {BUserSynDataHolder} from "../bsModule/buser/BUserSynDataHolder";
import {Constants} from "./common/Util/Constants";
import {AppRouter} from "../comModule/AppRouter";
import {BUserRoleMgr} from "../bsModule/buserRole/buserRoleMgr";
import {BUserRole} from "../bsModule/buserRole/data/BuserRole";

@Injectable()
export class PermService {

  constructor(private storeMgr: StoreMgr,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserSynDataHolder: BUserSynDataHolder,
              private buserRoleMgr:BUserRoleMgr) {
  }

  /**
   * 获取进入main依赖数据
   */
  public async resolveData() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let buserId = SessionUtil.getInstance().getUserId();
    let buser: BUser = await this.buserSynDataHolder.getData(buserId);

    if (!AppUtils.isNullObj(buser)) {
      let pageItemCount = buser.storeIdSet ? buser.storeIdSet.length : 10;
      let findType = StoreFindTypeEnum.All;
      let storeList: Array<Store> = await this.storeMgr.getByUser(buser.id, pageItemCount, 1, findType.toString());
      let userPermData = new UserPermData();
      if (storeList.length > 0){//有店铺
        /*****************************店铺权限数据********************************/
        let store = this.getCurrentStore(storeList, storeId);
        let boss: BUser = buser;
        if (store.bossId && store.bossId != buserId){
          boss = await this.buserSynDataHolder.getData(store.bossId);
        }
        if(!AppUtils.isNullObj(boss)){
          userPermData = await this.getPermData(store,buserId,boss.id);
          SessionUtil.getInstance().setVipLevel(boss.vipType);//保存会员等级
        }
        this.setStoreData(storeList,store,userPermData);
        SessionUtil.getInstance().setReload(true);
        /*****************************店铺权限数据********************************/

        /******************************账户过期验证*******************************/
        let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP * 30;
        if (boss && boss.expiredTime && boss.expiredTime > nextMonthTime) {
          // AppRouter.goHome();
        } else {
          AppRouter.goExpired();
        }
        /******************************账户过期验证*******************************/
      }else{//无店铺
        /*****************************店铺权限数据********************************/
        userPermData = StoreAdminUtil.buildNoStoreUserPermData(buser);
        SessionUtil.getInstance().setUserPermData(userPermData);
        SessionUtil.getInstance().setReload(true);
        /*****************************店铺权限数据********************************/

        /******************************账户过期验证*******************************/
        if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "2")){//员工
          AppRouter.goExpired();
        }else if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "0")) {//老板角色跳转开店铺页面
          let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP*30;
          if(buser.expiredTime && buser.expiredTime <= nextMonthTime){
            AppRouter.goExpired();
          }else{
            AppRouter.goBossAddStore();
          }
        }
        /******************************账户过期验证*******************************/
      }
    }else{
      AppUtils.showWarn("提示", "加载失败");
    }
  }

  /**
   * 刷新用户店铺、权限数据
   */
  public async refreshPermData() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let buserId = SessionUtil.getInstance().getUserId();
    let buser: BUser = await this.buserSynDataHolder.getData(buserId);

    if (!AppUtils.isNullObj(buser)) {
      let pageItemCount = buser.storeIdSet ? buser.storeIdSet.length : 10;
      let findType = StoreFindTypeEnum.All;
      let storeList: Array<Store> = await this.storeMgr.getByUser(buser.id, pageItemCount, 1, findType.toString());
      let userPermData = new UserPermData();
      if (storeList.length > 0){
        /*****************************店铺权限数据********************************/
        let store = this.getCurrentStore(storeList, storeId);
        let boss: BUser = buser;
        if (store.bossId && store.bossId != buserId){
          boss = await this.buserSynDataHolder.getData(store.bossId);
        }
        if(!AppUtils.isNullObj(boss)){
          userPermData = await this.getPermData(store,buserId,boss.id);
        }
        this.setStoreData(storeList,store,userPermData);
        /*****************************店铺权限数据********************************/
      }
    }else{
      AppUtils.showWarn("提示", "加载失败");
    }
  }

  /**
   * 获取当前店铺
   * @param storeList
   * @param storeId
   * @returns {Store}
   */
  private getCurrentStore(storeList, storeId):Store {
    let storeMap = new ZmMap<Store>();
    storeList.forEach((store) => {
      storeMap.put(store.id, store);
    });
    storeId = storeId ? storeId : storeList[0].id;
    return storeMap.get(storeId);
  }

  /**
   * 获取权限
   * @param store
   * @param buserId
   * @param bossId
   * @returns {Promise<UserPermData>}
   */
  private async getPermData(store:Store,buserId,bossId){
    let userPermData = new UserPermData();
    let buserRole:BUserRole = await this.buserRoleMgr.getBUserRole(bossId);
    this.setRoleData(buserRole);
    if(buserRole && buserRole.vipContent && buserRole.vipContent.permSet){
      if (buserId == bossId) {
        userPermData = StoreAdminUtil.buildBossUserPermData(buserRole.vipContent.permSet);
      } else if (store.clerkInfoId) {
        let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(store.clerkInfoId);
        if (!AppUtils.isNullObj(storeClerkInfo)) {
          userPermData = StoreAdminUtil.buildUserPermData(storeClerkInfo, buserRole.vipContent.permSet);
        }
      }
      if (store.chainIds && store.chainIds[0]) {
        if (userPermData.isSynDataAdmin) {
          userPermData.showSynData = true;
        }
      } else {//没有加入连锁店
        userPermData.showSynData = false;
      }
    }
    return userPermData;
  }

  /**
   * 设置店铺数据
   * @param storeList
   * @param store
   * @param userPermData
   */
  private setStoreData(storeList:Array<Store>,store:Store,userPermData:UserPermData){
    let storeData = StoreData.newInstance();
    let currentStore = CurrentStore.newInstance(store,userPermData);
    storeData.setCurrentStore(currentStore);
    let storeArr: Array<SimpleStore> = storeList.map((item: Store) => {
      return SimpleStore.newInstance(item.id, item.name, item.bossId);
    });
    storeData.setSimpleStoreList(storeArr);
    SessionUtil.getInstance().setStoreData(storeData);
  }

  /**
   * 设置用户权限数据
   */
  private setRoleData(buserRole:BUserRole){
    if(!AppUtils.isNullObj(buserRole)){
      let roleData = RoleData.newInstance(buserRole.buserId,buserRole.vipContent);
      SessionUtil.getInstance().setRoleData(roleData);
    }
  }

}
