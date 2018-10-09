import {AppUtils} from "../../../comModule/AppUtils";
import {BUserResetPasswordForm} from "../../../bsModule/buser/apiData/BUserResetPasswordForm";

export class ResetPwdFormData{

  constructor(){
  }

  public areaCode:string;//区号 发送验证码需要

  public phone:string;
  public phonePass:boolean;

  public vCode:string;
  public vCodePass:boolean;

  public password:string;
  public passwordPass:boolean;

  public pwdConfirm:string;
  public pwdConfirmPass:boolean;

  public canSubmit:boolean = false;
  public submitErrorMsg:string = null;

  public check(){
    this.canSubmit = (this.phonePass && this.passwordPass && this.pwdConfirmPass && this.vCodePass);
  }

  public setSubmitErrorMsg(errorMsg:string){
    this.submitErrorMsg = errorMsg;
  }

  public toSubmitForm(): BUserResetPasswordForm{
    let targetForm:BUserResetPasswordForm = new BUserResetPasswordForm();
    targetForm.phone = AppUtils.trimBlank(this.phone);
    targetForm.password = AppUtils.trimBlank(this.password);
    targetForm.verifyCode = AppUtils.trimBlank(this.vCode);
    return targetForm;
  }

}
