import {Component, OnInit} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {AppCfg} from "../../../comModule/AppCfg";
import {LoginViewData} from "./LoginViewData";
import {LoginService} from "./LoginService";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainUserMgr} from "../../../bsModule/chainUser/ChainUserMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";


@Component({
  template: `
           <div class="c-login-body ">
            <div class="c-login">
                      <div class="c-login-title text-center">
                          <img src="assets/images/c_logo.png" style="width: 100%;" />       
                      </div>
              <div class="tab-login">

                  <div class="tab-shop">
                      <span class="d-inline-block px-16 py-8 cur-hand"  (click)="goZmLogin()">店铺登录</span>
                      <span class="tab-shop-active d-inline-block px-16 py-8 cur-hand">总部登录</span>
                  </div>

                  <zm_login_phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" ></zm_login_phone>

                  <zm_login_password [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" (keyup)="isEnter($event)"></zm_login_password>
                      
                  <div class="mg-b-20 disFlex align-center">
                  <zm-input-checkbox   [(zmValue)]="viewData.rmbPhone" [lable]="'记住账号'"></zm-input-checkbox>
                       
                        <div class="flex text-right">
                              <span class=" c-login-pwd font-c5 cur-hand flex" 
                                                    [routerLink] = "['/resetPwd']" style="outline: none;">忘记密码？</span>
                        </div>
                  </div>
                      
                  <zm_login_button [text]=" '登录' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="login()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_login_button>
                                            
                    <!--<div class="disFlex"> -->
                              <!--<div class=" font-c5 flex text-right">还没有账号?-->
                                  <!--<span class="mg-l-10 cur-hand" [routerLink] = "['/reg']" style="outline: none;">注册</span>-->
                              <!--</div>-->
                    <!--</div>  -->
               </div>

             </div>
            </div>
                `,
  styleUrls: ['login.scss'],

})

export class LoginPage implements OnInit {
  constructor(private chainUserMgr: ChainUserMgr,
              private chainSynDataHolder: ChainSynDataHolder) {
    this.service = new LoginService(
      this.chainUserMgr,
      this.chainSynDataHolder);
  }

  private service: LoginService;
  public viewData: LoginViewData = new LoginViewData();

  ngOnInit(): void {

    //初始化环境配置
    AppCfg.getInstance().initEnv();
    this.viewData = this.buildViewData();
  }

  public goZmLogin() {
    location.href = AppCfg.getInstance().getStoreLoginAddress();
  }

  private buildViewData(): LoginViewData {
    let viewData: LoginViewData = new LoginViewData();
    let phone = SessionUtil.getInstance().getAccount();//记住账号
    if (!AppUtils.isNullOrWhiteSpace(phone)) {
      viewData.setOldAccount(phone);
    }
    return viewData;
  }

  isEnter(event) {

    let isEnterKey = (event.keyCode == 13);
    if (isEnterKey) {
      this.login();
    }
  }


  /**
   * 登录点击事件
   */
  public login() {
    let phone = AppUtils.trimBlank(this.viewData.formData.phone);
    let password = AppUtils.trimBlank(this.viewData.formData.password);
    this.service.login(phone, password, (successTmp) => {
      //记住账号
      this.rmbAccount(phone);

      if (successTmp) {
        this.handleResult(successTmp);
      } else {
        this.handleResult(successTmp);
      }
    });
  }


  /**记住账号*/
  private rmbAccount(phone) {
    if (this.viewData.rmbPhone) {
      SessionUtil.getInstance().setAccount(phone);
    } else {
      SessionUtil.getInstance().setAccount(null);
    }
  }

  private handleResult(successP: boolean) {
    if (successP) {
      AppUtils.showSuccess("提示", "登录成功");
    } else {
      this.viewData.formData.setSubmitErrorMsg("账号密码错误");
      AppUtils.showError("提示", "账号密码错误");
    }

  }

  public clearSubmitError() {
    this.viewData.formData.setSubmitErrorMsg(null);
  }
}

