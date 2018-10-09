import {Component, OnInit} from '@angular/core';
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {EUserMgr} from "../../../bsModule/euser/EUserMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {BUserLoginApiForm} from "../../../bsModule/buser/apiData/BUserLoginApiForm";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {EUserUpdateCountData} from "../../../bsModule/euser/apiData/EUserUpdateCountData";
import {AppCfg} from "../../../comModule/AppCfg";
import {AddEUserViewData} from "./AddEUserViewData";
import {AddEUserService} from "./AddEUserService";


@Component({
  template: `
          <div class="c-addEUser">
              <div class="c-addEUser-body">
                <div  class="c-resetPwd-content">
                    <div class="text-center">
                      <div class="cur-hand text-left pos-r " fxLayout="row" fxLayoutAlign="start center" style="right: 70px;top: 32px;width: 100px;" (click)="retreat()">
                        <img src="assets/images/icon/icon_return.png" alt="">
                        <span style="font-size:18px;color:#03a9f4;">返回</span>
                      </div>
                      
                      <h3 class="title text-center" style="padding-left: 95px;">体验账号</h3>
                    </div>
  
                       <div class="media-body">
                          <zm_reg_input_name [(zmValue)]="viewData.formData.name" [(zmPass)]="viewData.formData.namePass"  (valueChecked)="viewData.formData.check()" ></zm_reg_input_name>
                          
                          <zm_euser_input_phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass" [(areaCode)]="viewData.formData.areaCode"  (valueChecked)="viewData.formData.check()" >
                            <zm-select_country [(zmValue)]="viewData.formData.areaCode"></zm-select_country>
                          </zm_euser_input_phone>
          
                           <zm_reg_vCode [(zmValue)]="viewData.formData.vCode"  [(zmPass)]="viewData.formData.vCodePass"
                             [areaCode]="viewData.formData.areaCode" [phone]="viewData.formData.phone" [phonePass]="viewData.formData.phonePass"
                            (valueChecked)="viewData.formData.check()" ></zm_reg_vCode>
                      </div>
                      
                      <zm_reg_input_btn [text]=" '模拟登陆' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="addEUser()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_reg_input_btn>
                  </div>
                </div>
              </div>
                `,
  styleUrls: ['addEUser.scss'],

})

export class AddEUserPage implements OnInit {
  constructor(private buserMgr: BUserMgr,
              private euserMgr: EUserMgr,
              private storeMgr: StoreMgr) {
    this.service = new AddEUserService(this.buserMgr, this.euserMgr, this.storeMgr);
  }

  private service: AddEUserService;
  public viewData: AddEUserViewData;

  ngOnInit() {
    this.viewData = new AddEUserViewData();
    this.service.initViewData((viewDataTmp) => {
      this.viewData = viewDataTmp;
    })

  }


  /**
   * 返回按钮事件
   */
  retreat(): void {
    history.go(-1);
  }


  public async addEUser() {
    let formData = this.viewData.formData;
    if (formData.canSubmit) {
      if (AppUtils.arrayContains(this.viewData.phoneList, formData.phone)){//不是第一次登录
        await this.update(formData.phone);
      } else {
        await this.add(formData);
      }
      this.changeEnv();
      await this.login();
    }
  }

  public async update(phone){
    let euser = await this.euserMgr.findByPhone(phone);
    let euserUpdateCountData = this.buildUpdateCountData(euser);
    await this.euserMgr.updateCount(euser.id, euserUpdateCountData);
  }

  public async add(formData){
    let addEUserForm = formData.toAddEUserForm();
    await this.euserMgr.addEUser(addEUserForm);
  }

  public changeEnv(){
    SessionUtil.getInstance().setTryOut(true);
    AppCfg.getInstance().initEnv();
  }

  public async login(){
    let buserLoginForm: BUserLoginApiForm = await this.buildBuserLoginApiForm();
    await this.euserLogin(buserLoginForm);
  }

  private async buildBuserLoginApiForm() {
    let devBuser: Array<BUser> = await this.buserMgr.findDevUserList(1000, 1);
    let phoneList = this.getPhoneList(devBuser);

    let buserLoginApiForm: BUserLoginApiForm = new BUserLoginApiForm();
    let mark = Math.floor(Math.random() * phoneList.length);
    buserLoginApiForm.phone = this.getRandomPhone(phoneList, mark);
    return buserLoginApiForm;
  }

  //体验账号
  private getPhoneList(devBuser: Array<BUser>) {
    let phoneList = new Array<string>();
    for (let item of devBuser) {
      phoneList.push(item.phone);
    }
    return phoneList;
  }

  private getRandomPhone(phoneList: Array<string>, mark: number) {
    let phone = phoneList[mark];
    if (AppUtils.isNullOrWhiteSpace(phone)) {
      phone = "13660623999";
    }
    return phone;
  }


  private buildUpdateCountData(euser) {
    let euserUpdateCountData = new EUserUpdateCountData();
    euserUpdateCountData.euserId = euser.id;
    euserUpdateCountData.count = parseInt(euser.count) + 1;
    return euserUpdateCountData;
  }


  /**
   * 登录点击事件
   */
  public euserLogin(buserLoginForm) {

    this.service.loginWithTestPhone(buserLoginForm, (successTmp) => {

      if (successTmp) {
        this.viewData.formData.setSubmitErrorMsg("");
        AppUtils.showSuccess("提示", "登录成功");
      } else {
        this.viewData.formData.setSubmitErrorMsg("登录失败");
        AppUtils.showError("提示", "登录失败");
      }
    });
  }


}



