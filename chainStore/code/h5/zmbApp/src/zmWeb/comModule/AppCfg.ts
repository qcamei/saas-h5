import {AppUtils} from "./AppUtils";

export class AppCfg {

  public static readonly withSyn:boolean = true;
  public static readonly LOCAL_FLAG: boolean = true;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）
  // public static readonly LOCAL_FLAG:boolean = false;//是否是本地环境 打包部署需改为false（自动化部署需要 截取url初始化配置）

  private static instance:AppCfg = new AppCfg();

  public static getInstance():AppCfg{
    return AppCfg.instance;
  }

  private configJson: any;//json配置文件
  private serviceAddress:string;
  private imgPreUrl:string;

  public init(serviceAddressP:string,imgPreUrlP:string){
    this.serviceAddress = serviceAddressP;
    this.imgPreUrl = imgPreUrlP;
  }

  public getServiceAddress() {
    return this.serviceAddress;
  }

  public getImgPreUrl() {
    return this.imgPreUrl;
  }

  public getConfigJson(): any {
    return this.configJson;
  }

  public setConfigJson(value: any) {
    this.configJson = value;
  }

  public initEnv() {
    if (AppCfg.LOCAL_FLAG) {
      this.initFromConfigJson();
    } else {
      this.initEnvFromUrl();
    }
  }

  /**
   * 通过json配置文件初始化配置
   */
  public initFromConfigJson(){
    if(!AppUtils.isNullObj(this.configJson)){
      let serviceConfig = new ServiceConfig();
      let env = this.configJson.env;
      AppUtils.copy(serviceConfig, this.configJson[env]);
      this.init(serviceConfig.serviceAddress, serviceConfig.imgPreUrl);
    }
  }

  /**
   * 通过截取url初始化配置
   */
  private initEnvFromUrl() {
    let serviceAddress = window.location.origin + "/storems/ws/v1";
    let imgPreUrl = window.location.origin + "/";
    this.init(serviceAddress, imgPreUrl);
  }



}

export class ServiceConfig {
  serviceAddress:string;
  imgPreUrl:string;
}
