export class LoginFormData{
  constructor(){}

  public phone:string;
  public phonePass:boolean;

  public password:string;
  public passwordPass:boolean;

  public vCode:string;
  public vCodePass:boolean;

  public canSubmit:boolean = false;
  public submitErrorMsg:string = null;

  public check(){
    this.canSubmit = (this.phonePass && this.vCodePass);
  }

  public setSubmitErrorMsg(errorMsg:string){
    this.submitErrorMsg = errorMsg;
  }

}
