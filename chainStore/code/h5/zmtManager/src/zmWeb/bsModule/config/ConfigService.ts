import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AppUtils} from "../../comModule/AppUtils";
import {Constants} from "../../views/common/Util/Constants";
import {AppCfg} from "../../comModule/AppCfg";
import {SessionUtil} from "../../comModule/SessionUtil";

/**
 * 系统初始化的时候，加载远程的配置文件
 */
@Injectable()
export class ConfigService {

  constructor(private httpService: Http) {}

  public async initServiceConfig(){
    let isExperience = SessionUtil.getItemOrigin(Constants.ISEXPERIENCE);
    if(!AppUtils.isNullOrWhiteSpace(isExperience)){//体验账号
      AppCfg.getInstance().setEnv(Constants.EXPERIENCE);
    }

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
      this.httpService.get("assets/config/serviceConfig.json").map(res => res.json()).subscribe(data => {
        if(!AppUtils.isNullObj(data)){
          resolve(data);
        }
      });
    });
  }

}


