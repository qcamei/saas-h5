import {Component} from '@angular/core';
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUserAddApiForm} from "../../../bsModule/buser/apiData/BUserAddApiForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {serviceAgreementComponent} from "./serviceAgreementComponent";
import {RegService} from "./RegService";
import {RegViewData} from "./RegViewData";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
@Component({
  selector: 'page-buser-reg',
  template: `
          <div class="c-reg">
            <div class="c-reg-body">
                <div class="c-reg-content">
                      <div class="cur-hand text-left pos-r " fxLayout="row" fxLayoutAlign="start center" style="right: 70px;top: 32px;width: 100px;" (click)="retreat()">
                        <img src="assets/images/icon/icon_return.png" alt="">
                        <span style="font-size:18px;color:#03a9f4;">返回</span>
                      </div>
                      <h3 class="title text-center" >注册信息</h3>
                      
                 <div class="c-form">
                     <div class="media-body">
                          <zm_reg_input_name [(zmValue)]="viewData.formData.name" [(zmPass)]="viewData.formData.namePass"  (valueChecked)="viewData.formData.check()" ></zm_reg_input_name>
                          
                          <zm_reg_input_gender [genderList]="viewData.formData.genderList" [(zmValue)]="viewData.formData.gender" ></zm_reg_input_gender>
                         
                          <zm_reg_input_phone [areaCode]="viewData.formData.areaCode" [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" >
                          
                            <zm-select_country [(zmValue)]="viewData.formData.areaCode"></zm-select_country>
                          </zm_reg_input_phone>
          
                          <zm_reg_vCode [(zmValue)]="viewData.formData.vCode"  [(zmPass)]="viewData.formData.vCodePass"
                             [areaCode]="viewData.formData.areaCode" [phone]="viewData.formData.phone" [phonePass]="viewData.formData.phonePass"
                            (valueChecked)="viewData.formData.check()" ></zm_reg_vCode>
                     </div>
                     
                      <div class="media-body">
                            <zm_reg_input_pwd [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass" 
                                (valueChecked)="viewData.formData.check()"></zm_reg_input_pwd>
                           
                            <zm_reg_input_pwd_confirm [(zmValue)]="viewData.formData.pwdConfirm" [(zmPass)]="viewData.formData.pwdConfirmPass" 
                                [password] = "viewData.formData.password"  (valueChecked)="viewData.formData.check()" ></zm_reg_input_pwd_confirm>
                            
                            
                            <div class="disFlex" style="margin-left:106px;margin-bottom: 10px;">
                               <zm_reg_input_checkbox   [(zmValue)]="viewData.formData.zmtChecked" (valueChecked)="viewData.formData.check()" >
                                  <content class="cur-hand">我已同意</content>
                               </zm_reg_input_checkbox>
                               <span class="font-c1 cur-hand"  (click)="serviceAgreementModal()">《智美通软件服务协议》</span>
                            </div>
                            <div class="font-c3" style="font-size: 12px;  margin-left:106px;height: 28px;">
                                 <div *ngIf="!viewData.formData.zmtChecked">
                                         请勾选智美通协议
                                 </div>
                            </div>
                            
                            <zm_reg_input_btn [text]=" '注册' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="reg()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_reg_input_btn>
                           
                      </div>
                </div>
                 </div>
            </div>
          </div>
          `,
  styleUrls: ['./reg.scss'],
})

export class RegPage{

  constructor(private buserMgr: BUserMgr,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new RegService(this.buserMgr);
  }

  private service: RegService;
  public viewData:RegViewData;

  ngOnInit() {
    this.viewData = this.buildViewData();
  }


  private buildViewData():RegViewData{
    let target:RegViewData = new RegViewData();
    return target;
  }


  //服务协议
  serviceAgreementModal() {
    const activeModal = ZmModalMgr.getInstance().newLgModal(serviceAgreementComponent,null,null);
  }

  /**
   * 返回按钮事件
   */
  retreat():void{
    history.go(-1);
  }

  /**
   * 注册
   */
  public reg() {
    let formData = this.viewData.formData;
    if(formData.canSubmit){
      let regForm:BUserAddApiForm = formData.toRegForm();
      this.service.reg(regForm, (success: boolean, regMessage: string) => {
        this.handleResult(success, regMessage);
      });
    }
  }

  private handleResult(success: boolean, regMessage: string): void {
    if (success) {
      this.viewData.formData.setSubmitErrorMsg("");
      AppUtils.showSuccess("提示", regMessage);
    } else {
      this.viewData.formData.setSubmitErrorMsg(regMessage);
      AppUtils.showError("提示", regMessage);
    }
  }

}


