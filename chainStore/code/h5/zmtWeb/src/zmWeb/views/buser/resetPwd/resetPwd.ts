import {Component} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {BUserResetPwdMgr} from "../../../bsModule/buser/BUserResetPwdMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {ResetPwdService} from "./ResetPwdService";
import {ResetPwdViewData} from "./ResetPwdViewData";
import {BUserResetPasswordForm} from "../../../bsModule/buser/apiData/BUserResetPasswordForm";


@Component({
  selector: 'page-buser-resetPwd',
  template: `  
            <div class="c-resetPwd">
              <div class="c-resetPwd-body">
              <div  class="c-resetPwd-content">
                <div class="text-center">
                      <div class="cur-hand text-left pos-r " fxLayout="row" fxLayoutAlign="start center" style="right: 70px;top: 32px;width: 100px;" (click)="retreat()">
                        <img src="assets/images/icon/icon_return.png" alt="">
                        <span style="font-size:18px;color:#03a9f4;">返回</span>
                      </div>
                      
                        <h3 class="title text-center" style="padding-left: 95px;">忘记密码</h3>
                      </div>
                     
                      <div class="media-body">
                           <zm_resetPwd_input_phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  [(areaCode)]="viewData.formData.areaCode" (valueChecked)="viewData.formData.check()" ></zm_resetPwd_input_phone>
          
                           <zm_reg_vCode [(zmValue)]="viewData.formData.vCode"  [(zmPass)]="viewData.formData.vCodePass"
                             [areaCode]="viewData.formData.areaCode" [phone]="viewData.formData.phone" [phonePass]="viewData.formData.phonePass"
                            (valueChecked)="viewData.formData.check()" ></zm_reg_vCode>
                      </div>
                     
                      <div class="media-body">
                            <zm_reg_input_pwd [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass" 
                                (valueChecked)="viewData.formData.check()"  ></zm_reg_input_pwd>
                           
                            <zm_reg_input_pwd_confirm [(zmValue)]="viewData.formData.pwdConfirm" [(zmPass)]="viewData.formData.pwdConfirmPass" 
                                [password] = "viewData.formData.password"  (valueChecked)="viewData.formData.check()" ></zm_reg_input_pwd_confirm>
                            
                           
                            <zm_reg_input_btn [text]=" '修改密码' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="resetPwd()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_reg_input_btn>
                      </div>
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
  public viewData:ResetPwdViewData;


  /**
   * 返回按钮事件
   */
  retreat():void{
    history.go(-1);
  }

  ngOnInit() {
    this.viewData = this.buildViewData();
  }

  private buildViewData():ResetPwdViewData{
    let target:ResetPwdViewData = new ResetPwdViewData();
    return target;
  }
  /**
   * 忘记密码 点击事件
   */
  public  resetPwd() {
    let formData = this.viewData.formData;
    if(formData.canSubmit){
      let targetForm:BUserResetPasswordForm = formData.toSubmitForm();
      this.service.resetPwd(targetForm, (success, messageTmp) => {
        this.handleResult(success, messageTmp);
      })
    }
  }

  /**
   * 处理结果
   */
  private handleResult(success: boolean, messageTmp: string): void {
    if (success) {
      AppUtils.showSuccess("提示", messageTmp);
      this.viewData.formData.setSubmitErrorMsg("");
      setTimeout(function(){
        AppRouter.goLogin();
      },800)
    }else {
      this.viewData.formData.setSubmitErrorMsg(messageTmp);
      AppUtils.showError("提示", messageTmp);
    }
  }

}



