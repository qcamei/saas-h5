import {AppUtils} from "./AppUtils";
export class FormsData{

  private _validateItemArr:Array<ValidateItem> = new Array<ValidateItem>();

  public static newInstance():FormsData{

    return new FormsData();
  }

  public setValidateItemArr(value: Array<ValidateItem>) {
    this._validateItemArr = value;
  }

  public getValidateItemArr():Array<ValidateItem>{
    return this._validateItemArr;
  }


  public check():boolean{
    let statusArr:Array<boolean> = [];

    for(let item of this._validateItemArr){
      statusArr.push(item.status);
    }

    if(AppUtils.arrayContains(statusArr,false)){
      return false;
    }else{
      return true;
    }

  }

}
export class ValidateItem{
  name:string = "";

  status:boolean = false;//校验状态
  errorMsg:string = "";


  constructor(nameP:string){
    this.name = nameP;
  }

}
