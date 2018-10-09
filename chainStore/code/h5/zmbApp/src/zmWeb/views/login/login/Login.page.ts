import {Component, OnInit} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {LoginViewData} from "./LoginViewData";
import {LoginService} from "./LoginService";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {IonicPage} from "ionic-angular";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {BUserRoleMgr} from "../../../bsModule/buserRole/buserRoleMgr";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
@IonicPage({
  name:"loginPage",
  segment: 'login'
})
@Component({
  template: `

      <ion-content padding class="animated">
        <div class="login-contents">
      <h3 style="padding-left:24px;font-size:18px;" text-theme>登录</h3>
        <zm-login-phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" ></zm-login-phone>
        <zm-login-password [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" (keyup)="isEnter($event)"></zm-login-password>
      
        <div style="margin-top:30px;">
        <ion-grid>
           
            <ion-row>
                    <button ion-button icon-start block color="primary" tappable  (click)="login()">
                      登录
                    </button>
            </ion-row>
        </ion-grid>
        <p text-center>点击“登录”即表示您同意协议：</p>
        <p text-center style="color:#4678FA;" (click)="goProtocolPage()"> 《用户协议》</p>
      </div>
      
        </div>
      </ion-content>
     
                `,
      styles:[`
      .login-contents{
          padding-top:80px;
      }
     
      
      `]

})

export class LoginPage implements OnInit {
  private service: LoginService;
  public viewData:LoginViewData = new LoginViewData();

  constructor() {
    this.service = new LoginService();
  }

  ngOnInit(): void {

  }

  isEnter(event){
    let isEnterKey = (event.keyCode == 13);
    if(isEnterKey){
      this.login();
    }
  }


  /**
   * 登录点击事件
   */
  public login() {
    let phone = this.getPhone();
    let password = this.getPassword();
    this.service.login(phone, password, (successTmp) => {
        this.handleResult(successTmp);
    });
  }

  private getPhone(){
    let phone = "";
    let phoneTmp = this.viewData.formData.phone;
    if(!AppUtils.isNullOrWhiteSpace(phoneTmp)){
      phone = AppUtils.trimBlank(phoneTmp);
    }
    return phone;
  }

  private getPassword(){
    let password = "";
    let passwordTmp = this.viewData.formData.password;
    if(!AppUtils.isNullOrWhiteSpace(passwordTmp)){
      password = AppUtils.trimBlank(passwordTmp);
    }
    return password;
  }

  private handleResult(successP: boolean) {
    if (successP) {
        AppRouter.getInstance().goMain();
    }else{
      // this.viewData.formData.setSubmitErrorMsg("账号密码验证错误");
      AppUtils.showError("提示", "账号密码验证错误");
    }
  }

  public clearSubmitError() {
    this.viewData.formData.setSubmitErrorMsg(null);
  }

  goProtocolPage(){
    AppRouter.getInstance().goProtocolPage();
  }
}

