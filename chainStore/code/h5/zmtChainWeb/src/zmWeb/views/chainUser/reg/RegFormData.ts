import {AppUtils} from "../../../comModule/AppUtils";
import {RegistForm} from "../../../bsModule/chainUser/apiData/RegistForm";
import {RadioItem} from "../../zmComp/form/ZmInputRadio";
import {GenderEnum} from "../../../comModule/enum/GenderEnum";

export class RegFormData{

  constructor(){
    this.genderList = [new RadioItem("男",1),new RadioItem("女",2)];
    this.gender = this.genderList[1];
  }

  public name:string;
  public namePass:boolean;

  public phone:string;
  public phonePass:boolean;

  public vCode:string;
  public vCodePass:boolean;

  public genderList = [new RadioItem("男",1),new RadioItem("女",2)];
  public gender:RadioItem = new RadioItem("女",2);

  public areaCode:string = "+86";//默认中国

  public password:string;
  public passwordPass:boolean;

  public pwdConfirm:string;
  public pwdConfirmPass:boolean;

  public zmtChecked:boolean = true;

  public canSubmit:boolean = false;
  public submitErrorMsg:string = null;

  public check(){
    this.canSubmit = (this.namePass &&this.phonePass && this.passwordPass
    && this.pwdConfirmPass && this.vCodePass && this.zmtChecked);
  }

  public setSubmitErrorMsg(errorMsg:string){
    this.submitErrorMsg = errorMsg;
  }

  public toRegForm(): RegistForm{

    let regForm:RegistForm = new RegistForm();
    regForm.name = AppUtils.trimBlank(this.name);
    regForm.phone = AppUtils.trimBlank(this.phone);
    regForm.password = AppUtils.trimBlank(this.password);
    regForm.verifyCode = AppUtils.trimBlank(this.vCode);
    regForm.areaCode = AppUtils.trimBlank(this.areaCode);
    regForm.gender = this.gender.value ;//GenderEnum
    return regForm;
  }

}
