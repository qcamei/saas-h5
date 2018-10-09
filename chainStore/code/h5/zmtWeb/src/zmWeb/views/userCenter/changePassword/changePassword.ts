import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {UserCenterViewDataMgr} from "../userCenterViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChangePasswordData} from "../../../bsModule/buser/apiData/ChangePasswordData";
import {BUserResetPasswordForm} from "../../../bsModule/buser/apiData/BUserResetPasswordForm";
import {BUserResetPwdMgr} from "../../../bsModule/buser/BUserResetPwdMgr";
import {SmsMgr} from "../../../bsModule/sms/SmsMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {ChangePasswordViewData} from "./ChangePasswordViewData";

@Component({
  selector: 'change-password',
  templateUrl: 'changePassword.html',
  styleUrls: ['changePassword.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordPage implements OnInit,OnDestroy {

  private viewDataSub: any;
  public viewData: ChangePasswordViewData;
  private service: ChangePasswordService;
  public resPwdText: boolean = false;
  public defaultTab: number = 0;

  constructor(private buserMgr: BUserMgr,
              private buserSynDataHolder: BUserSynDataHolder,
              private buserResetPwdMgr: BUserResetPwdMgr,
              private smsMgr: SmsMgr,
              private userCenterViewDataMgr: UserCenterViewDataMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new ChangePasswordService(this.buserMgr, this.buserSynDataHolder, this.buserResetPwdMgr, this.smsMgr, this.userCenterViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.userCenterViewDataMgr.subscribeChangePasswordVD((viewDataP: ChangePasswordViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 页面点击事件 修改密码
   */
  changePassword() {
    let formData = this.viewData.formData;
    if (formData.canSubmit) {
      let changePasswordData: ChangePasswordData = formData.toTargetForm();
      let userId = SessionUtil.getInstance().getUserId();
      changePasswordData.buserId = userId;
      this.service.changePassword(changePasswordData, (success: boolean) => {
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
  public resetPwd() {
    let resetFormData = this.viewData.resetFormData;
    if (resetFormData.canSubmit) {
      let resetPasswordForm: BUserResetPasswordForm = resetFormData.toTargetForm();
      resetPasswordForm.phone = this.viewData.randomCodeAPIForm.phoneNumber;
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
  onTabSelect(e) {
    this.defaultTab = e.index;
    this.service.initViewData();
  }

}

export class ChangePasswordService {

  constructor(private buserMgr: BUserMgr,
              private buserSynDataHolder: BUserSynDataHolder,
              private buserResetPwdMgr: BUserResetPwdMgr,
              private smsMgr: SmsMgr,
              private userCenterViewDataMgr: UserCenterViewDataMgr) {
  }

  public initViewData() {
    let viewDataTmp = new ChangePasswordViewData();
    this.userCenterViewDataMgr.setChangePasswordViewData(viewDataTmp);

    this.buildViewData((viewData: ChangePasswordViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: ChangePasswordViewData) {
    this.userCenterViewDataMgr.setChangePasswordViewData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: ChangePasswordViewData) => void) {
    let viewDataTmp = new ChangePasswordViewData();
    let userId = SessionUtil.getInstance().getUserId();
    let buser: BUser = await this.buserSynDataHolder.getData(userId);
    if (buser) {
      viewDataTmp.randomCodeAPIForm.phoneNumber = buser.phone;
      viewDataTmp.disbtn = false;
    }
    callback(viewDataTmp);
  }

  /**
   * 修改密码
   * @param callback
   */
  public changePassword(updateForm: ChangePasswordData, callback: (success: boolean) => void) {
    this.buserMgr.changePassword(updateForm).then((success) => {
      callback(success);
    })
  }

  /**
   * 发送验证码
   * @param randomCodeAPIForm
   * @param callbackP
   */
  public send(randomCodeAPIForm, callbackP: (successP: boolean) => void) {
    this.smsMgr.sendSms(randomCodeAPIForm).then(
      (restResp) => {
        callbackP(restResp.code == 200);
      }
    );
  }

  /**
   * 通过手机验证码修改密码
   * @param resetPwdForm
   * @param callbackP()
   */
  public resetPwd(resetPwdForm: BUserResetPasswordForm, callbackP: (success: boolean) => void) {
    this.buserResetPwdMgr.resetPwd(resetPwdForm).then(
      (restResp) => {
        callbackP(restResp.code == 200);
      }
    );
  }

}

