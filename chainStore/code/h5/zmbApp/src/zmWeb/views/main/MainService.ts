import {MainViewData} from "./MainViewData";
import {MainViewDataMgr} from "./MainViewDataMgr";
import {StoreFindTypeEnum} from "../../bsModule/store/apiData/StoreFindTypeEnum";
import {StoreMgr} from "../../bsModule/store/StoreMgr";
import {BUserMessageClientMgr} from "../../bsModule/buserMessage/BUserMessageClientMgr";
import {StoreSynDataHolder} from "../../bsModule/store/StoreSynDataHolder";
import {BUserSynDataHolder} from "../../bsModule/buser/BUserSynDataHolder";
import {BUserRoleMgr} from "../../bsModule/buserRole/buserRoleMgr";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {BUser} from "../../bsModule/buser/data/BUser";
import {Store} from "../../bsModule/store/data/Store";
import {MsgUnReadCount} from "../../bsModule/buserMessage/data/MsgUnReadCount";
import {AppCfg} from "../../comModule/AppCfg";
import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {StoreVipLevelEnum} from "../../bsModule/buser/data/StoreVipLevelEnum";
import {CurrentStore, RoleData, SimpleStore, StoreData, UserPermData} from "../../comModule/session/SessionData";
import {StoreAdminUtil} from "./StoreAdminUtil";
import {Constants} from "../zmComUtils/Constants";
import {AppRouter} from "../zmComUtils/AppRouter";
import {StoreClerkInfoSynDataHolder} from "../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserRole} from "../../bsModule/buserRole/data/BuserRole";
import {MessageMgr} from "../../bsModule/message/MessageMgr";
import {Message} from "../../bsModule/message/data/Message";
import {BUserMgr} from "../../bsModule/buser/BUserMgr";
import {MgrPool} from "../../comModule/MgrPool";


export class MainService{

  public static getInstance():MainService{
    return MgrPool.getInstance().get("MainService",MainService);
  }

  constructor() {
  }

  public initViewData() {
    this.buildViewData((viewDataP: MainViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    MainViewDataMgr.getInstance().setData(viewDataP);
  }

  private async buildViewData(callback: (viewDataP: MainViewData) => void) {
    this.buildStoreListAndPermData(callback);
  }

  /**
   * 初始化用户店铺、权限数据
   */
  public async buildStoreListAndPermData(callback: (viewDataP: MainViewData) => void) {
    let viewDataTmp = MainViewData.getInstance();
    let _self = this;
    let storeId = SessionUtil.getInstance().getStoreId();
    let buserId = SessionUtil.getInstance().getUserId();
    let store = new Store();
    let buser: BUser = await BUserMgr.getInstance().getBUser(buserId);
    let userPermData = new UserPermData();
    if (!AppUtils.isNullObj(buser)) {
      /***************************** 获取店铺列表 ********************************/
      let pageItemCount = buser.storeIdSet ? buser.storeIdSet.length : 10;
      let findType = StoreFindTypeEnum.All;
      let storeList: Array<Store> = await StoreMgr.getInstance().getByUser(buserId, pageItemCount, 1, findType.toString());
      if (storeList.length > 0){
        /***************************** 获取当前店铺 ********************************/
        store = _self.getCurrentStore(storeList, storeId);
        storeId = store.id;
        /***************************** 获取当前用户权限 ********************************/
        let boss: BUser = buser;
        if (store.bossId && store.bossId != buserId) {
          boss = await BUserMgr.getInstance().getBUser(store.bossId);
        }
        if(!AppUtils.isNullObj(boss)){
          userPermData = await _self.getPermData(store,buserId,boss.id);
        }
        _self.setStoreData(storeList,store,userPermData);
      } else {//无店铺
        /*****************************店铺权限数据********************************/
        userPermData = StoreAdminUtil.buildNoStoreUserPermData(buser);
        SessionUtil.getInstance().setUserPermData(userPermData);
        SessionUtil.getInstance().setReload(true);
        /******************************账户过期验证*******************************/
        if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "2")){//员工
          // AppRouter.goExpired();
        }else if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "0")) {//老板角色跳转开店铺页面
          let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP*30;
          if(buser.expiredTime && buser.expiredTime <= nextMonthTime){
            // AppRouter.goExpired();
          }else{
            // AppRouter.goBossAddStore();
          }
        }
     }


      /************************* 权限数据 ************************************/
      viewDataTmp.userPermData = SessionUtil.getInstance().getUserPermData();
      /************************* mianHeader数据 ******************************/
      viewDataTmp.userName = buser.name;
      if (buser.headImg) {
        viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl() + buser.headImg;
      }
      if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "2")) {
        viewDataTmp.userRole = "未分配";
      } else if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "0")) {
        viewDataTmp.showDevice = buser.vipType == StoreVipLevelEnum.HonKonUser;
        viewDataTmp.userRole = "管理者";
      } else if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "1")) {
        viewDataTmp.userRole = "工作者";
      }
      /************************** 当前店铺数据 ********************************/
      viewDataTmp.storeName = store.name;
      /************************** 店铺列表数据 *******************************/
      viewDataTmp.storeList = SessionUtil.getInstance().getSimpleStoreList();

      /************************ mainHeader未读消息数 **********************************/
      let msgUnReadCount: MsgUnReadCount = await BUserMessageClientMgr.getInstance().findUnreadMessageCount(buserId);
      if (msgUnReadCount){
        viewDataTmp.messageBadge = msgUnReadCount.count;
      }

      /************************* 首页和管理页，各模块的消息数 ********************/
      let messageListTmp:Array<Message> = await MessageMgr.getInstance().findMessageList(storeId, buserId);
      viewDataTmp.messageList = messageListTmp;
      callback(viewDataTmp);
    }
  }

  /**
   * 获取当前店铺
   * @param storeList
   * @param storeId
   * @returns {Store}
   */
  private getCurrentStore(storeList, storeId:string):Store {
    let storeMap = new ZmMap<Store>();
    storeList.forEach((store) => {
      storeMap.put(store.id, store);
    });
    if(AppUtils.isNullOrWhiteSpace(storeId)){
      storeId = storeList[0].id;
    }
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
    let buserRole:BUserRole = await BUserRoleMgr.getInstance().getBUserRole(bossId);
    this.setRoleData(buserRole);
    if(buserRole && buserRole.vipContent && buserRole.vipContent.permSet){
      if (buserId == bossId) {
        userPermData = StoreAdminUtil.buildBossUserPermData(buserRole.vipContent.permSet);
      } else if (store.clerkInfoId) {
        let storeClerkInfo = await StoreClerkInfoSynDataHolder.getInstance().getData(store.clerkInfoId);
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
   * 获取权限
   * @param store
   * @param buserId
   * @param bossId
   * @returns {Promise<UserPermData>}
   */
  private async getFinal(store:Store,buserId,bossId){
    let userPermData = new UserPermData();
    let buserRole:BUserRole = await BUserRoleMgr.getInstance().getBUserRole(bossId);
    this.setRoleData(buserRole);
    if(buserRole && buserRole.vipContent && buserRole.vipContent.permSet){
      if (buserId == bossId) {
        userPermData = StoreAdminUtil.buildBossUserPermData(buserRole.vipContent.permSet);
      } else if (store.clerkInfoId) {
        let storeClerkInfo = await StoreClerkInfoSynDataHolder.getInstance().getData(store.clerkInfoId);
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
    let simpleStoreArr: Array<SimpleStore> = storeList.map((item: Store) => {
      return SimpleStore.newInstance(item.id, item.name, item.bossId);
    });
    storeData.setSimpleStoreList(simpleStoreArr);
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


  /**
   * 切换店铺
   * @param storeId
   * @returns {Promise<void>}
   */
  public async toggleStore(storeId) {
    let viewDataTmp: MainViewData = MainViewData.getInstance();
    let buserId = SessionUtil.getInstance().getUserId();
    let buser: BUser = await BUserSynDataHolder.getInstance().getData(buserId);
    let store: Store = await StoreMgr.getInstance().getStore(storeId);

    let managePermSet = new Array<number>();
    if (store) {
      managePermSet = await this.getManagerPermSet(store, buserId);
    }

    if (store && managePermSet) {
      viewDataTmp.userPermData = await this.buildPermData(store, buserId, managePermSet);
    }

    this.toogleStoreData(store, viewDataTmp.userPermData);
    SessionUtil.getInstance().setVipLevel(buser.vipType);//保存会员等级
    /**************************组装mainHeader数据************************/
    viewDataTmp.userName = buser.name;
    if (buser.headImg) {
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl() + buser.headImg;
    }
    if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "2")) {
      viewDataTmp.userRole = "未分配";
    } else if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "0")) {
      viewDataTmp.showDevice = buser.vipType == StoreVipLevelEnum.HonKonUser;
      viewDataTmp.userRole = "管理者";
    } else if (buser.roleSet && AppUtils.arrayContains(buser.roleSet, "1")) {
      viewDataTmp.userRole = "工作者";
    }
    viewDataTmp.storeName = SessionUtil.getInstance().getStoreName();
    viewDataTmp.storeList = SessionUtil.getInstance().getSimpleStoreList();

    //验证会员到期时间
    await this.checkExpiredTime(store, buser);
    this.handleViewData(viewDataTmp);
  }

  /**
   * 切换店铺数据
   * @param store
   * @param userPermData
   */
  private toogleStoreData(store: Store, userPermData: UserPermData) {
    let storeData = StoreData.newInstance();
    storeData.setCurrentStore(CurrentStore.newInstance(store, userPermData));
    storeData.setSimpleStoreList(SessionUtil.getInstance().getSimpleStoreList());
    SessionUtil.getInstance().setStoreData(storeData);
  }

  private async getManagerPermSet(store, buserId) {
    let managePermSet = new Array<number>();
    let vipContent = SessionUtil.getInstance().getVipContent();
    if (AppUtils.isNullObj(vipContent)) {
      let bossId = "";
      if (store.bossId == buserId) {//老板
        bossId = buserId;
      } else if (store.clerkInfoId) {
        let boss: BUser = await BUserSynDataHolder.getInstance().getData(store.bossId);
        if (boss) {
          bossId = boss.id;
        }
      }
      let buserRole = await BUserRoleMgr.getInstance().getBUserRole(bossId);
      if (!AppUtils.isNullObj(buserRole)) {
        let roleData = RoleData.newInstance(buserRole.buserId, buserRole.vipContent);
        SessionUtil.getInstance().setRoleData(roleData);
        managePermSet = roleData.getVipContent().permSet;
      }
    } else {
      managePermSet = vipContent.permSet;
    }
    return managePermSet;
  }

  private async buildPermData(store, buserId, managePermSet: Array<number>) {
    let userPermData = new UserPermData();
    if (store && (store.bossId == buserId)) {//老板
      userPermData = StoreAdminUtil.buildBossUserPermData(managePermSet);
    } else if (store && store.clerkInfoId) {
      let storeClerkInfo = await StoreClerkInfoSynDataHolder.getInstance().getData(store.clerkInfoId);
      if (storeClerkInfo) {
        userPermData = StoreAdminUtil.buildUserPermData(storeClerkInfo, managePermSet);
      }
    }
    if (store.chainIds && store.chainIds[0]) {
      if (userPermData.isSynDataAdmin) {
        userPermData.showSynData = true;
      }
    } else {//没有加入连锁店 设置获取数据
      userPermData.showSynData = false;
    }

    return userPermData;
  }

  private async checkExpiredTime(store: Store, buser: BUser) {
    let buserId = SessionUtil.getInstance().getUserId();
    let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP * 30;
    if (buserId && store && store.bossId && store.bossId == buserId) {//老板
      if (buser.expiredTime && buser.expiredTime > nextMonthTime) {//大于30天
        AppRouter.getInstance().goMain();
      } else {
        // AppRouter.goExpired();
      }
    } else {//员工
      let boss = await BUserSynDataHolder.getInstance().getData(store.bossId);
      if (boss && boss.expiredTime && boss.expiredTime > nextMonthTime) {
        AppRouter.getInstance().goMain();
      } else {
        // AppRouter.goExpired();
      }
    }
  }

}
