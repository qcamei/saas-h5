import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {UserCenterViewDataMgr} from "../userCenterViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {SmsMgr} from "../../../bsModule/sms/SmsMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainUserMgr} from "../../../bsModule/chainUser/ChainUserMgr";
import {ChainUserSynDataHolder} from "../../../bsModule/chainUser/ChainUserSynDataHolder";
import {ChainUserResetPwdMgr} from "../../../bsModule/chainUser/ChainUserResetPwdMgr";
import {ChainUser} from "../../../bsModule/chainUser/data/ChainUser";
import {ChangePasswordForm} from "../../../bsModule/chainUser/apiData/ChangePasswordForm";
import {ResetPasswordForm} from "../../../bsModule/chainUser/apiData/ResetPasswordForm";
import {RandomCodeAPIForm} from "../../../bsModule/sms/apiData/RandomCodeAPIForm";

@Component({
  selector:'change-password',
  templateUrl: 'changePassword.html',
  styleUrls: ['changePassword.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ChangePasswordPage implements OnInit,OnDestroy{

  private viewDataSub:any;
  public viewData:ChangePasswordViewData;
  private service:ChangePasswordService;
  public resPwdText:boolean = false;

  constructor(private chainUserMgr:ChainUserMgr,
              private chainUserSynDataHolder:ChainUserSynDataHolder,
              private chainUserResetPwdMgr:ChainUserResetPwdMgr,
              private smsMgr:SmsMgr,
              private userCenterViewDataMgr:UserCenterViewDataMgr,
              private cdRef:ChangeDetectorRef){
    this.service = new ChangePasswordService(this.chainUserMgr,this.chainUserSynDataHolder,this.chainUserResetPwdMgr,this.smsMgr,this.userCenterViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.userCenterViewDataMgr.subscribeChangePasswordVD((viewDataP:ChangePasswordViewData) =>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 页面点击事件 修改密码
   */
  changePassword(){
    let formData = this.viewData.formData;
    if (formData.canSubmit) {
      let changePasswordData: ChangePasswordForm = formData.toTargetForm();
      let userId = SessionUtil.getInstance().getUserId();
      changePasswordData.id = userId;
      this.service.changePassword(userId,changePasswordData, (success: boolean) => {
        this.handleResult(success);
      });
    }
  }

  private handleResult(success: boolean): void {
    if (success) {
      AppUtils.showSuccess("提示", "修改成功,请重新登录");
      this.userCenterViewDataMgr.setChangePasswordViewData(this.viewData);//不加吐司不出来
      SessionUtil.getInstance().clearData();
      setTimeout(() => {
        AppRouter.goLogin();
      }, 500)
    } else {
      this.userCenterViewDataMgr.setChangePasswordViewData(this.viewData);//不加吐司不出来
      AppUtils.showError("提示", "修改失败");
      this.resPwdText = true;
    }
  }

  /**
   * 页面点击事件 通过手机验证码修改密码
   */
  resetPwd() {

    let resetFormData = this.viewData.resetFormData;
    if (resetFormData.canSubmit) {
      let resetPasswordForm: ResetPasswordForm = resetFormData.toTargetForm();
      this.service.resetPwd(resetPasswordForm, (success: boolean) => {
        if (success) {
          AppUtils.showSuccess("提示", "修改成功,请重新登录");
          this.userCenterViewDataMgr.setChangePasswordViewData(this.viewData);//不加吐司不出来
          SessionUtil.getInstance().clearData();
          setTimeout(() => {
            AppRouter.goLogin();
          }, 500)
        } else {
          this.userCenterViewDataMgr.setChangePasswordViewData(this.viewData);//不加吐司不出来
          AppUtils.showError("提示", "修改失败");
        }
      });
    }

  }

  /**
   * tab页切换事件
   * @param e
   */
  onTabSelect(e){
    this.service.initViewData();
  }
}

export class ChangePasswordService{

  constructor(private chainUserMgr:ChainUserMgr,
              private chainUserSynDataHolder:ChainUserSynDataHolder,
              private chainUserResetPwdMgr:ChainUserResetPwdMgr,
              private smsMgr:SmsMgr,
              private userCenterViewDataMgr:UserCenterViewDataMgr,){}

  public initViewData(){
    let viewDataTmp = new ChangePasswordViewData();
    this.userCenterViewDataMgr.setChangePasswordViewData(viewDataTmp);

    this.buildViewData((viewData:ChangePasswordViewData) =>{
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:ChangePasswordViewData){
    this.userCenterViewDataMgr.setChangePasswordViewData(viewDataP);
  }

  public async buildViewData(callback:(viewDataP:ChangePasswordViewData) =>void){
    let viewDataTmp = new ChangePasswordViewData();
    let userId = SessionUtil.getInstance().getUserId();
    let chainUser:ChainUser = await this.chainUserSynDataHolder.getData(userId);
    if(chainUser){
      viewDataTmp.randomCodeAPIForm.phoneNumber = chainUser.phone;
      viewDataTmp.disbtn = false;
    }
    callback(viewDataTmp);
  }

  /**
   * 修改密码
   * @param callback
   */
  public changePassword(userId:number,changePasswordForm:ChangePasswordForm,callback:(success:boolean) =>void){
    this.chainUserMgr.changePassword(userId,changePasswordForm).then((success)=>{
      callback(success);
    })
  }

  /**
   * 发送验证码
   * @param randomCodeAPIForm
   * @param callbackP
   */
  public send(randomCodeAPIForm,callbackP:(successP:boolean)=>void){
    this.smsMgr.sendSms(randomCodeAPIForm).then(
      (restResp)=>{
        callbackP(restResp.code == 200);
      }
    );
  }

  /**
   * 通过手机验证码修改密码
   * @param resetPwdForm
   * @param callbackP()
   */
  public resetPwd(resetPwdForm:ResetPasswordForm, callbackP:(success:boolean)=>void) {
    this.chainUserResetPwdMgr.resetPwd(resetPwdForm).then(
      (restResp) =>{
        callbackP(restResp.code == 200);
      }
    );
  }

}

export class ChangePasswordViewData{
  public randomCodeAPIForm = new RandomCodeAPIForm();

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
    let targetForm = new ChangePasswordForm();
    targetForm.oldPassword = AppUtils.trimBlank(this.oldPassword);
    targetForm.password = AppUtils.trimBlank(this.password);
    return targetForm;
  }
}

export class BUserResetPasswordFormData{

  constructor(){

  }

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
    this.canSubmit = (this.passwordPass
    && this.pwdConfirmPass && this.vCodePass);
  }

  public setSubmitErrorMsg(errorMsg:string){
    this.submitErrorMsg = errorMsg;
  }

  public toTargetForm(){
    let targetForm = new ResetPasswordForm();
    targetForm.phone = AppUtils.trimBlank(this.password);
    targetForm.password = AppUtils.trimBlank(this.password);
    targetForm.verifyCode = AppUtils.trimBlank(this.vCode);
    return targetForm;
  }
}

