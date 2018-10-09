import {AppUtils} from "./AppUtils";
import {Constants} from "../views/common/Util/Constants";
import {SessionUtil} from "./session/SessionUtil";

export class AppCfg {
  public static readonly withSyn:boolean = true;
  public static readonly LOCAL_FLAG:boolean = true;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）
  // public static readonly LOCAL_FLAG:boolean = false;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）
  public static readonly SERVICE_SUFFIX:string = "/storems/ws/v1";
  public static readonly EXPERIENCE_SERVICE_ADDRESS:string = "https://www.zhimeitimes.com/dev/storems/ws/v1";//体验环境
  public static readonly EXPERIENCE_IMGPREURL:string = "https://www.zhimeitimes.com/";

  private static instance:AppCfg = new AppCfg();

  public static getInstance():AppCfg{
    return AppCfg.instance;
  }

  private configJson:any;//json配置文件
  private serviceAddress;
  private imgPreUrl;
  private chainLoginAddress;

  public getChainLoginAddress(): any {
    return this.chainLoginAddress;
  }

  public setChainLoginAddress(value: any) {
    this.chainLoginAddress = value;
  }


  public getConfigJson(): any {
    return this.configJson;
  }

  public setConfigJson(value: any) {
    this.configJson = value;
  }


  public getServiceAddress() {
    return this.serviceAddress;
  }

  public setServiceAddress(serviceAddress: string) {
    this.serviceAddress = serviceAddress;
  }

  public getImgPreUrl() {
    return this.imgPreUrl;
  }

  public setImgPreUrl(imgPreUrl: string) {
    this.imgPreUrl = imgPreUrl;
  }

  /**
   * 初始化环境配置 方便自动化部署 有两种获取配置方式
   */
  public initEnv(){
    if(AppCfg.LOCAL_FLAG){
      this.initEnvFromJsonFile();
    }else{
      this.initEnvFromUrl();
    }
  }

  /**
   * 通过配置文件初始化配置
   */
  private initEnvFromJsonFile(){
    if(!AppUtils.isNullObj(this.configJson)){
      let serviceConfig = new ServiceConfig();
      let env = this.configJson.env;//默认开发环境
      if(SessionUtil.getInstance().isTryOut()){//体验环境
        env = Constants.EXPERIENCE;
      }
      AppUtils.copy(serviceConfig, this.configJson[env]);
      this.setServiceAddress(serviceConfig.serviceAddress);
      this.setImgPreUrl(serviceConfig.imgPreUrl);
      this.setChainLoginAddress(serviceConfig.chainLoginAddress);
    }
  }

  /**
   * 通过截取url初始化配置
   */
  private initEnvFromUrl(){
    if(SessionUtil.getInstance().isTryOut()){//体验环境
      this.setServiceAddress(AppCfg.EXPERIENCE_SERVICE_ADDRESS);
      this.setImgPreUrl(AppCfg.EXPERIENCE_IMGPREURL);
    }else{
      let serviceAddress = window.location.origin+AppCfg.SERVICE_SUFFIX;
      let imgPreUrl = window.location.origin+"/";
      let chainLoginAddress = window.location.origin+"/zmtchainweb/#/login";
      this.setServiceAddress(serviceAddress);
      this.setImgPreUrl(imgPreUrl);
      this.setChainLoginAddress(chainLoginAddress);
    }
  }

}

export class ServiceConfig {
  serviceAddress:string;
  imgPreUrl:string;
  chainLoginAddress:string;
}
