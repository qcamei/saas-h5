import {RadioItem} from "../../zmComp/form/ZmInputRadio";
import {BUserAddApiForm} from "../../../bsModule/buser/apiData/BUserAddApiForm";
import {BUserRoleEnum} from "../../../bsModule/buser/apiData/BUserRoleEnum";
import {AppUtils} from "../../../comModule/AppUtils";
import {GenderEnum} from "../../../comModule/enum/GenderEnum";
import {Constants} from "../../common/Util/Constants";

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

  public toRegForm(): BUserAddApiForm{
    let regForm:BUserAddApiForm = new BUserAddApiForm();
    regForm.name = AppUtils.trimBlank(this.name);
    regForm.phone = AppUtils.trimBlank(this.phone);
    regForm.password = AppUtils.trimBlank(this.password);
    regForm.verifyCode = AppUtils.trimBlank(this.vCode);
    regForm.areaCode = AppUtils.trimBlank(this.areaCode);
    regForm.gender = this.gender.value ;//男1 女2
    if(regForm.gender == GenderEnum.MALE){
      regForm.headImg = Constants.MALE_DEFAULT_IMG;
    }else{
      regForm.headImg = Constants.FEMALE_DEFAULT_IMG;
    }

    let roleSet: Array<number> = new Array<number>();
    roleSet.push(BUserRoleEnum.INIT);
    regForm.roleSet = roleSet;
    return regForm;
  }

}
