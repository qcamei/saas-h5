import {MainViewData} from "./MainViewData";
import {MainViewDataMgr} from "./MainViewDataMgr";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {MainData, LoginData} from "../../comModule/session/SessionData";


export class MainService{

  constructor(){}


  public async buildViewData() {

    let loginData:LoginData = SessionUtil.getInstance().loginData;

    let mainData:MainData = new MainData();

    let viewDataTmp:MainViewData = MainViewData.newInstance(loginData, mainData);
    MainViewDataMgr.getInstance().setData(viewDataTmp);
  }

}
