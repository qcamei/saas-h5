import {MgrPool} from "../../comModule/MgrPool";
import {WxJsApiTicketMgr} from "../../bsModule/wxJsApiTicket/WxJsApiTicketMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {Constants} from "./Constants";

/**
 * 微信JSSDK工具类
 * 使用前要先在当前所在页面初始化
 *
 * 微信JS-SDK说明文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
 */
export class WXUtils {

  public static getInstance():WXUtils{
    return MgrPool.getInstance().get("WXUtils",WXUtils);
  }

  /**
   * 初始化JSSDK配置
   */
  public async init(){
    let _self = this;
    let appId = Constants.WX_APPID;
    let pageUrl = location.href.split('#')[0];
    let wxJsApiTicket = await WxJsApiTicketMgr.getInstance().genJssdkSignature(appId,pageUrl);
    if(!AppUtils.isNullObj(wxJsApiTicket)){
      _self.doInit(wxJsApiTicket.toJsApiConfig(),null);
    }else{
      AppUtils.showInfo("提示", 'wxJsApiTicket加载失败');
    }
  }

  /**
   * 初始化JSSDK配置
   * @param {JsApiConfig} cfg
   * @param {(resultP) => void} errorCallback
   */
  private doInit(cfg: JsApiConfig, errorCallback: (resultP)=>void){
    wx.config({
      debug: cfg.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: cfg.appId, // 必填，公众号的唯一标识
      timestamp: cfg.timestamp, // 必填，生成签名的时间戳
      nonceStr: cfg.nonceStr, // 必填，生成签名的随机串
      signature: cfg.signature,// 必填，签名，见附录1
      jsApiList: ['scanQRCode',
        'chooseWXPay',
        'chooseImage',
        'uploadImage',
        'getLocation',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.error(function(res){
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      if(errorCallback){
        errorCallback(res);
      }
    });
  }

  /**
   * 支付
   * @param {WXPayParams} wxpayParams
   * @param {(resultP) => void} successCallback
   */
  public pay(params: WXPayParams, successCallback: (resultP)=>void){
    wx.chooseWXPay({
      timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
      package: params._package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: params.paySign, // 支付签名
      success: function (res) { // 支付成功后的回调函数
        if(successCallback){
          successCallback(res);
        }
      }
    });
  }

  /**
   * 扫二维码
   * @param {(resultP) => void} successCallback
   */
  public scanQrcode(successCallback:(resultP)=>void){
    wx.scanQRCode({
      desc: 'scanQRCode desc',
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) { // 成功时的回调
        if(successCallback) {
          successCallback(res.resultStr);
        }
      },
      error: function (res) {
        console.log(res.errMsg);
      }
    });
  }

  /**
   * 拍照或从手机相册中选图片
   * @param {(resultP) => void} successCallback
   */
  public chooseImage(successCallback:(resultP)=>void){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        if(successCallback) {
          successCallback(localIds);
        }
      }
    });
  }

  /**
   * 上传图片
   * @param {string} localId
   * @param {(resultP) => void} successCallback
   */
  public uploadImage(localId:string, successCallback:(resultP)=>void){
    wx.uploadImage({
      localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        var serverId = res.serverId; // 返回图片的服务器端ID
        if(successCallback) {
          successCallback(serverId);
        }
      }
    });
  }

  /**
   * 分享到朋友圈（即将废弃）
   * @param {ShareToFriendCircleParams} params
   * @param {() => void} successCallback
   */
  public shareToFriendCircle(params: ShareToFriendCircleParams, successCallback:()=>void){
    wx.onMenuShareTimeline({
      title: params.title, // 分享标题
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
      success: function () { // 用户点击了分享后执行的回调函数
        if(successCallback){
          successCallback();
        }
      },
      cancel: function () { // 用户取消分享后执行的回调函数
      }
    });
  }

  /**
   * 分享给朋友（即将废弃）
   * @param {ShareToFriendParams} params
   * @param {() => void} successCallback
   */
  public shareToFriend(params: ShareToFriendParams, successCallback:()=>void){
    wx.onMenuShareAppMessage({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
      type: params.type, // 分享类型,music、video或link，不填默认为link
      dataUrl: params.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
      success: function () { // 用户点击了分享后执行的回调函数
        if(successCallback){
          successCallback();
        }
      },
      cancel: function () { // 用户取消分享后执行的回调函数
      }
    });
  }

  /**
   * 分享到QQ
   * @param {ShareToOthersParams} params
   * @param {() => void} successCallback
   */
  public shareToQQ(params: ShareToOthersParams, successCallback:()=>void){
    wx.onMenuShareQQ({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接
      imgUrl: params.imgUrl, // 分享图标
      success: function () { // 用户确认分享后执行的回调函数
        if(successCallback){
          successCallback();
        }
      },
      cancel: function () { // 用户取消分享后执行的回调函数
      }
    });
  }

  /**
   * 分享到腾讯微博
   * @param {ShareToOthersParams} params
   * @param {() => void} successCallback
   */
  public shareToWeibo(params: ShareToOthersParams, successCallback:()=>void){
    wx.onMenuShareWeibo({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接
      imgUrl: params.imgUrl, // 分享图标
      success: function () { // 用户确认分享后执行的回调函数
        if(successCallback){
          successCallback();
        }
      },
      cancel: function () { // 用户取消分享后执行的回调函数
      }
    });
  }

  /**
   * 分享到QQ空间
   * @param {ShareToOthersParams} params
   * @param {() => void} successCallback
   */
  public shareToQZone(params: ShareToOthersParams, successCallback:()=>void){
    wx.onMenuShareQZone({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接
      imgUrl: params.imgUrl, // 分享图标
      success: function () { // 用户确认分享后执行的回调函数
        if(successCallback){
          successCallback();
        }
      },
      cancel: function () { // 用户取消分享后执行的回调函数
      }
    });
  }

  /**
   *  获取地理位置
   * @param {(resultP: LocationResult) => void} successCallback
   */
  public getLocation(successCallback:(resultP:LocationResult)=>void){
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        let locationResult = new LocationResult();
        locationResult.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        locationResult.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        locationResult.speed = res.speed; // 速度，以米/每秒计
        locationResult.accuracy = res.accuracy; // 位置精度
        if(successCallback) {
          successCallback(locationResult);
        }
      }
    });
  }

  /**
   * 跳转到小程序中指定页面
   * @param {string} path
   */
  public miniProgramNavigateTo(path: string){
    wx.miniProgram.navigateTo({url: path});
  }

}

export class JsApiConfig{
  debug:boolean;
  appId:string;
  timestamp:string;
  nonceStr:string;
  signature:string;
}

export class WXPayParams{
  timestamp:number;
  nonceStr:string;
  _package:string;
  signType:string;
  paySign:string;
}

export class LocationResult{
  latitude:number;
  longitude:number;
  speed:any;
  accuracy:any;
}

export class ShareToFriendCircleParams{
  title:string;
  link:string;
  imgUrl:string;
}

export class ShareToFriendParams{
  title:string;
  desc:string;
  link:string;
  imgUrl:string;
  type:string;
  dataUrl:string;
}

export class ShareToOthersParams{
  title:string;
  desc:string;
  link:string;
  imgUrl:string;
}
