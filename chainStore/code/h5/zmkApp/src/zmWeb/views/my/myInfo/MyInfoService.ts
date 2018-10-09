import {MyInfoViewData} from "./MyInfoViewData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MyInfoViewDataMgr} from "./MyInfoViewDataMgr";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {AppCfg} from "../../../comModule/AppCfg";
import {CUserUpdateInfoApiData} from "../../../bsModule/cuser/apiData/CUserUpdateInfoApiData";
import {CUser} from "../../../bsModule/cuser/data/CUser";
/**
 * Created by Orange on 2018/6/24.
 */
export class MyInfoService {

  constructor(){}

  public initViewData(){
    let viewDataTmp = new MyInfoViewData();
    MyInfoViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData((viewData:MyInfoViewData) =>{
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:MyInfoViewData){
    MyInfoViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(callback:(viewDataP:MyInfoViewData) =>void){
    let viewDataTmp = new MyInfoViewData();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let cuser:CUser = await CUserMgr.getInstance().getCUser(cuserId);
    viewDataTmp.cuser = cuser;
    if(cuser && cuser.headImg){
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl()+cuser.headImg;
    }
    callback(viewDataTmp);
  }

  /**
   * 修改用户信息
   * @param updateInfoData
   */
  public async updateCUser(cuserUpdateInfoData:CUserUpdateInfoApiData):Promise<boolean>{
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    return CUserMgr.getInstance().updateInfo(cuserId,cuserUpdateInfoData);
  }


}
