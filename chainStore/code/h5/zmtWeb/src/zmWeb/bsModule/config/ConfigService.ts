import {Injectable} from "@angular/core";
import {AppUtils} from "../../comModule/AppUtils";
import {AppCfg} from "../../comModule/AppCfg";
import {HttpClient} from "@angular/common/http";

/**
 * 系统初始化的时候，加载远程的配置文件
 */
@Injectable()
export class ConfigService {

  constructor(private httpService: HttpClient) {}

  public async initServiceConfig(){

    //方便自动化部署 有两种获取配置方式
    if(AppCfg.LOCAL_FLAG){//通过读取远程配置文件
      let configJson = await this.getConfigByRemoteFile();
      AppCfg.getInstance().setConfigJson(configJson);//保存配置文件数据
    }
    AppCfg.getInstance().initEnv();//初始化环境配置
  }

  //本地Json请求
  public getConfigByRemoteFile():Promise<any>{
    return new Promise<any>(resolve => {
      this.getConfigByHttp().then(
        function (data) {
          resolve(data);
        }
      );
    });
  }

  private getConfigByHttp():Promise<any>{
    return new Promise<any>(resolve => {
      this.httpService.get("assets/config/serviceConfig.json").subscribe(data => {
        if(!AppUtils.isNullObj(data)){
          resolve(data);
        }
      });
    });
  }

}


