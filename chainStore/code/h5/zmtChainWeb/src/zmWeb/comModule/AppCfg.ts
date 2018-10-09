import {AppUtils} from "./AppUtils";
import {Constants} from "../views/common/Util/Constants";

export class AppCfg {

  public static readonly withSyn:boolean = true;
  // public static readonly LOCAL_FLAG:boolean = true;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）
  public static readonly LOCAL_FLAG:boolean = false;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）
  public static readonly SERVICE_SUFFIX:string = "/chainms/ws/v1";

  private static instance:AppCfg = new AppCfg();

  public static getInstance():AppCfg{
    return AppCfg.instance;
  }

  private configJson:any;//json配置文件
  private serviceAddress;
  private imgPreUrl;
  private storeLoginAddress;
  private versionReqUrl;

  public getVersionReqUrl(): any {
    return this.versionReqUrl;
  }

  public setVersionReqUrl(value: any) {
    this.versionReqUrl = value;
  }

  public getStoreLoginAddress(): any {
    return this.storeLoginAddress;
  }

  public setStoreLoginAddress(value: any) {
    this.storeLoginAddress = value;
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
      AppUtils.copy(serviceConfig, this.configJson[env]);
      this.setServiceAddress(serviceConfig.serviceAddress);
      this.setImgPreUrl(serviceConfig.imgPreUrl);
      this.setStoreLoginAddress(serviceConfig.storeLoginAddress);
      this.setVersionReqUrl(serviceConfig.versionReqUrl);
    }
  }

  /**
   * 通过截取url初始化配置
   */
  private initEnvFromUrl(){
      let serviceAddress = window.location.origin+AppCfg.SERVICE_SUFFIX;
      let imgPreUrl = window.location.origin+"/";
      let storeLoginAddress = window.location.origin+Constants.LOGIN_ADDR_SUFFIX;
      let versionReqUrl = window.location.origin+Constants.VERSION_REQ_URL;
      this.setServiceAddress(serviceAddress);
      this.setImgPreUrl(imgPreUrl);
      this.setStoreLoginAddress(storeLoginAddress);
      this.setVersionReqUrl(versionReqUrl);

  }

}

export class ServiceConfig {
  serviceAddress:string;
  imgPreUrl:string;
  storeLoginAddress:string;
  versionReqUrl:string;
}
