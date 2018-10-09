import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppCfg} from "../../../comModule/AppCfg";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {UserDetailViewData} from "./userDetailViewData";
import {UserDetailViewDataMgr} from "./userDetailViewDataMgr";
import {UpdateInfoData} from "../../../bsModule/buser/apiData/UpdateInfoData";

export class UserDetailService {

  constructor(){}

  public initViewData(){
    this.buildViewData((viewData:UserDetailViewData) =>{
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:UserDetailViewData){
    UserDetailViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(callback:(viewDataP:UserDetailViewData) =>void){
    let viewDataTmp = new UserDetailViewData();
    let buserId = SessionUtil.getInstance().getUserId();
    let buser:BUser = await BUserMgr.getInstance().getBUser(buserId);
    viewDataTmp.buser = buser;
    if(buser && buser.headImg){
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl()+buser.headImg;
    }
    callback(viewDataTmp);
  }

  /**
   * 修改用户信息
   * @param updateInfoData
   */
  public async updateBUser(buserUpdateInfoData:UpdateInfoData):Promise<boolean>{
    let buserId = SessionUtil.getInstance().getUserId();
    return BUserMgr.getInstance().updateInfo(buserId,buserUpdateInfoData);
  }


}
