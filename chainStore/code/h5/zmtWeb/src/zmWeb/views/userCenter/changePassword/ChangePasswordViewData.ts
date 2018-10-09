import {ChangePasswordData} from "../../../bsModule/buser/apiData/ChangePasswordData";
import {BUserResetPasswordForm} from "../../../bsModule/buser/apiData/BUserResetPasswordForm";
import {RandomCodeAPIForm} from "../../../bsModule/buser/apiData/RandomCodeAPIForm";
import {AppUtils} from "../../../comModule/AppUtils";

export class ChangePasswordViewData{
  public randomCodeAPIForm = new RandomCodeAPIForm();
  public password:string;//确认密码
  public disbtn:boolean = true;

  public formData:ChangePasswordFormData = new ChangePasswordFormData();
  public resetFormData:BUserResetPasswordFormData = new BUserResetPasswordFormData();
}

export class ChangePasswordFormData{

  constructor(){

  }

  public oldPassword:string;
  public oldPasswordPass:boolean;

  public password:string;
  public passwordPass:boolean;

  public pwdConfirm:string;
  public pwdConfirmPass:boolean;

  public canSubmit:boolean = false;
  public submitErrorMsg:string = null;

  public check(){
    this.canSubmit = (this.oldPasswordPass && this.passwordPass
    && this.pwdConfirmPass);
  }

  public setSubmitErrorMsg(errorMsg:string){
    this.submitErrorMsg = errorMsg;
  }

  public toTargetForm(){
    let targetForm = new ChangePasswordData();
    targetForm.oldPassword = AppUtils.trimBlank(this.oldPassword);
    targetForm.password = AppUtils.trimBlank(this.password);
    return targetForm;
  }
}

export class BUserResetPasswordFormData{

  constructor(){

  }

  public phone:string;

  public vCode:string;
  public vCodePass:boolean;

  public password:string;
  public passwordPass:boolean;

  public pwdConfirm:string;
  public pwdConfirmPass:boolean;

  public canSubmit:boolean = false;
  public submitErrorMsg:string = null;

  public check(){
    this.canSubmit = (this.passwordPass
    && this.pwdConfirmPass && this.vCodePass);
  }

  public setSubmitErrorMsg(errorMsg:string){
    this.submitErrorMsg = errorMsg;
  }

  public toTargetForm(){
    let targetForm = new BUserResetPasswordForm();
    targetForm.password = AppUtils.trimBlank(this.password);
    targetForm.verifyCode = AppUtils.trimBlank(this.vCode);
    return targetForm;
  }
}
