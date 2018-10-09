import {Component} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {BUserResetPwdMgr} from "../../../bsModule/buser/BUserResetPwdMgr";
import {BUserResetPasswordForm} from "../../../bsModule/buser/apiData/BUserResetPasswordForm";
import {AppRouter} from "../../../comModule/AppRouter";
import {ZmToasterCfg} from "../../../comModule/Toaster";


@Component({
  selector: 'page-buser-resetPwd',
  template: `  
    <toaster-container [toasterconfig]="toasterCfg"></toaster-container>
            <div class="c-resetPwd">
              <div class="c-resetPwd-body">
              <div  class="c-resetPwd-content">
              <div class="text-center">
                  <h3 class="title text-center">忘记密码</h3>
                </div>
                  <form #myForm="ngForm">
                  <div class="input-group input-group-lg form-group">
                  <label class="c-label" >账号</label>
                    <input type="text"  [ngClass]="{'form-valid-error':phone.invalid && (phone.touched)}" placeholder="请输入手机号" class=" c-reg-input ng-dirty ng-valid ng-touched" name = "phone" required  #phone="ngModel" [(ngModel)] = "resetPwdForm.phone" pattern="^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$" (blur)="checkPhone()">
                  </div>
            
                  <div  class="c-resetPwd-error" *ngIf="success != true">
                    <div class="text-danger " *ngIf="phone.invalid && (phone.touched)">
                      <!--<div *ngIf="phone.errors.required">-->
                        <!--手机号不能为空-->
                      <!--</div>-->
                      <!--<div *ngIf="phone.errors.pattern">-->
                        <!--手机号格式错误!-->
                      <!--</div>-->
                    </div>
                </div>
                  <!--<vCode-comp [form]="resetPwdForm" [disbtn]="disbtn"  (callBack)="showSuccess($event)"></vCode-comp> -->
                  <div class="input-group input-group-lg form-group">
                  <label class="c-label" >密码</label>
                    <input type="password"  [ngClass]="{'form-valid-error':password.invalid && (password.touched)}" placeholder="请输入密码" class="c-reg-input ng-dirty ng-valid ng-touched" name = "password" required pattern="^\\s*([\\da-zA-Z]{6,16})\\s*$" #password="ngModel" [(ngModel)] = "resetPwdForm.password " 
                                              (blur)="checkPwdFun()" />
                  </div>
                  <div  class="c-resetPwd-error">
                    <div class="text-danger" *ngIf="password.invalid && (password.touched)">
                      <!--<div *ngIf="password.errors.required">-->
                        <!--密码不能为空-->
                      <!--</div>-->
                      <!--<div *ngIf="password.errors.pattern">-->
                        <!--密码为6-16位数字或字母!-->
                      <!--</div>-->
                    </div>
                  </div>
                  
                  <div class="input-group    form-group">
                   <label class="c-label">确认密码</label>
                    <input type="password" name = "checkPassword" required placeholder="请再次输入密码"
                    class="c-reg-input"  #checkPassword="ngModel" [(ngModel)] ="checkPwd" 
                    pattern="^\\s*([\\da-zA-Z]{6,16})\\s*$"  [ngClass]="{'form-valid-error':checkPassword.invalid && (checkPassword.touched)}" (blur)="checkPwdFun()" />
                  </div>
            
                   <div  class="c-resetPwd-error">
                    <div class="text-danger" *ngIf="checkPassword.invalid && (checkPassword.touched)">
                      <!--<div *ngIf="checkPassword.errors.required">-->
                        <!--确认密码不能为空-->
                      <!--</div>-->
                      <!--<div *ngIf="checkPassword.errors.pattern">-->
                        <!--密码至少为6-16位数字或字母-->
                      <!--</div>-->
                    </div>
                  </div>
                  <div style="height:18px;margin: -15px 0 5px 95px;font-size: 12px">
                     <div class="text-danger" *ngIf="checkPwdText">
                          两次密码不一致
                     </div>
                  </div>
                  <button class="btn  c-btn-blue"  style="width: calc(100% - 95px);margin-left: 95px;height: 48px;padding: 0;" [disabled]="!myForm.valid || checkPwdText"  (click)="resetPwd()">修改密码</button>
                    <div class="font-c3 fz-12 disFlex align-center " style="margin-left:95px;height: 30px;justify-content: center;">
                      <div  *ngIf= "inputStatu.vCode == true">{{inputStatu.codeText}}</div>
                  </div>
                </form> 
              </div>
              </div>
            </div>
            `,
  styleUrls: ['./resetPwd.scss'],

})

export class ResetPwdPage {

  constructor(private buserResetPwdMgr: BUserResetPwdMgr) {
    this.service = new ResetPwdService(this.buserResetPwdMgr);
  }

  private service: ResetPwdService;
  public toasterCfg = ZmToasterCfg.center;//吐司弹出位置

  public resetPwdForm: BUserResetPasswordForm = new BUserResetPasswordForm();
  public checkPwd: string = "";
  public checkPwdText = false;
  public btnStatu = {btnClass: false, btnText: ''};//按钮验证
  public inputStatu = {codeText: '', vCode: false};//提交验证码验证
  public success = false;//验证码回调返回值
  public disbtn: boolean = true;//手机号不合格不可点击获取验证码

  /**验证电话号码*/
  public checkPhone() {
    let phone = AppUtils.trimBlank(this.resetPwdForm.phone);
    let regExp = new RegExp("^[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}$");
    let b = regExp.test(phone);
    if (phone != null && b == true) {
      this.disbtn = false;
    } else {
      this.disbtn = true;

    }
  }

  /**
   * 确认密码
   */
  public checkPwdFun() {
    if (this.resetPwdForm.password == null || this.checkPwd == null) {
      return;
    } else {
      let pwd1 = AppUtils.trimBlank(this.resetPwdForm.password);
      let pwd2 = AppUtils.trimBlank(this.checkPwd);
      if (pwd1.length >= 6 && pwd2.length >= 6) {
        if (pwd1 != pwd2) {
          this.checkPwdText = true;
        } else {
          this.checkPwdText = false;
        }
      } else {
        this.checkPwdText = false;
        if (!pwd1 && !pwd2) {//都为空
          this.checkPwdText = false;
        }
        return;
      }
    }

  }

  /**
   * 验证码验证回调
   */
  showSuccess(result) {
    this.success = result;
  }

  /**
   * 忘记密码 点击事件
   */
  public  resetPwd() {
    let checkSuccess = this.checkForm();
    if(checkSuccess){
      this.service.resetPwd(this.resetPwdForm, (success, messageTmp) => {
        this.handleResult(success, messageTmp);
      })
    }
  }

  private checkForm(){
    let checkSuccess = false;
    if(AppUtils.isNullOrWhiteSpace(this.resetPwdForm.phone)
      || AppUtils.isNullOrWhiteSpace(this.resetPwdForm.verifyCode)
      || AppUtils.isNullOrWhiteSpace(this.resetPwdForm.password)){
        AppUtils.showWarn("提示","请按要求填写必填项");
        return checkSuccess;
    }else{
      this.resetPwdForm.phone = AppUtils.trimBlank(this.resetPwdForm.phone);
      this.resetPwdForm.verifyCode = AppUtils.trimBlank(this.resetPwdForm.verifyCode);
      this.resetPwdForm.password = AppUtils.trimBlank(this.resetPwdForm.password);
      checkSuccess = true;
      return checkSuccess;
    }

  }

  /**
   * 处理结果
   */
  private handleResult(success: boolean, messageTmp: string): void {
    if (success) {
      AppUtils.showSuccess("提示", messageTmp);
      this.btnStatu.btnText = messageTmp;
      setTimeout(function(){
        AppRouter.goLogin();
      },800)
    }else {

      this.inputStatu.vCode = true;
      this.inputStatu.codeText = messageTmp;
      AppUtils.showError("提示", messageTmp);
    }
  }

}


class ResetPwdService {

  constructor(private buserResetPwdMgr: BUserResetPwdMgr) {
  }


  /**
   * @param resetPwdForm
   * @param handleCallBack()
   */

  public resetPwd(resetPwdForm, handleCallBack: (success: boolean, resetPwdMessage: string) => void) {

    let resetPwdMessage = "";
    this.buserResetPwdMgr.resetPwd(resetPwdForm).then(
      (restResp) => {
        if (restResp.code == 200) {
          resetPwdMessage = "修改密码成功";
          handleCallBack(true, resetPwdMessage);
        } else {
          handleCallBack(false, restResp.tips);
        }
      }
    );
  }

}


