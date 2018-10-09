import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";
import {ImgResp} from "../img/data/ImgResp";
import {WxMediaSaveApiForm} from "./apiData/WxMediaSaveApiForm";


export class WxMediaMgr {

  public static getInstance():WxMediaMgr{
    return MgrPool.getInstance().get("WxMediaMgr",WxMediaMgr);
  }

  private wxMediaDao: WxMediaDao;

  constructor() {
    this.wxMediaDao = new WxMediaDao();
  }

  public saveImg(appId:string, mediaId:string):Promise<ImgResp>{
    let uriPath = "saveImg";
    let form = new WxMediaSaveApiForm();
    form.appId = appId;
    form.mediaId = mediaId;
    return this.wxMediaDao.addWithUri(uriPath, form);
  }

}


class WxMediaDao extends AsyncRestDao<ImgResp> {

  constructor() {
    let table: string = "wxMedia";
    super(ImgResp, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
