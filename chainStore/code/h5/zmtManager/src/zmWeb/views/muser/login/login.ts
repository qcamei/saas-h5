import {Component, OnInit} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {MUser} from "../../../bsModule/muser/apiData/MUser";
import {MUserMgr} from "../../../bsModule/muser/MUserMgr";
import {MUserLoginApiForm} from "../../../bsModule/muser/apiData/MUserLoginApiForm";
import {SessionUtil} from "../../../comModule/SessionUtil";
import {LoginResp} from "../../../bsModule/muser/apiData/LoginResp";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {ZmToasterCfg} from "../../../comModule/Toaster";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreFindTypeEnum} from "../../../bsModule/store/apiData/StoreFindTypeEnum";
import {Store} from "../../../bsModule/store/apiData/Store";
import {UserData, StoreData, SimpleStore} from "../../../comModule/UserData";
import {Constants} from "../../common/Util/Constants";
import {MUserSynDataHolder} from "../../../bsModule/muser/MUserSynDataHolder";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {AppCfg} from "../../../comModule/AppCfg";


@Component({
  template: `
<toaster-container [toasterconfig]="toasterCfg"></toaster-container>
            <div class="c-login-body ">
                      <div class="c-login">
                          <div class="c-login-title text-center">
                            <img src="assets/images/c_logo.png" style="width: 100%;" />       
                          </div>
                              <form #myForm="ngForm">
                                    <div class="input-group  form-group">
                                    <img src="assets/images/icon/phone_hig.png" alt="" class="pos-a"  style="left:13px;z-index:12;">
                                         <input    type="text" required 
                                   pattern="^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$"
                                   placeholder="请输入账号" class="c-login-input" name="account" #account="ngModel" 
                                   [(ngModel)] = "user.account" [ngClass]="{'form-valid-error':account.invalid && (account.touched)}" (focus)="vacancy()">
                                    </div>
                                    <!--<div  class="c-login-error">-->
                                        <!--<div class="text-danger" *ngIf="account.invalid && (account.touched)" >-->
                                              <!--<div  *ngIf="account.errors.required">-->
                                               <!--账号不能为空-->
                                              <!--</div>-->
                                              <!--<div *ngIf="account.errors.pattern">-->
                                                <!--账号格式错误!-->
                                              <!--</div>-->
                                        <!--</div>-->
                                     <!--</div>-->
                                    <div class="input-group  form-group ">
                                    <img src="assets/images/icon/password_hig.png" alt="" class="pos-a" style="left:13px;z-index:12;">
                                        <input type="password" 
                                        [ngClass]="{'form-valid-error':password.invalid && (password.touched)}"
                                        placeholder="请输入密码" required class=" c-login-input" name ="password"   
                                        pattern="^\\s*([\\da-zA-Z]{6,16})\\s*$"
                                        #password="ngModel" [(ngModel)] = "user.password " (focus)="vacancy()" />
                                    </div>
                                    <!--<div class="c-login-error">-->
                                      <!--<div class="text-danger" *ngIf="password.invalid && (password.touched)" >-->
                                      <!---->
                                        <!--<div *ngIf="password.errors.required">-->
                                          <!--密码不能为空-->
                                        <!--</div>-->
                                        <!--<div *ngIf="password.errors.pattern">-->
                                          <!--密码为6-16位数字或字母!-->
                                        <!--</div>-->
                                      <!--</div>-->
                                     <!--</div>-->
                                    <div class="forgePwd mg-b-20">
                                        <nb-checkbox class="font-c5"  name="checkBox" #checkBox = "ngModel" [(ngModel)] = "rmbPhone">记住账号
                                        </nb-checkbox>
                                          <!--<span class="pull-right c-login-pwd font-c5" -->
                                          <!--[routerLink] = "['/resetPwd']">忘记密码？</span>-->
                                    </div>
                                    <button class="btn  c-btn-blue btn-block fz-18" style="height: 48px;padding:0;" id="loginBtn"  (click) ="login()" [ngClass]="{'btn-valid-error':btnStatu.btnClass}">登录</button>
                                      <div class="c-input-error font-c3 text-center" style="line-height: 30px;" >{{btnStatu.btnText}}</div>
                                  <!--<div class="disFlex" style="justify-content: space-between;"> -->
                                     <!--<div  class="cur-hand font-c5" [routerLink] = "['/addEUser']">体验账号</div>-->
                                       <!--<div class=" font-c5 ">还没有账号?-->
                                         <!--<span class="mg-l-10 cur-hand" [routerLink] = "['/selective']">注册</span>-->
                                       <!--</div>-->
                                  <!--</div> -->
                              </form>
                          </div>
                          
                </div>
                `,
  styleUrls: ['login.scss'],

})

export class LoginPage implements OnInit {
  constructor(private muserMgr: MUserMgr,
              private storeMgr: StoreMgr,
              private muserSynDataHolder: MUserSynDataHolder,
              private storeSynDataHolder: StoreSynDataHolder) {
    this.service = new LoginService(
      this.muserMgr,
      this.storeMgr,
      this.muserSynDataHolder,
      this.storeSynDataHolder);
  }
  private service: LoginService;

  public user: MUser = new MUser();
  public rmbPhone: boolean = true;
  public btnStatu = {btnClass: false, btnText: ''};//按钮验证
  public toasterCfg = ZmToasterCfg.center;//吐司弹出位置

  ngOnInit(): void {
    let account = SessionUtil.getInstance().getPhone();//记住账号
    this.user.account = account;
    if(account == Constants.EXPERIENCE_PHONE){
      this.user.account = null;
    }
    SessionUtil.initEnv();
  }


  /**
   * 登录点击事件
   */
  public login() {
    let account = AppUtils.trimBlank(this.user.account);
    let password = AppUtils.trimBlank(this.user.password);

    this.service.login(account, password, (successTmp) => {
      //记住账号
      this.rmbAccount(account);
      //处理结果
      if (successTmp) {
        AppUtils.showSuccess("提示", "登录成功");
        //如果是体验账号管理员,则切换到体验环境
        if(account==Constants.ADMIN_EXPERIENCE){
          SessionUtil.switchToExperienceEnv();
        }
      } else {
        this.btnStatu.btnClass = true;
        this.btnStatu.btnText = "账号密码错误";
        AppUtils.showError("提示", "账号密码错误");
      }
    });
  }

  /**记住账号*/
  private rmbAccount(account) {
    if (this.rmbPhone) {
      SessionUtil.getInstance().setPhone(account);
    } else {
      localStorage.removeItem("account");
    }
  }

  public vacancy() {
    this.btnStatu.btnClass = false;
    this.btnStatu.btnText = "";
  }

}


class LoginService {

  constructor(private muserMgr: MUserMgr,
              private storeMgr: StoreMgr,
              private muserSynDataHolder: MUserSynDataHolder,
              private storeSynDataHolder: StoreSynDataHolder) {
  }


  /**
   * @param account
   * @param password
   * @param loginCallback()
   */

  public async login(account, password, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let muserLoginApiForm = new MUserLoginApiForm();
    muserLoginApiForm.account = account;
    muserLoginApiForm.password = password;

    let restResp = await this.muserMgr.login(muserLoginApiForm);
    if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      let user = loginResp.muser;
      this.setUserData(user,loginResp);

      AppRouter.goMain();
    }

    loginCallBack(loginSuccess);
  }

  /**
   * 设置用户数据
   */
  private setUserData(user:MUser,loginResp:LoginResp){
    let userData = UserData.newInstance();
    userData.setUserId(user.id);
    userData.setUserName(user.name);
    userData.setAccessToken(loginResp.token);
    SessionUtil.getInstance().setUserData(userData);
  }

  /**
   * 组装店铺列表
   * @param storeList
   * @returns {Array<SimpleStore>}
   */
  private getSimpleStore(storeList: Array<Store>): Array<SimpleStore> {
    let storeArr: Array<SimpleStore> = storeList.map((item) => {
      let simpleStore = new SimpleStore();
      simpleStore.id = item.id;
      simpleStore.name = item.name;
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
    let storeData = StoreData.newInstance();
    storeData.setStoreId(storeArr[0].id);
    storeData.setStoreName(storeArr[0].name);
    storeData.setSimpleStoreList(storeArr);
    SessionUtil.getInstance().setStoreData(storeData);
  }

}

