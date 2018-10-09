import {AppUtils} from "./AppUtils";
import {Constants} from "../views/common/Util/Constants";

export class AppCfg {

  public static readonly withSyn:boolean = true;
  public static readonly LOCAL_FLAG:boolean = true;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）
  // public static readonly LOCAL_FLAG:boolean = false;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）
  public static readonly SERVICE_SUFFIX:string = "/storemngms/ws/v1";
  public static readonly EXPERIENCE_SERVICE_ADDRESS:string = "https://www.zhimeitimes.com:9110/dev/storemngms/ws/v1";//体验环境
  public static readonly EXPERIENCE_IMGPREURL:string = "https://www.zhimeitimes.com/";

  private static instance:AppCfg = new AppCfg();

  public static getInstance():AppCfg{
    return AppCfg.instance;
  }

  private configJson:any;//json配置文件
  private env:string;//对应开发环境 220、221、prd...
  private serviceAddress;
  private imgPreUrl;

  public getConfigJson(): any {
    return this.configJson;
  }

  public setConfigJson(value: any) {
    this.configJson = value;
  }

  public getEnv(): string {
    return this.env;
  }

  public setEnv(value: string) {
    this.env = value;
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
      let env = this.getEnv();//开发环境
      if(AppUtils.isNullOrWhiteSpace(env)){//未设置情况默认取json文件中的配置
        env = this.configJson.env;
      }
      let serviceConfig = new ServiceConfig();
      AppUtils.copy(serviceConfig, this.configJson[env]);

      this.setServiceAddress(serviceConfig.serviceAddress);
      this.setImgPreUrl(serviceConfig.imgPreUrl);
    }
  }

  /**
   * 通过截取url初始化配置
   */
  private initEnvFromUrl(){
    let env = this.getEnv();//开发环境
    if(!AppUtils.isNullOrWhiteSpace(env) && (env == Constants.EXPERIENCE)){//体验环境
      AppCfg.getInstance().setServiceAddress(AppCfg.EXPERIENCE_SERVICE_ADDRESS);
      AppCfg.getInstance().setImgPreUrl(AppCfg.EXPERIENCE_IMGPREURL);
    }else{
      let serviceAddress = window.location.origin+AppCfg.SERVICE_SUFFIX;
      let imgPreUrl = window.location.origin+"/";
      AppCfg.getInstance().setServiceAddress(serviceAddress);
      AppCfg.getInstance().setImgPreUrl(imgPreUrl);
    }
  }

}

export class ServiceConfig {
  serviceAddress:string;
  imgPreUrl:string;
}
