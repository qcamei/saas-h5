import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {EUserMgr} from "../../../bsModule/euser/EUserMgr";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {AddEUserViewData} from "./AddEUserViewData";
import {AppUtils} from "../../../comModule/AppUtils";
import {LoginResp} from "../../../bsModule/buser/apiData/LoginResp";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {UserData, SimpleStore, StoreData, CurrentStore} from "../../../comModule/session/SessionData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/apiData/Store";
import {RestResp} from "../../../comModule/RestResp";
import {StoreFindTypeEnum} from "../../../bsModule/store/apiData/StoreFindTypeEnum";
import {AppRouter} from "../../../comModule/AppRouter";

export class AddEUserService {

  constructor(private buserMgr: BUserMgr,
              private euserMgr: EUserMgr,
              private storeMgr: StoreMgr) {
  }


  public async initViewData(callBack: (viewDataTmp) => void) {
    let viewDataTmp = new AddEUserViewData();
    let phoneListTmp: Array<string> = new Array<string>();
    let euserList = await this.euserMgr.getList(9999, 1);
    for (let item of euserList) {
      if (!AppUtils.isNullOrWhiteSpace(item.phone)) {
        phoneListTmp.push(item.phone);
      }

    }
    viewDataTmp.euserList = euserList;
    viewDataTmp.phoneList = phoneListTmp;
    callBack(viewDataTmp);
  }

  public async loginWithTestPhone(buserLoginForm, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let restResp: RestResp = await this.buserMgr.loginWithTestPhone(buserLoginForm);
    if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      let user = loginResp.buser;
      this.setUserData(user,loginResp);
      AppRouter.goHome();

      // if (user && user.storeIdSet && user.storeIdSet.length > 0) {//用户已有相关店铺
      //   let pageItemCount = user.storeIdSet.length;
      //   let pageNo = 1;
      //   let findType = StoreFindTypeEnum.All;
      //   let storeList = await this.storeMgr.getByUser(user.id, pageItemCount, pageNo, findType.toString());
      //   //设置用户相关店铺列表
      //   let storeArr: Array<SimpleStore> = this.getSimpleStore(storeList);
      //   this.setStoreData(storeArr);
      //   AppRouter.goHome();
      // }else{//用户暂无店铺
      //   if(user.roleSet && AppUtils.arrayContains(user.roleSet, "2")){
      //     AppRouter.goExpired();
      //   }else if(user.roleSet && AppUtils.arrayContains(user.roleSet, "0")) {//老板角色跳转开店铺页面
      //     AppRouter.goBossAddStore();
      //   }
      // }
      loginCallBack(loginSuccess);
    }
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
  private setStoreData(storeArr: Array<SimpleStore>) {
    //设置当前店铺 默认取第一家
    // let storeData = StoreData.newInstance();
    // let currentStore = CurrentStore.newInstance(storeArr[0].id,storeArr[0].name,storeArr[0].bossId);
    // storeData.setCurrentStore(currentStore);
    // storeData.setSimpleStoreList(storeArr);
    // SessionUtil.getInstance().setStoreData(storeData);
  }
}
