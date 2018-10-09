import {StoreMgr} from "../../bsModule/store/StoreMgr";
import {StoreSynDataHolder} from "../../bsModule/store/StoreSynDataHolder";
import {StoreClerkInfoSynDataHolder} from "../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {MainViewDataMgr} from "./MainViewDataMgr";
import {MainViewData} from "./MainViewData";
import {HomeViewDataMgr} from "../home/HomeViewDataMgr";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {BUser} from "../../bsModule/buser/apiData/BUser";
import {Store} from "../../bsModule/store/apiData/Store";
import {AppCfg} from "../../comModule/AppCfg";
import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {StoreVipLevelEnum} from "../../bsModule/buser/data/StoreVipLevelEnum";
import {Constants} from "../common/Util/Constants";
import {AppRouter} from "../../comModule/AppRouter";
import {StoreData, CurrentStore, RoleData, UserPermData} from "../../comModule/session/SessionData";
import {StoreAdminUtil} from "./StoreAdminUtil";
import {BUserSynDataHolder} from "../../bsModule/buser/BUserSynDataHolder";
import {GuideViewDataMgr} from "../guide/guideViewDataMgr";
import {BUserRoleMgr} from "../../bsModule/buserRole/buserRoleMgr";
import {BUserMessageClientMgr} from "../../bsModule/buserMessage/BUserMessageClientMgr";
import {MsgUnReadCount} from "../../bsModule/buserMessage/data/MsgUnReadCount";

export class MainService {

  constructor(private storeMgr: StoreMgr,
              private bUserMessageClientMgr: BUserMessageClientMgr,
              private storeSynDataHolder: StoreSynDataHolder,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserSynDataHolder: BUserSynDataHolder,
              private buserRoleMgr: BUserRoleMgr,) {
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
    HomeViewDataMgr.getInstance().notifyDataChanged();
    GuideViewDataMgr.getInstance().notifyDataChanged();
  }

  /**
   * 切换店铺
   * @param storeId
   * @returns {Promise<void>}
   */
  public async toggleStore(storeId) {
    let viewDataTmp: MainViewData = new MainViewData();
    let buserId = SessionUtil.getInstance().getUserId();
    let buser: BUser = await this.buserSynDataHolder.getData(buserId);
    let store: Store = await this.storeSynDataHolder.getData(storeId);

    //未读信息
    let msgUnReadCount: MsgUnReadCount = await this.bUserMessageClientMgr.findUnreadMessageCount(buserId);
    if (msgUnReadCount) {
      viewDataTmp.messageBadge = msgUnReadCount.count;
    }

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
    /**************************组装mainHeader数据************************/

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
        let boss: BUser = await this.buserSynDataHolder.getData(store.bossId);
        if (boss) {
          bossId = boss.id;
        }
      }
      let buserRole = await this.buserRoleMgr.getBUserRole(bossId);
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
      let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(store.clerkInfoId);
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
        AppRouter.goHome();
      } else {
        AppRouter.goExpired();
      }
    } else {//员工
      let boss = await this.buserSynDataHolder.getData(store.bossId);
      if (boss && boss.expiredTime && boss.expiredTime > nextMonthTime) {
        AppRouter.goHome();
      } else {
        AppRouter.goExpired();
      }
    }
  }


  private async buildViewData(callback: (viewDataP: MainViewData) => void) {
    let viewDataTmp: MainViewData = new MainViewData();
    let buserId = SessionUtil.getInstance().getUserId();
    let buser: BUser = await this.buserSynDataHolder.getData(buserId);

    //未读信息
    let msgUnReadCount: MsgUnReadCount = await this.bUserMessageClientMgr.findUnreadMessageCount(buserId);
    if (msgUnReadCount){
      viewDataTmp.messageBadge = msgUnReadCount.count;
    }

    viewDataTmp.userPermData = SessionUtil.getInstance().getUserPermData();
    // SessionUtil.getInstance().setVipLevel(buser.vipType);//保存会员等级  helen
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

    callback(viewDataTmp);
  }

  /**
   * 加载店铺列表
   * @param buser
   */
  public async initStoreList(buser: BUser) {
    // let pageItemCount = buser.storeIdSet ? buser.storeIdSet.length : 10;
    // let pageNo = 1;
    // let findType = StoreFindTypeEnum.All;
    // let storeList: Array<Store> = await this.storeMgr.getByUser(buser.id, pageItemCount, pageNo, findType.toString());
    // if (storeList instanceof Array && storeList.length > 0) {
    //   let storeMap: ZmMap<SimpleStore> = new ZmMap<SimpleStore>();
    //   storeList.forEach((item: Store) => {
    //     let simpleStore = SimpleStore.newInstance(item.id, item.name, item.bossId);
    //     storeMap.put(simpleStore.id, simpleStore);
    //   })
    //   let storeArr = storeMap.values();
    //   let storeId = SessionUtil.getInstance().getStoreId();
    //   if (!AppUtils.isNullOrWhiteSpace(storeId)) {//当前店铺
    //     let storeName = storeMap.get(storeId) ? storeMap.get(storeId).name : "";
    //     let storeData = StoreData.newInstance();
    //     let currentStore = CurrentStore.newInstance(storeId, storeName, storeMap.get(storeId).bossId);
    //     storeData.setCurrentStore(currentStore);
    //     storeData.setSimpleStoreList(storeArr);
    //     SessionUtil.getInstance().setStoreData(storeData);
    //   } else {//没有当前店铺 默认取第一家
    //     let storeData = StoreData.newInstance();
    //     let currentStore = CurrentStore.newInstance(storeArr[0].id, storeArr[0].name, storeArr[0].bossId);
    //     storeData.setCurrentStore(currentStore);
    //     storeData.setSimpleStoreList(storeArr);
    //     SessionUtil.getInstance().setStoreData(storeData);
    //   }
    // }
  }

}

