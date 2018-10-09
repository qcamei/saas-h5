import {Injectable} from "@angular/core";
import {SessionUtil} from "../../comModule/SessionUtil";
import {Http} from "@angular/http";
import {AppUtils} from "../../comModule/AppUtils";
import {Constants} from "../../views/common/Util/Constants";

/**
 * 系统初始化的时候，加载远程的配置文件
 */
@Injectable()
export class ConfigService {

  constructor(private httpService: Http) {}

  public async initServiceConfig(){
    let serviceConfig = await this.getConfigByRemoteFile();

    SessionUtil.getInstance().setServiceAddress(serviceConfig.serviceAddress);
    SessionUtil.getInstance().setImgPreUrl(serviceConfig.imgPreUrl);
  }

  // 本地JS配置文件
  public getConfigByLocaleJs():ServiceConfig{
    let serviceConfig = new ServiceConfig();
    serviceConfig.orderServiceAddress = config.getOrderServiceAddress();
    serviceConfig.serviceAddress = config.getServiceAddress();
    serviceConfig.imgPreUrl = config.getImgPreUrl();
    return serviceConfig;
  }

  //本地Json请求
  public getConfigByRemoteFile():Promise<ServiceConfig>{
    return new Promise<ServiceConfig>(resolve => {
      this.getConfigByHttp().then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  }

  private getConfigByHttp():Promise<ServiceConfig>{
    return new Promise<ServiceConfig>(resolve => {
      this.httpService.get("assets/config/serviceConfig.json").map(res => res.json()).subscribe(data => {
        let serviceConfig:ServiceConfig = null;
        if(!AppUtils.isNullObj(data)){
          serviceConfig = new ServiceConfig();
          let env = data.env;//开发环境
          AppUtils.copy(serviceConfig, data[env]);
        }
        resolve(serviceConfig);
      });
    });
  }

}

export class ServiceConfig {
  serviceAddress:string;
  orderServiceAddress:string;
  imgPreUrl:string;

  constructor() {};
}
