import {Component, OnInit} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUserLoginApiForm} from "../../../bsModule/buser/apiData/BUserLoginApiForm";
import {SessionUtil} from "../../../comModule/SessionUtil";
import {LoginResp} from "../../../bsModule/buser/apiData/LoginResp";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {ZmToasterCfg} from "../../../comModule/Toaster";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreFindTypeEnum} from "../../../bsModule/store/apiData/StoreFindTypeEnum";
import {Store} from "../../../bsModule/store/apiData/Store";
import {UserData, StoreData, SimpleStore} from "../../../comModule/UserData";
import {Constants} from "../../common/Util/Constants";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";


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
                                   placeholder="请输入手机号" class="c-login-input" name="phone" #phone="ngModel" 
                                   [(ngModel)] = "user.phone" [ngClass]="{'form-valid-error':phone.invalid && (phone.touched)}" (focus)="vacancy()">
                                    </div>
                                    <div  class="c-login-error">
                                        <!--<div class="text-danger" *ngIf="phone.invalid && (phone.touched)" >-->
                                              <!--<div  *ngIf="phone.errors.required">-->
                                               <!--手机号不能为空-->
                                              <!--</div>-->
                                              <!--<div *ngIf="phone.errors.pattern">-->
                                                <!--手机号格式错误!-->
                                              <!--</div>-->
                                        <!--</div>-->
                                     </div>
                                    <div class="input-group  form-group ">
                                    <img src="assets/images/icon/password_hig.png" alt="" class="pos-a" style="left:13px;z-index:12;">
                                        <input type="password" 
                                        [ngClass]="{'form-valid-error':password.invalid && (password.touched)}"
                                        placeholder="请输入密码" required class=" c-login-input" name ="password"   
                                        pattern="^\\s*([\\da-zA-Z]{6,16})\\s*$"
                                        #password="ngModel" [(ngModel)] = "user.password " (focus)="vacancy()" />
                                    </div>
                                    <div class="c-login-error">
                                      <!--<div class="text-danger" *ngIf="password.invalid && (password.touched)" >-->
                                      <!---->
                                        <!--<div *ngIf="password.errors.required">-->
                                          <!--密码不能为空-->
                                        <!--</div>-->
                                        <!--<div *ngIf="password.errors.pattern">-->
                                          <!--密码为6-16位数字或字母!-->
                                        <!--</div>-->
                                      <!--</div>-->
                                     </div>
                                    <div class="forgePwd mg-b-20">
                                        <nb-checkbox class="font-c5"  name="checkBox" #checkBox = "ngModel" [(ngModel)] = "rmbPhone">记住账号
                                        </nb-checkbox>
                                          <span class="pull-right c-login-pwd font-c5" 
                                          [routerLink] = "['/resetPwd']">忘记密码？</span>
                                    </div>
                                    <button class="btn  c-btn-blue btn-block fz-18" style="height: 48px;padding:0;" id="loginBtn" [disabled]="!myForm.valid" (click) ="login()" [ngClass]="{'btn-valid-error':btnStatu.btnClass}">登录</button>
                                      <div class="c-input-error font-c3 text-center" style="line-height: 30px;" >{{btnStatu.btnText}}</div>
                                  <div class="disFlex" style="justify-content: space-between;"> 
                                     <!--<div  class="cur-hand font-c5" [routerLink] = "['/addEUser']">体验账号</div>-->
                                       <!--<div class=" font-c5 ">还没有账号?-->
                                         <!--<span class="mg-l-10 cur-hand" [routerLink] = "['/selective']">注册</span>-->
                                       <!--</div>-->
                                  </div> 
                              </form>
                          </div>
                          
                </div>
                `,
  styleUrls: ['login.scss'],

})

export class LoginPage implements OnInit {
  constructor(private buserMgr: BUserMgr,
              private storeMgr: StoreMgr,
              private buserSynDataHolder: BUserSynDataHolder,
              private storeSynDataHolder: StoreSynDataHolder) {
    this.service = new LoginService(
      this.buserMgr,
      this.storeMgr,
      this.buserSynDataHolder,
      this.storeSynDataHolder);
  }
  private service: LoginService;

  public user: BUser = new BUser();
  public rmbPhone: boolean = true;
  public btnStatu = {btnClass: false, btnText: ''};//按钮验证
  public toasterCfg = ZmToasterCfg.center;//吐司弹出位置

  ngOnInit(): void {
    let phone = SessionUtil.getInstance().getPhone();//记住账号
    this.user.phone = phone;
    if(phone == Constants.EXPERIENCE_PHONE){
      this.user.phone = null;
    }

  }


  /**
   * 登录点击事件
   */
  public login() {
    let phone = AppUtils.trimBlank(this.user.phone);
    let password = AppUtils.trimBlank(this.user.password);
    this.service.login(phone, password, (successTmp) => {
      //记住账号
      this.rmbAccount(phone);
      //请求店铺 并持久化
      if(successTmp){
        this.handleResult(successTmp);
      }else{
        this.handleResult(successTmp);
      }
    });
  }

  /**记住账号*/
  private rmbAccount(phone) {
    if (this.rmbPhone) {
      SessionUtil.getInstance().setPhone(phone);
    } else {
      localStorage.removeItem("phone");
    }
  }

  private handleResult(successP: boolean) {
    if (successP) {
      AppUtils.showSuccess("提示", "登录成功");
    } else {
      this.btnStatu.btnClass = true;
      this.btnStatu.btnText = "账号密码错误";
      AppUtils.showError("提示", "账号密码错误");
    }

  }

  public vacancy() {
    this.btnStatu.btnClass = false;
    this.btnStatu.btnText = "";
  }

}


class LoginService {

  constructor(private buserMgr: BUserMgr,
              private storeMgr: StoreMgr,
              private buserSynDataHolder: BUserSynDataHolder,
              private storeSynDataHolder: StoreSynDataHolder) {
  }


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
    if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      let user = loginResp.buser;
      this.setUserData(user,loginResp);

      //请求用户相关店铺
      let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP*30;
      if (user && user.storeIdSet && user.storeIdSet.length > 0) {//用户已有相关店铺
        let pageItemCount = user.storeIdSet.length;
        let pageNo = 1;
        let findType = StoreFindTypeEnum.All;
        let storeList = await this.storeMgr.getByUser(user.id, pageItemCount, pageNo, findType.toString());
        //设置用户相关店铺列表
        let storeArr: Array<SimpleStore> = this.getSimpleStore(storeList);
        this.setStoreData(storeArr);

        //验证会员过期
        let storeId = SessionUtil.getInstance().getStoreId();
        let store = await this.storeSynDataHolder.getData(storeId);
        if(store && store.bossId && store.bossId == user.id){//老板
          if(user.expiredTime && user.expiredTime <= nextMonthTime){
            AppRouter.goExpired();
          }else{
            AppRouter.goHome();
          }
        }else{//员工
          let boss = await this.buserSynDataHolder.getData(store.bossId);
          if(boss && boss.expiredTime && boss.expiredTime <= nextMonthTime){
            AppRouter.goExpired();
          }else{
            AppRouter.goHome();
          }
        }
      }else{//用户暂无店铺
        if (user.roleSet && AppUtils.arrayContains(user.roleSet, "0")) {//老板角色跳转开店铺页面
          if(user.expiredTime && user.expiredTime <= nextMonthTime){
            AppRouter.goExpired();
          }else{
            AppRouter.goBossAddStore();
          }
        } else {//员工跳转申请加入店铺页面
          AppRouter.goClerkApplyStore();
        }
      }
    }
    loginCallBack(loginSuccess);
  }

  /**
   * 设置用户数据
   */
  private setUserData(user:BUser,loginResp:LoginResp){
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

