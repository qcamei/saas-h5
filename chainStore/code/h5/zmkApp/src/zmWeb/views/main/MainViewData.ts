import {LoginData, MainData} from "../../comModule/session/SessionData";
import {AppUtils} from "../../comModule/AppUtils";


export class MainViewData{

  loading:boolean = true;

  loginData:LoginData;

  mainData:MainData;

  constructor(){
  }

  public static newInstance(loginData:LoginData, mianDataP:MainData):MainViewData{
    let target:MainViewData = new MainViewData();
    target.loginData = this.cloneLoginData( loginData );
    target.mainData = this.cloneMainData( mianDataP );
    return target;
  }

  private static cloneLoginData(input:LoginData):LoginData{
    let target:LoginData = new LoginData()
    AppUtils.copy(target,input);
    return target;
  }

  private static cloneMainData (input:MainData):MainData{
    let target:MainData = new MainData()
    AppUtils.copy(target,input);
    return target;
  }

}
