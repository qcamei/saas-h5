import {MgrPool} from "../../comModule/MgrPool";
import {ActionSheetUtils} from "./ActionSheetUtils";
import {WXUtils} from "./WXUtils";
import {WxMediaMgr} from "../../bsModule/wxMedia/WxMediaMgr";
import {Constants} from "./Constants";
import {AppUtils} from "../../comModule/AppUtils";

/**
 * 微信图片、音频等多媒体文件上传工具类
 * 使用前要先在当前所在页面初始化
 */
export class WxMediaUtil {

  public static getInstance():WxMediaUtil{
    return MgrPool.getInstance().get("WxMediaUtil",WxMediaUtil);
  }

  constructor(){}

  public init(){
    WXUtils.getInstance().init();
  }

  public uploadImg(successCallback:(resultP)=>void){
    let _self = this;
    ActionSheetUtils.getInstance().show({
      title: '选择',
      buttons: [
        {
          text: '从手机相册选择',
          handler: () => {
            _self.doUploadImg(successCallback);
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    })
  }

  //使用微信JSSDK选择图片
  private doUploadImg(successCallback:(resultP)=>void){
    WXUtils.getInstance().chooseImage((localIds)=>{
      let localId = localIds[0];
      WXUtils.getInstance().uploadImage(localId, (serverId)=>{
        WxMediaMgr.getInstance().saveImg(Constants.WX_APPID, serverId).then((imgResp)=>{
          if(imgResp && imgResp.imgPathList.length > 0){
            if(successCallback){
              successCallback(imgResp.imgPathList);
            }
          }else{
            AppUtils.showError("提示","图片上传失败");
          }
        });
      })
    });
  }

}
