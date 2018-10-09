import {Component, OnInit} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {LoginViewData} from "./LoginViewData";
import {LoginService} from "./LoginService";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {IonicPage} from "ionic-angular";
@IonicPage({
  name:"loginPage",
  segment: 'login'
})
@Component({
  template: `
  <!--<zm-modal-header title="" [cancel]=""></zm-modal-header>-->

      <ion-content padding class="animated">
        <div class="login-contents">
      <h3 style="padding-left:24px;font-size:18px;" text-theme>登录</h3>
        <zm-login-phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" ></zm-login-phone>
        <!--<zm-login-password [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" (keyup)="isEnter($event)"></zm-login-password>-->
        <zm-login-vCode [(zmValue)]="viewData.formData.vCode"  [(zmPass)]="viewData.formData.vCodePass"
                  [phone]="viewData.formData.phone" [phonePass]="viewData.formData.phonePass"
                  (valueChecked)="viewData.formData.check()" [zmCheckMark] = "viewData.formData.vCode"></zm-login-vCode>
        <div style="margin-top:30px;">
        <ion-grid>
           
            <ion-row>
                    <button ion-button icon-start block color="primary" tappable  (click)="loginByCode()">
                      <!--<ion-icon name="log-in"></ion-icon>-->
                      登录
                    </button>
            </ion-row>
        </ion-grid>
        <p text-center>点击“登录”即表示您同意协议：</p>
        <p text-center style="color:#4678FA;" (click)="goProtocolPage()"> 《智美预约用户协议》</p>
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
  constructor() {
    this.service = new LoginService();
  }
  private service: LoginService;
  public viewData:LoginViewData = new LoginViewData();

  ngOnInit(): void {

    //初始化环境配置
    this.viewData = this.buildViewData();

  }

  private buildViewData():LoginViewData{
    let viewData:LoginViewData = new LoginViewData();

    return viewData;
  }

  isEnter(event){

    let isEnterKey = (event.keyCode == 13);
    if(isEnterKey){
      this.loginByCode();
    }
  }


  /**
   * 登录点击事件
   */
  public loginByCode() {
      let phone = this.getPhone();
      let vCode = this.getVCode();
      this.service.loginByCode(phone, vCode, (successTmp) => {
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

  // private getPassword(){
  //   let password = "";
  //   let passwordTmp = this.viewData.formData.password;
  //   if(!AppUtils.isNullOrWhiteSpace(passwordTmp)){
  //     password = AppUtils.trimBlank(passwordTmp);
  //   }
  //   return password;
  // }

  private getVCode(){
    let vCode = "";
    let vCodeTmp = this.viewData.formData.vCode;
    if(!AppUtils.isNullOrWhiteSpace(vCodeTmp)){
      vCode = AppUtils.trimBlank(vCodeTmp);
    }
    return vCode;
  }

  private handleResult(successP: boolean) {
    if (successP) {
        AppRouter.getInstance().goMain();
    }else{
      this.viewData.formData.setSubmitErrorMsg("账号验证码错误");
      AppUtils.showError("提示", "账号验证码错误");
    }

  }

  public clearSubmitError() {
    this.viewData.formData.setSubmitErrorMsg(null);
  }

  goProtocolPage(){
    AppRouter.getInstance().goProtocolPage();
  }
}

