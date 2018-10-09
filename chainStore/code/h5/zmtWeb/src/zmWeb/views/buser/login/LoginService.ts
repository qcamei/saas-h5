import {SimpleStore, UserData, CurrentStore, StoreData, RoleData} from "../../../comModule/session/SessionData";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LoginResp} from "../../../bsModule/buser/apiData/LoginResp";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {StoreFindTypeEnum} from "../../../bsModule/store/apiData/StoreFindTypeEnum";
import {Constants} from "../../common/Util/Constants";
import {BUserLoginApiForm} from "../../../bsModule/buser/apiData/BUserLoginApiForm";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {Store} from "../../../bsModule/store/apiData/Store";
import {BUserRoleMgr} from "../../../bsModule/buserRole/buserRoleMgr";
import {BUserRole} from "../../../bsModule/buserRole/data/BuserRole";


export class LoginService {

  constructor(private buserMgr: BUserMgr,
              private storeMgr: StoreMgr,
              private buserSynDataHolder: BUserSynDataHolder,
              private storeSynDataHolder: StoreSynDataHolder,
              private buserRoleMgr:BUserRoleMgr,) {}

  /**
   * @param phone
   * @param password
   * @param loginCallback()
   */

  public async login(phone, password, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let buserLoginApiForm = new BUserLoginApiForm();
    buserLoginApiForm.phone = phone;
    buserLoginApiForm.password = password;

    let restResp = await this.buserMgr.login(buserLoginApiForm);
    if (restResp && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      let user = loginResp.buser;
      SessionUtil.getInstance().clearData();//清空缓存数据
      this.setUserData(user,loginResp);
      AppRouter.goHome();

      //判断账户是否过期 是否有店铺 可否进入菜单主页
      // let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP*30;
      // if(user.expiredTime && user.expiredTime <= nextMonthTime){
      //   AppRouter.goExpired();
      // }else{
      //   if(user.storeIdSet && user.storeIdSet.length>0){//有店铺
      //     AppRouter.goHome();
      //   }else{//没有店铺
      //     if (user.roleSet && AppUtils.arrayContains(user.roleSet, "0")){
      //       AppRouter.goBossAddStore();
      //     }else{
      //
      //     }
      //   }
      // }

      //请求用户相关店铺
      // let pageItemCount = user.storeIdSet?user.storeIdSet.length:100;
      // let pageNo = 1;
      // let findType = StoreFindTypeEnum.All;
      // let storeList = await this.storeMgr.getByUser(user.id, pageItemCount, pageNo, findType.toString());
      // let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP*30;
      // if (user && storeList.length > 0) {//用户已有相关店铺
      //   //设置用户相关店铺列表
      //   let storeArr: Array<SimpleStore> = this.getSimpleStore(storeList);
      //   this.setStoreData(storeArr);
      //
      //   //验证会员过期
      //   let storeId = SessionUtil.getInstance().getStoreId();
      //   let store = await this.storeSynDataHolder.getData(storeId);
      //   let bossId = "";
      //
      //   if(store && store.bossId && store.bossId == user.id){//老板
      //     bossId = user.id;
      //     if(user.expiredTime && user.expiredTime <= nextMonthTime){
      //       AppRouter.goExpired();
      //     }else{
      //       AppRouter.goHome();
      //     }
      //   }else{//员工
      //     let boss:BUser = await this.buserSynDataHolder.getData(store.bossId);
      //     if(boss){
      //       bossId = boss.id;
      //     }
      //     if(boss && boss.expiredTime && boss.expiredTime <= nextMonthTime){
      //       AppRouter.goExpired();
      //     }else{
      //       AppRouter.goHome();
      //     }
      //   }
      //   if(!AppUtils.isNullOrWhiteSpace(bossId)){
      //     let buserRole = await this.buserRoleMgr.getBUserRole(bossId);
      //     this.setRoleData(buserRole);
      //   }
      //
      // }else{//用户暂无店铺
      //   if(user.roleSet && AppUtils.arrayContains(user.roleSet, "2")){
      //     AppRouter.goExpired();
      //   }else if (user.roleSet && AppUtils.arrayContains(user.roleSet, "0")) {//老板角色跳转开店铺页面
      //     if(user.expiredTime && user.expiredTime <= nextMonthTime){
      //       AppRouter.goExpired();
      //     }else{
      //       AppRouter.goBossAddStore();
      //     }
      //   }
      // }
    }
    loginCallBack(loginSuccess);
  }

  /**
   * 设置用户数据
   */
  private setUserData(user:BUser,loginResp:LoginResp){
    let userData = UserData.newInstance(user.id,user.name);
    userData.setAccessToken(loginResp.token);
    SessionUtil.getInstance().setUserData(userData);
  }

  /**
   * 组装店铺列表
   * @param storeList
   * @returns {Array<SimpleStore>}
   */
  private getSimpleStore(storeList: Array<Store>): Array<SimpleStore> {
    let storeArr: Array<SimpleStore> = storeList.map((item:Store) => {
      let simpleStore = SimpleStore.newInstance(item.id,item.name,item.bossId);
      return simpleStore;
    });
    return storeArr;
  }

  /**
   * 设置店铺数据
   * @param storeArr
   */
  private setStoreData(storeArr:Array<SimpleStore>){
    //设置当前店铺 默认取第一家
    // let storeData = StoreData.newInstance();
    // let currentStore = CurrentStore.newInstance(storeArr[0].id,storeArr[0].name,storeArr[0].bossId);
    // storeData.setCurrentStore(currentStore);
    // storeData.setSimpleStoreList(storeArr);
    // SessionUtil.getInstance().setStoreData(storeData);
  }

  /**
   * 设置用户数据
   */
  private setRoleData(buserRole:BUserRole){
    if(!AppUtils.isNullObj(buserRole)){
      let roleData = RoleData.newInstance(buserRole.buserId,buserRole.vipContent);
      SessionUtil.getInstance().setRoleData(roleData);
    }
  }

}
