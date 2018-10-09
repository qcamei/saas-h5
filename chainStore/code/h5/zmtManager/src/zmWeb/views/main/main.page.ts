import {Component, OnInit, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy} from '@angular/core';
import {SessionUtil} from "../../comModule/SessionUtil";
import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {StoreMgr} from "../../bsModule/store/StoreMgr";
import {Router} from "@angular/router";
import {Store} from "../../bsModule/store/apiData/Store";
import {MainViewDataMgr} from "./mainViewDataMgr";
import {StoreFindTypeEnum} from "../../bsModule/store/apiData/StoreFindTypeEnum";
import {MainHeaderCompViewData} from "./head/main.header";
import {BUser} from "../../bsModule/buser/apiData/BUser";
import {BUserMgr} from "../../bsModule/buser/BUserMgr";
import {AppRouter} from "../../comModule/AppRouter";
import {StoreData, UserPermData, SimpleStore} from "../../comModule/UserData";
import {Constants} from "../common/Util/Constants";
import {DataSynCtrl} from "../../comModule/dataSyn/DataSynCtrl";
import {StoreSynDataHolder} from "../../bsModule/store/StoreSynDataHolder";

@Component({
  template: `
    <zmt-main-layout [data]="headerData" (toggleStoreCallback)="toggleStore($event)">
      <router-outlet></router-outlet>
    </zmt-main-layout>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private viewDataChangedSub:any;
  private service:MainService;
  public viewData:MainViewData = new MainViewData();

  public headerData:MainHeaderCompViewData = MainHeaderCompViewData.fromComp(this.viewData);

  constructor(private storeMgr:StoreMgr,
              private storeSynDataHolder:StoreSynDataHolder,
              //private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private mainViewDataMgr:MainViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private router: Router) {
    this.service = new MainService(this.storeMgr,this.storeSynDataHolder,this.buserMgr,this.mainViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.mainViewDataMgr.subscribeMainVD((viewDataP:MainViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.headerData = MainHeaderCompViewData.fromComp(viewDataP);
        this.cdRef.markForCheck();
      }
    });
    this.viewDataChangedSub = this.mainViewDataMgr.subscribeMainDataChangedVD(() => {
      this.service.initViewData();
    });

    //this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    if(!AppUtils.isNullObj(this.viewDataChangedSub)){
      this.viewDataChangedSub.unsubscribe();
    }


  }

  /**
   * 切换店铺 组件回调
   * @param simpleStore
   */
  toggleStore(simpleStore:SimpleStore){
    DataSynCtrl.Instance.clear();//清空同步数据
    this.service.toggleStore(simpleStore.id);
  }

}

export class MainService{

  constructor(private storeMgr:StoreMgr,
              private storeSynDataHolder:StoreSynDataHolder,
              //private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private mainViewDataMgr:MainViewDataMgr,
              ){}

  public initViewData(){
    this.buildViewData((viewDataP:MainViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.mainViewDataMgr.setMainViewData(viewDataP);
  }

  /**
   * 切换店铺
   * @param storeId
   * @returns {Promise<void>}
   */
  public async toggleStore(storeId){
    let viewDataTmp:MainViewData = new MainViewData();
    let buserId = SessionUtil.getInstance().getUserId();
    let store:Store = await this.storeSynDataHolder.getData(storeId);
    if (store && (store.bossId == buserId)) {//老板
      let userPermData:UserPermData = StoreAdminUtil.buildBossUserPermData();
      viewDataTmp.userPermData = userPermData;
      SessionUtil.getInstance().setUserPermData(userPermData);
    } else if(store && store.clerkInfoId){
      //获取storeClerkInfo信息
      //let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(store.clerkInfoId);
      let storeClerkInfo = null;
      let userPermData:UserPermData = StoreAdminUtil.buildUserPermData(storeClerkInfo);
      viewDataTmp.userPermData = userPermData;
      SessionUtil.getInstance().setUserPermData(userPermData);
    }

    /**************************组装mainHeader数据************************/
    let buser:BUser = await this.buserMgr.getBUser(buserId);
    viewDataTmp.userName = buser.name;
    if(buser.headImg){
      viewDataTmp.imgUrl = SessionUtil.getInstance().getImgPreUrl()+buser.headImg;
    }
    if(buser.roleSet && AppUtils.arrayContains(buser.roleSet,"0")){
      viewDataTmp.userRole = "管理者";
    }else{
      viewDataTmp.userRole = "工作者";
    }
    //店铺
    viewDataTmp.storeName = SessionUtil.getInstance().getStoreName();
    viewDataTmp.storeList = SessionUtil.getInstance().getSimpleStoreList();
    /**************************组装mainHeader数据************************/

    this.handleViewData(viewDataTmp);

    //验证会员到期时间
    let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP*30;
    if (buserId && store && store.bossId && store.bossId == buserId) {//老板
      if(buser.expiredTime && buser.expiredTime > nextMonthTime){//大于30天
        SessionUtil.getInstance().setIsExpired(false);
        AppRouter.goHome();
      }else{
        AppRouter.goExpired();
      }
    } else {//员工
      let boss = await this.buserMgr.getBUser(store.bossId);
      if(boss && boss.expiredTime && boss.expiredTime > nextMonthTime){
        SessionUtil.getInstance().setIsExpired(false);
        AppRouter.goHome();
      }else{
        AppRouter.goExpired();
      }
    }
  }

  private async buildViewData(callback: (viewDataP: MainViewData) => void) {
    let viewDataTmp:MainViewData = new MainViewData();
    let buserId = SessionUtil.getInstance().getUserId();
    await this.initStoreList(buserId);
    let storeId = SessionUtil.getInstance().getStoreId();
    let store:Store;
    if(storeId){
      store = await this.storeSynDataHolder.getData(storeId);
    }
    if (store && (store.bossId == buserId)) {//老板
      let userPermData:UserPermData = StoreAdminUtil.buildBossUserPermData();
      viewDataTmp.userPermData = userPermData;
      SessionUtil.getInstance().setUserPermData(userPermData);
    } else if(store && store.clerkInfoId){
      //获取storeClerkInfo信息
      //let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(store.clerkInfoId);
      let storeClerkInfo = null;
      if(storeClerkInfo){
        let userPermData:UserPermData = StoreAdminUtil.buildUserPermData(storeClerkInfo);
        viewDataTmp.userPermData = userPermData;
        SessionUtil.getInstance().setUserPermData(userPermData);
      }
    }

    /**************************组装mainHeader数据************************/
    let buser:BUser;
    if(!AppUtils.isNullOrWhiteSpace(buserId)){
      buser = await this.buserMgr.getBUser(buserId);
      viewDataTmp.userName = buser.name;
      if(buser.headImg){
        viewDataTmp.imgUrl = SessionUtil.getInstance().getImgPreUrl()+buser.headImg;
      }
      if(buser.roleSet && AppUtils.arrayContains(buser.roleSet,"0")){
        viewDataTmp.userRole = "管理者";
      }else{
        viewDataTmp.userRole = "工作者";
      }
      //店铺
      viewDataTmp.storeName = SessionUtil.getInstance().getStoreName();
      viewDataTmp.storeList = SessionUtil.getInstance().getSimpleStoreList();
    }
    /**************************组装mainHeader数据************************/
    if(AppUtils.isNullOrWhiteSpace(storeId)){//无店铺
      if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "0")){
        let userPermData:UserPermData = StoreAdminUtil.buildNoStoreUserPermData(true);
        viewDataTmp.userPermData = userPermData;
      }else{
        let userPermData:UserPermData = StoreAdminUtil.buildNoStoreUserPermData(false);
        viewDataTmp.userPermData = userPermData;
      }
    }

    callback(viewDataTmp);
}

  /**
   * 加载店铺列表
   * @param buserId
   */
  public async initStoreList(buserId){
      let pageItemCount = 100;
      let pageNo = 1;
      let findType = StoreFindTypeEnum.All;
      let storeList:Array<Store> = await this.storeMgr.getByUser(buserId,pageItemCount,pageNo,findType.toString());
      if(storeList instanceof Array && storeList.length>0){
        let storeMap:ZmMap<SimpleStore> = new ZmMap<SimpleStore>();
        storeList.forEach((item) =>{
          let simpleStore = new SimpleStore();
          simpleStore.id = item.id;
          simpleStore.name = item.name;
          storeMap.put(simpleStore.id,simpleStore);
        })
        let storeArr = storeMap.values();
        let storeId = SessionUtil.getInstance().getStoreId();
        if(!AppUtils.isNullOrWhiteSpace(storeId)){//当前店铺
          let storeName = storeMap.get(storeId)?storeMap.get(storeId).name:"";
          let storeData = StoreData.newInstance();
          storeData.setStoreId(storeId);
          storeData.setStoreName(storeName);
          storeData.setSimpleStoreList(storeArr);
          SessionUtil.getInstance().setStoreData(storeData);
        }else{//没有当前店铺 默认取第一家
          let storeData = StoreData.newInstance();
          storeData.setStoreId(storeArr[0].id);
          storeData.setStoreName(storeArr[0].name);
          storeData.setSimpleStoreList(storeArr);
          SessionUtil.getInstance().setStoreData(storeData);
        }
      }
    }

}

export class MainViewData{

  public userName:string = "";
  public imgUrl:string = "";
  public userRole:string = "";

  //店铺
  public storeName:string = "智美通";
  public storeList:Array<SimpleStore> = new Array<SimpleStore>();

  public userPermData:UserPermData;

  constructor(){
  }
}


export class StoreAdminUtil{

  public static buildUserPermData(storeClerkInfo):UserPermData {
    let permSet:Array<number> = StoreAdminUtil.getPermSet(storeClerkInfo);
    let userPermData:UserPermData = StoreAdminUtil.getUserPermData(permSet);
    return userPermData;
  }

  /**
   * 获取员工所在店铺权限
   * @param storeClerkInfo
   * @returns {Array<number>}
   */
  public static getPermSet(storeClerkInfo):Array<number> {
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
              // if (role.state == StoreAdminRoleState.Available && role.id == roleId && role.permSet) {
              //   permSet = AppUtils.addAll(permSet, role.permSet);
              // }
            }
          })
        }
      }
    }
    //权限enum去重
    permSet = AppUtils.uniquelize(permSet);
    return permSet;
  }

  private static getUserPermData(permSet:Array<number>):UserPermData{
    let userPermData:UserPermData = new UserPermData();
    for(let index in permSet){
      let permS = permSet[index];
      let perm = parseInt(permS.toString());
      switch (perm){
        // case StoreAdminPermEnum.CLERK_ADMIN:
        //   userPermData.isClerkAdmin = true;
        //   break;
        // case StoreAdminPermEnum.PRODUCT_ADMIN:
        //   userPermData.isProductAdmin = true;
        //   break;
        // case StoreAdminPermEnum.APPOINTMENT_ADMIN:
        //   userPermData.isAppointmentAdmin = true;
        //   break;
        // case StoreAdminPermEnum.SALARY_ADMIN:
        //   userPermData.isSalaryAdmin = true;
        //   break;
        // case StoreAdminPermEnum.LEAGUER_ADMIN:
        //   userPermData.isLeaguerAdmin = true;
        //   break;
        // case StoreAdminPermEnum.ORDER_ADMIN:
        //   userPermData.isOrderAdmin = true;
        //   break;
        // case StoreAdminPermEnum.CASHIER_ADMIN:
        //   userPermData.isCashierAdmin = true;
        //   break;
        // case StoreAdminPermEnum.MATERIAL_ADMIN:
        //   userPermData.isMaterialAdmin = true;
        //   break;
        // case StoreAdminPermEnum.REPORT_ADMIN:
        //   userPermData.isReportAdmin = true;
        //   break;
        // case StoreAdminPermEnum.CARD_ADMIN:
        //   userPermData.isCardAdmin = true;
        //   break;
        // case StoreAdminPermEnum.GOODS_ADMIN:
        //   userPermData.isGoodsAdmin = true;
        //   break;
        // case StoreAdminPermEnum.BONUS_ADMIN:
        //   userPermData.isBonusAdmin = true;
        //   break;
        // case StoreAdminPermEnum.PURCHASE_ADMIN:
        //   userPermData.isPurchaseAdmin = true;
        //   break;
        // case StoreAdminPermEnum.RECHARGE_ADMIN:
        //   userPermData.isRechargeAdmin = true;
        //   break;
        // case StoreAdminPermEnum.DEVICE_ADMIN:
        //   userPermData.isDeviceAdmin = true;
        //   break;
      }
    }
    return userPermData;
  }

  public static buildBossUserPermData():UserPermData {
    let userPermData:UserPermData = new UserPermData();
    userPermData.isBoss = true;
    //boss加载所有模块
    userPermData.isClerkAdmin = true;
    userPermData.isProductAdmin = true;
    userPermData.isAppointmentAdmin = true;
    userPermData.isSalaryAdmin = true;
    userPermData.isLeaguerAdmin = true;
    userPermData.isOrderAdmin = true;
    userPermData.isCashierAdmin = true;
    userPermData.isMaterialAdmin = true;
    userPermData.isReportAdmin = true;
    userPermData.isCardAdmin = true;
    userPermData.isGoodsAdmin = true;
    userPermData.isBonusAdmin = true;
    userPermData.isPurchaseAdmin = true;
    userPermData.isRechargeAdmin = true;
    userPermData.isDeviceAdmin = true;
    return userPermData;
  }

  public static buildNoStoreUserPermData(isBoss:boolean):UserPermData {
    let userPermData:UserPermData = new UserPermData();
    userPermData.isBoss = isBoss;
    return userPermData;
  }


}
