import {Component, OnInit} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/SessionUtil";
import {ZmToasterCfg} from "../../../comModule/Toaster";
import {UserData} from "../../../comModule/UserData";
import {ConfigService} from "../../../bsModule/config/ConfigService";
import {OPUserMgr} from "../../../bsModule/opUser/OPUserMgr";
import {OPUser} from "../../../bsModule/opUser/apiData/OPUser";
import {OPUserLoginApiForm} from "../../../bsModule/opUser/apiData/OPUserLoginApiForm.java";
import {LoginResp} from "../../../bsModule/buser/apiData/LoginResp";
import {AppRouter} from "../../../comModule/AppRouter";


@Component({
  template: `
<toaster-container [toasterconfig]="toasterCfg"></toaster-container>
     <div class="c-login-body ">
         <div class="c-login">
             <div class="c-login-title text-center">
                  <img src="assets/images/c_logo.png" style="width: 100%;" />       
             </div>
             <form #myForm="ngForm">
                  <div class="input-group  form-group pos-r">
                      <input  type="text" required placeholder="请输入账号" class="c-login-input" name="name" #name="ngModel" 
                                   [(ngModel)] = "opuser.name" [ngClass]="{'form-valid-error':name.invalid && (name.touched)}" (focus)="vacancy()">
                   </div>
                   <div  class="c-login-error">
                        <div class="text-danger" *ngIf="name.invalid && (name.touched)" >
                            <div  *ngIf="name.errors.required">
                                 账号不能为空
                            </div>
                        </div>
                   </div>
                   <div class="input-group  form-group pos-r">
                       <img src="assets/images/icon/password_hig.png" alt="" class="pos-a" style="top: 14px;left:13px;z-index:12;">
                       <input type="password" placeholder="请输入密码" required class="c-login-input" name ="password"
                            [ngClass]="{'form-valid-error':password.invalid && (password.touched)}"
                            pattern="^\\s*([\\da-zA-Z]{5,16})\\s*$" #password="ngModel" 
                            [(ngModel)] = "opuser.password " (focus)="vacancy()" />
                                    </div>
                   <div class="c-login-error">
                   <div class="text-danger" *ngIf="password.invalid && (password.touched)" >
                         <div *ngIf="password.errors.required">
                              密码不能为空
                         </div>
                         <div *ngIf="password.errors.pattern">
                               密码为5-16位数字或字母!
                         </div>
                   </div>
              </div>
         <div class="forgePwd mg-b-20">
                                   
           <zm_input_checkbox [checkboxLable]=" '记住账号' " [checkboxValue]="false"></zm_input_checkbox>
           <span class="pull-right c-login-pwd font-c5 cur-hand"  [routerLink] = "['/resetPwd']">忘记密码</span>
         </div>
         <button class="btn  c-btn-blue btn-block fz-18" style="height: 48px;padding:0;" id="loginBtn" [disabled]="!myForm.valid" (click) ="login()" [ngClass]="{'btn-valid-error':btnStatu.btnClass}">登录</button>
                                      <div class="c-input-error font-c3 text-center" style="line-height: 30px;" >{{btnStatu.btnText}}</div>
                               
          </form>
     </div>
                          
</div>
                `,
  styleUrls: ['login.scss'],

})

export class LoginPage implements OnInit {
  constructor(private opuserMgr: OPUserMgr,
              private configService:ConfigService) {
    this.service = new LoginService(
      this.opuserMgr);
  }
  private service: LoginService;

  public opuser: OPUser = new OPUser();
  public rmbName: boolean = true;
  public btnStatu = {btnClass: false, btnText: ''};//按钮验证
  public toasterCfg = ZmToasterCfg.center;//吐司弹出位置

  ngOnInit(): void {
    let name = SessionUtil.getInstance().getName();//记住账号
    this.opuser.name = name;
    this.configService.initServiceConfig();
  }


  /**
   * 登录点击事件
   */
  public login() {
    let name = AppUtils.trimBlank(this.opuser.name);
    let password = AppUtils.trimBlank(this.opuser.password);
    this.service.login(name, password, (successTmp) => {
      //记住账号
      this.rmbAccount(name);
      //请求店铺 并持久化
      if(successTmp){
        this.handleResult(successTmp);
      }else{
        this.handleResult(successTmp);
      }
    });
  }

  /**记住账号*/
  private rmbAccount(name) {
    if (this.rmbName) {
      SessionUtil.getInstance().setName(name);
    } else {
      localStorage.removeItem("name");
    }
  }

  private handleResult(successP: boolean) {
    if (successP) {
      AppUtils.showSuccess("提示", "登录成功");
      console.log("登录成功");
      AppRouter.goHome();
    } else {
      console.log("登录失败");
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

  constructor(private opuserMgr: OPUserMgr) {
  }


  /**
   * @param phone
   * @param password
   * @param loginCallback()
   */

  public async login(name, password, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let opuserLoginApiForm = new OPUserLoginApiForm();
    opuserLoginApiForm.name = name;
    opuserLoginApiForm.password = password;
    let restResp = await this.opuserMgr.login(opuserLoginApiForm);
    if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      let opuser = loginResp.opuser;
      this.setUserData(opuser, loginResp);
      loginCallBack(loginSuccess);
    }
  }

  /**
   * 设置用户数据
   */
  private setUserData(opuser:OPUser,loginResp:LoginResp){
    let opuserData = UserData.newInstance();
    opuserData.setOPUserId(opuser.id);
    opuserData.setOPUserName(opuser.name);
    opuserData.setAccessToken(loginResp.token);
    SessionUtil.getInstance().setUserData(opuserData);
  }


}

