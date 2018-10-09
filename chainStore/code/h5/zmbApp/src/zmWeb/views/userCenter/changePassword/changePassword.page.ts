import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {AppUtils} from "../../../comModule/AppUtils";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {ChangePasswordViewDataMgr} from "./changePasswordViewDataMgr";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {ChangePasswordData} from "../../../bsModule/buser/apiData/ChangePasswordData";

@IonicPage({
  name: "changePassword",
  segment: 'changePassword'
})

@Component({
  template: `
    <zm-page-header title="修改密码"></zm-page-header>
    <zm-page-content>
      <div mb-100-p>
        <zmb-password-item [(zmValue)]="viewData.oldPassword" 
                           [label]="'原密码'" [maxLength]="16" [placeHolder]="'请输入原来密码'">
        </zmb-password-item>
        <zmb-password-item [(zmValue)]="viewData.newPassword" 
                           [label]="'新密码'" [maxLength]="16" [placeHolder]="'请输入6到16位新密码'">
        </zmb-password-item>
        <zmb-password-item [(zmValue)]="viewData.confirmPassword" 
                           [label]="'确认新密码'" [maxLength]="16" [placeHolder]="'请再次输入确认新密码'">
        </zmb-password-item>
        
        <div style="padding:15px 0;">
          <zm-btn-sub [name]="'确定'" (zmbtnClick)="saveBtnClick()"></zm-btn-sub>
        </div>

      </div>

    </zm-page-content>
  `
})
export class ChangePasswordPage{

  private service: ChangePasswordService;
  private viewDataSub: any;
  public viewData: ChangePasswordViewData = new ChangePasswordViewData();
  public modalCtrl:ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,
              public navParams: NavParams,
              private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new ChangePasswordService();
    let initData = new ChangePasswordViewData();
    this.viewDataSub = ChangePasswordViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: ChangePasswordViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

  }

  ionViewDidEnter() {
    let targetObj = AppRouter.getInstance().getTargetObj(this.navParams);
    this.viewData.buser = targetObj;
    this.service.initViewData(this.viewData);
  }


  saveBtnClick(){
    if(!this.checkViewData()){
      return;
    }
    let changePasswordData =  this.buildFrom(this.viewData);
    this.changePassword(changePasswordData);
  }

  private checkViewData():boolean{
    if(AppUtils.isNullObj(this.viewData.buser)){
      return false;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.oldPassword)){
      AppUtils.showWarn("","原密码不能为空");
      return false;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.newPassword)) {
      AppUtils.showWarn("","新密码不能为空");
      return false;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.confirmPassword)) {
      AppUtils.showWarn("","确认新密码不能为空");
      return false;
    }
    let pwdReg = /^[0-9 | A-Z | a-z]{6,16}$/;
    if(!this.viewData.oldPassword.match(pwdReg)
      || !this.viewData.newPassword.match(pwdReg)
      || !this.viewData.confirmPassword.match(pwdReg)) {
      AppUtils.showWarn("","密码只能为6至16位");
      return false;
    }
    if(AppUtils.trimBlank(this.viewData.newPassword) != AppUtils.trimBlank(this.viewData.confirmPassword)){
      AppUtils.showWarn("","新密码和确认新密码不一致");
      return false;
    }
    return true;
  }

  private buildFrom(viewDataP:ChangePasswordViewData):ChangePasswordData{
    let changePasswordData: ChangePasswordData = new ChangePasswordData();
    changePasswordData.buserId = viewDataP.buser.id;
    changePasswordData.oldPassword =  AppUtils.trimBlank(viewDataP.oldPassword);
    changePasswordData.password = AppUtils.trimBlank(viewDataP.newPassword);
    return changePasswordData;
  }

  private changePassword(changePasswordData:ChangePasswordData){
    this.service.changePassword(changePasswordData).then((success) => {
      if (success) {
        AppUtils.showSuccess("提示", "修改成功");
        AppRouter.getInstance().pop();
      } else {
        AppUtils.showError("提示", "修改失败");
      }
    });
  }

}

export class ChangePasswordService {

  constructor(){}

  public async initViewData(viewDataTmp:ChangePasswordViewData){
    ChangePasswordViewDataMgr.getInstance().setData(viewDataTmp);
  }

  /**
   * 修改密码
   */
  public async changePassword(changePasswordData: ChangePasswordData) :Promise<boolean>{
    return BUserMgr.getInstance().changePassword(changePasswordData);
  }

}

export class ChangePasswordViewData{
  constructor(){}
  buser: BUser = new BUser();

  oldPassword: string;
  newPassword: string;
  confirmPassword:string;

}




