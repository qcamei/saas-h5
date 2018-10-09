import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUserAddApiForm} from "../../../bsModule/buser/apiData/BUserAddApiForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {AppRouter} from "../../../comModule/AppRouter";
import {ZmToasterCfg} from "../../../comModule/Toaster";
import {BUserLoginApiForm} from "../../../bsModule/buser/apiData/BUserLoginApiForm";
import {SessionUtil} from "../../../comModule/SessionUtil";
import {LoginResp} from "../../../bsModule/buser/apiData/LoginResp";
import {RestResp} from "../../../comModule/RestResp";
import {UserData} from "../../../comModule/UserData";
import {serviceAgreementComponent} from "./serviceAgreementComponent";



@Component({
  selector: 'page-buser-reg',
  template: `
<toaster-container [toasterconfig]="toasterCfg"></toaster-container>
          <div class="c-reg">
            <div class="c-reg-body">
            <div class="c-reg-content">
                <div class="text-center">
                  <h3 class="title text-center">第二步　注册信息</h3>
                </div>
                <form #myForm = "ngForm">
                <div class="input-group  form-group">
                    <label class="c-label">姓名</label>
                    <input [ngClass]="{'form-valid-error':name.invalid && (name.dirty || name.touched)}" type="text" placeholder="请输入姓名" class="c-reg-input" name = "name" required  #name="ngModel" [(ngModel)] = "regForm.name" maxlength="10" >
                </div>
                <div style="font-size: 12px;  margin-left: 100px;height: 20px;margin-top: -10px;">
                  <div class="text-danger "  *ngIf="name.invalid && (name.dirty || name.touched)">
                    <div *ngIf="name.errors.required">
                      用户名不能为空
                    </div>
                  </div>
                </div>
                
                <div class="demo-radio  mg-b-20 ">
                  <label class="text-left  font-bold" style="font-size:18px;margin-bottom:0;width:95px;">性别</label>
                  <label class="custom-control input-group-lg  custom-radio">
                    <input type="radio" [(ngModel)] = "radioChecked" required class="custom-control-input" name="customRadio" [value] = "false">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">男</span>
                  </label>
                  <label class="custom-control input-group-lg  custom-radio">
                    <input type="radio" [(ngModel)] = "radioChecked" required class="custom-control-input" name="customRadio"  [value] = "true" >
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">女</span>
                  </label>
                </div>
                <div class="input-group   form-group">
                  <label class="c-label">手机号</label>
                  <input type="text" [ngClass]="{'form-valid-error':phone.invalid && (phone.touched)}" pattern="^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$" placeholder="请输入手机号" class="c-reg-input" name = "phone" required  #phone="ngModel" [(ngModel)] = "regForm.phone" (blur)="checkPhone()">
                </div>
                 <div  class="font-c3 fz-12" style="margin-left:95px;">
                    <div  *ngIf="success == true" >
                          请输入手机号
                    </div>
                </div>
                <div  class="c-reg-error">
                  <div class="text-danger" *ngIf="phone.invalid && (phone.touched)" >
                    <div *ngIf="phone.errors.required">
                      手机号不能为空
                    </div>
                    <div *ngIf="phone.errors.pattern">
                      手机号格式错误!
                    </div>
                  </div>
                </div>

                <!--<vCode-comp [form]="regForm" [disbtn]="disbtn" (callBack)="showSuccess($event)" ></vCode-comp>-->
                
                <div class="input-group    form-group">
                 <label class="c-label">密码</label>
                  <input type="password" name = "password" required placeholder="请输入6-16位密码数字或字母" class="c-reg-input ng-dirty ng-valid ng-touched"  #password="ngModel" [(ngModel)] = "regForm.password " pattern="^\\s*([\\da-zA-Z]{6,16})\\s*$" [ngClass]="{'form-valid-error':password.invalid && (password.touched)}"
                                            (blur)="checkPwdFun()"/>
                </div>
                 <div  class="c-reg-error">
                  <div class="text-danger" *ngIf="password.invalid && (password.touched)">
                    <div *ngIf="password.errors.required">
                      
                      密码不能为空
                    </div>
                    <div *ngIf="password.errors.pattern">
                      密码至少为6-16位数字或字母
                    </div>
                  </div>
                </div>
               
                <div class="input-group    form-group">
                 <label class="c-label">确认密码</label>
                  <input type="password" name = "checkPassword" required placeholder="请输入6-16位密码数字或字母"
                  class="c-reg-input"  #checkPassword="ngModel" [(ngModel)] ="checkPwd" 
                  pattern="^\\s*([\\da-zA-Z]{6,16})\\s*$"  [ngClass]="{'form-valid-error':checkPassword.invalid && (checkPassword.touched)}" (blur)="checkPwdFun()" />
                </div>
          
                 <div  class="c-reg-error">
                  <div class="text-danger" *ngIf="checkPassword.invalid && (checkPassword.touched)">
                    <div *ngIf="checkPassword.errors.required">
                      请再次确认密码
                    </div>
                    <div *ngIf="checkPassword.errors.pattern">
                      密码至少为6-16位数字或字母
                    </div>
                  </div>
                 <div class="text-danger" *ngIf="checkPwdText">
                        两次密码不一致
                   </div>
                 </div>
                 <div>
                  <nb-checkbox  name="checkBox" #checkBox = "ngModel" [(ngModel)] = "radioChecked" 
                  style="margin-left:95px;">我已同意</nb-checkbox> 
                  <span class="font-c1 cur-hand" style="margin-left: -15px;" (click)="serviceAgreementModal()">《智美通协议》</span>
                </div>
                <div class="font-c3" style="font-size: 12px;  margin-left: 95px;height: 25px;">
                     <div *ngIf="!checkBox.invalid">
                         <div *ngIf="!checkBox.value">
                             请勾选智美通协议
                          </div>
                     </div>
                </div>
                
              <div>
                <button class="btn btn-block c-btn-blue" style="width: calc(100% - 95px);margin-left: 95px;height: 48px;padding: 0;" [ngClass]="{'btn-valid-error':inputStatu.vCode == true}"  
                [disabled]="!myForm.valid ||!checkBox.value ||checkPwdText" (click) ="reg()">注册
                </button>
                 <div class="c-input-error">
                     <div class="font-c3 text-center" style="line-height: 30px;" *ngIf= "inputStatu.vCode == true">{{inputStatu.codeText}}
                     </div>
                 </div>
              </div>
              </form>
              </div>
            </div>
          </div>
          `,
  styleUrls: ['./reg.scss'],
})

export class RegPage {

  constructor(private buserMgr: BUserMgr,
              private route: ActivatedRoute,
              private modalService: NgbModal) {
    this.service = new RegService(this.buserMgr);
  }

  private service: RegService;
  private paramsSub: any;
  private roleSet: Array<number> = new Array<number>();
  public toasterCfg = ZmToasterCfg.center;//吐司弹出位置


  public regForm: BUserAddApiForm = new BUserAddApiForm();
  public checkPwd: string = "";
  public checkPwdText = false;
  public btnStatu = {btnClass: false, btnText: ''};//按钮验证
  public inputStatu = {codeText: '', vCode: false};//提交验证码验证
  public success = false;//验证码回调返回值
  public radioChecked: boolean = true;//默认女
  public disbtn: boolean = true;//手机号不合格不可点击获取验证码

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      let roleSetTmp = params['roleSet'];
      this.roleSet.push(roleSetTmp);
    });
  }


  //服务协议
  serviceAgreementModal() {
    const activeModal = this.modalService.open(serviceAgreementComponent, {size: 'lg'});
  }


  /**验证电话号码格式*/
  public checkPhone() {
    let phone = AppUtils.trimBlank(this.regForm.phone);
    let regExp = new RegExp("^[1][3-8]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}$");
    let b = regExp.test(phone);
    if (phone != null && b == true) {
      this.disbtn = false;
    } else {
      this.disbtn = true;
    }
  }


  /**两次密码一致性*/
  public checkPwdFun() {
    if (this.regForm.password == null || this.checkPwd == null) {
      return;
    }else{
      let pwd1 = AppUtils.trimBlank(this.regForm.password);
      let pwd2 = AppUtils.trimBlank(this.checkPwd);
      if (pwd1.length >= 6 && pwd2.length >= 6) {
        if (pwd1 != pwd2) {
          this.checkPwdText = true;
        } else {
          this.checkPwdText = false;
        }
      }else {
        this.checkPwdText = false;
        if (!pwd1 && !pwd2) {
          this.checkPwdText = false;
        }
        return;
      }
    }

  }

  /**
   * 验证码回调方法
   */
  showSuccess(result) {
    if (result) {
      this.success = result;
    } else {
      this.success = false;
    }

  }

  /**
   * 注册
   */
  public reg() {
    let checkSuccess = this.checkForm();
    if(checkSuccess){
      this.service.reg(this.regForm, (success: boolean, regMessage: string) => {
        this.handleResult(success, regMessage);
      });
    }
  }

  private checkForm(){
    let checkSuccess = false;
    if(AppUtils.isNullOrWhiteSpace(this.regForm.phone)
      ||AppUtils.isNullOrWhiteSpace(this.regForm.password)
      ||AppUtils.isNullOrWhiteSpace(this.regForm.verifyCode)){
      AppUtils.showWarn("提示","请按要求填写必填项");
      return checkSuccess;
    }else{
      this.regForm.phone = AppUtils.trimBlank(this.regForm.phone);
      this.regForm.password = AppUtils.trimBlank(this.regForm.password);
      this.regForm.verifyCode = AppUtils.trimBlank(this.regForm.verifyCode);
      this.regForm.roleSet = this.roleSet;
      this.radioChecked === true ? this.regForm.gender = 2 : this.regForm.gender = 1;//男1 女2
      checkSuccess = true;
      return checkSuccess;
    }

  }

  private handleResult(success: boolean, regMessage: string): void {
    if (success) {
      this.btnStatu.btnText = regMessage;
      AppUtils.showSuccess("提示", regMessage);
    } else {
      this.inputStatu.vCode = true;
      this.inputStatu.codeText = regMessage;
      AppUtils.showError("提示", regMessage);
    }
  }

}


class RegService {

  constructor(private buserMgr: BUserMgr) {
  }

  /**
   @param regForm
   @param regCallBack()
   */
  public async reg(regForm, regCallBack: (success: boolean, regMessage: string) => void) {
    let regMessage = "";
    let buserRegApiForm = new BUserAddApiForm();
    AppUtils.copy(buserRegApiForm, regForm);

    let restResp: RestResp = await this.buserMgr.reg(buserRegApiForm);
    if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
      let phone = AppUtils.trimBlank(regForm.phone);
      let password = AppUtils.trimBlank(regForm.password);
      this.loginAuth(phone, password);

      regMessage = "注册成功";
      regCallBack(true, regMessage);
    }else {
      regCallBack(false, restResp.tips);
    }
  }

  /***判断用户身份*/
  private async loginAuth(phone, password) {
    this.login(phone, password, (successTmp, user) => {
      if (successTmp) {
        if (user.roleSet && AppUtils.arrayContains(user.roleSet, "0")) {
          AppRouter.goExpired();//老板注册完跳转过期页面
          // AppRouter.goBossAddStore();//老板角色跳转开店铺页面
        } else {//员工跳转申请加入店铺页面
          AppRouter.goClerkApplyStore();
        }
      }
    });
  }


  /**
   * @param phone
   * @param password
   * @param loginCallback()
   */

  public async login(phone, password, loginCallBack: (success: boolean, user: BUser) => void) {

    let loginSuccess = false;
    let buserLoginApiForm = new BUserLoginApiForm();
    buserLoginApiForm.phone = phone;
    buserLoginApiForm.password = password;

    this.buserMgr.login(buserLoginApiForm).then(
      (restResp) => {
        if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
          loginSuccess = true;
          let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
          let user = loginResp.buser;
          this.saveUserData(user, loginResp);
          loginCallBack(loginSuccess, user);
        } else {
          loginCallBack(loginSuccess, null);
        }
      }
    ).catch(error => {
      AppUtils.handleError(error);
    });
  }

  /**
   * 设置用户数据
   * @param user
   * @param loginResp
   */
  private saveUserData(user: BUser, loginResp: LoginResp) {
    let userData = UserData.newInstance();
    userData.setUserId(user.id);
    userData.setUserName(user.name);
    userData.setAccessToken(loginResp.token);
    SessionUtil.getInstance().setUserData(userData);
  }

}

