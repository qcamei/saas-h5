import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainUserMgr} from "../../../bsModule/chainUser/ChainUserMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {ChainUserLoginForm} from "../../../bsModule/chainUser/apiData/ChainUserLoginForm";
import {LoginResp} from "../../../bsModule/chainUser/apiData/LoginResp";
import {ChainUser} from "../../../bsModule/chainUser/data/ChainUser";
import {UserData, CurrentChain} from "../../../comModule/session/SessionData";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {ChainStoreUserRelative} from "../../../bsModule/chainUser/data/ChainStoreUserRelative";
import {ChainUserRoleEnum} from "../../../bsModule/chainUser/data/ChainUserRoleEnum";


export class LoginService {

  constructor(private chainUserMgr: ChainUserMgr,
              private chainSynDataHolder: ChainSynDataHolder) {
  }


  /**
   * @param phone
   * @param password
   * @param loginCallback()
   */

  public async login(phone, password, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let loginForm = new ChainUserLoginForm();
    loginForm.phone = phone;
    loginForm.password = password;
    let restResp = await this.chainUserMgr.login(loginForm);
    if (restResp && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      let chainUser: ChainUser = new ChainUser();
      AppUtils.copy(chainUser,loginResp.chainUser);
      let chainSU = new ChainStoreUserRelative();
      if(chainUser){
        let chainSUMap:ZmMap<ChainStoreUserRelative> = chainUser.getChainSUMap();
        if(chainSUMap){
          chainSU = chainSUMap.values()[0];//1个连锁店的情况
        }
      }

      SessionUtil.getInstance().clearData();//清空缓存数据
      this.setUserData(chainUser, loginResp);

        //请求用户相关连锁店
        if (chainSU && chainSU.chainId) {//用户已有连锁店
          let chainId = chainSU.chainId;
          let chain:Chain = await this.chainSynDataHolder.getData(chainId);
          this.setCurrentChain(chain);
          AppRouter.goHome();
        }else{//用户无店
            AppRouter.goBossAddChain();
        }
    }
    loginCallBack(loginSuccess);
  }

  /**
   * 设置用户数据
   */
  private setUserData(user: ChainUser, loginResp: LoginResp) {
    let userData = UserData.newInstance(user.id, user.name);
    userData.setAccessToken(loginResp.token);
    SessionUtil.getInstance().setUserData(userData);
  }

  /**
   * 设置店铺数据
   * @param chainArr
   */
  private setCurrentChain(chain:Chain) {

    //设置当前店铺 默认取第一家
    let currentChain = CurrentChain.newInstance(chain.id, chain.name, chain.bossId);
    SessionUtil.getInstance().setCurrentChain(currentChain);
  }

}
