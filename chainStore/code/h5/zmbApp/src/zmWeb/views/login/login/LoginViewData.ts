

import {LoginFormData} from "./LoginFormData";

export class LoginViewData{
  constructor(){}

  public rmbPhone: boolean = true;

  public formData:LoginFormData = new LoginFormData();

  public setOldAccount(phoneP:string):LoginViewData{
    this.formData.phone = phoneP;
    this.formData.phonePass = true;
    return this;
  }

}
