import {EUserAddForm} from "../../../bsModule/euser/apiData/EUserAddForm";
import {AppUtils} from "../../../comModule/AppUtils";
export class AddEUserFormData{
  constructor(){}

  public areaCode:string = "+86";//区号 发送验证码需要

  public name:string;
  public namePass:boolean;

  public phone:string;
  public phonePass:boolean;

  public vCode:string;
  public vCodePass:boolean;

  public canSubmit:boolean = false;
  public submitErrorMsg:string = null;

  public check(){
    this.canSubmit = (this.namePass && this.phonePass && this.vCodePass);
  }

  public setSubmitErrorMsg(errorMsg:string){
    this.submitErrorMsg = errorMsg;
  }

  public toAddEUserForm(): EUserAddForm{
    let addEUserForm:EUserAddForm = new EUserAddForm();
    addEUserForm.name = AppUtils.trimBlank(this.name);
    addEUserForm.phone = AppUtils.trimBlank(this.phone);
    addEUserForm.verifyCode = AppUtils.trimBlank(this.vCode);

    return addEUserForm;
  }

}
