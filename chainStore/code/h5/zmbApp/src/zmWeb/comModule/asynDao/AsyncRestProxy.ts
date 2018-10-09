import {AppUtils} from '../AppUtils';
import {RestResp} from './apiData/RestResp';
import {DataSynCtrl, DataSynResp} from "../dataSyn/DataSynCtrl";
import {AppCfg} from "../AppCfg";
import 'rxjs/add/operator/map';
import {SessionUtil} from "../session/SessionUtil";
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {TipsUtils} from "../TipsUtils";
import {ValidateInfo} from "../validate/ValidateInfo";
import {AppRouter} from "../../views/zmComUtils/AppRouter";

export class AsyncRestProxy {

  private static instance: AsyncRestProxy = new AsyncRestProxy();

  public static getInstance(): AsyncRestProxy {
    return AsyncRestProxy.instance;
  }

  private httpUtils: HttpUtils;

  constructor() {
  }

  public init(http: HttpClient): void {
    this.httpUtils = new HttpUtils(http, AppCfg.withSyn);
  }

  public add(urlP: string, target: any): Promise<RestResp> {
    TipsUtils.getInstance().clear();
    let jsonData = AppUtils.toJson(target);
    return new Promise<RestResp>(resolve => {
      this.httpUtils.post(urlP, jsonData).then(
        function (restResp) {
          TipsUtils.getInstance().update(restResp);
          resolve(restResp);
        }
      );
    });
  };

  public delete(urlP): Promise<RestResp> {
    TipsUtils.getInstance().clear();
    return new Promise<RestResp>(resolve => {
      this.httpUtils.delete(urlP).then(
        function (restResp) {
          TipsUtils.getInstance().update(restResp);
          resolve(restResp);
        }
      );
    });
  };


  public update(urlP: string, target: any): Promise<RestResp> {
    TipsUtils.getInstance().clear();
    let jsonData = AppUtils.toJson(target);
    return new Promise<RestResp>(resolve => {
      this.httpUtils.put(urlP, jsonData).then(
        function (restResp) {
          TipsUtils.getInstance().update(restResp);
          resolve(restResp);
        }
      );
    });
  };


  public get(urlP: string): Promise<RestResp> {
    TipsUtils.getInstance().clear();
    return new Promise<RestResp>(resolve => {
      this.httpUtils.get(urlP).then(
        function (restResp) {
          TipsUtils.getInstance().update(restResp);
          resolve(restResp);
        }
      );
    });
  };


  public rawReq(urlP: string, postParam: any): Promise<RestResp> {
    TipsUtils.getInstance().clear();
    let jsonData = AppUtils.toJson(postParam);
    return new Promise<RestResp>(resolve => {
      this.httpUtils.post(urlP, jsonData).then(
        function (restResp) {
          TipsUtils.getInstance().update(restResp);
          resolve(restResp);
        }
      );
    });
  };

  public list(urlP: string): Promise<RestResp> {
    TipsUtils.getInstance().clear();
    return new Promise<RestResp>(resolve => {
      this.httpUtils.get(urlP).then(
        function (restResp) {
          TipsUtils.getInstance().update(restResp);
          resolve(restResp);
        }
      );
    });
  };

  public uploadFile(urlP: string, formData: FormData): Promise<RestResp> {
    TipsUtils.getInstance().clear();
    return new Promise<RestResp>(resolve => {
      this.httpUtils.postFile(urlP, formData).then(
        function (restResp) {
          TipsUtils.getInstance().update(restResp);
          resolve(restResp);
        }
      );
    });
  };

}


class HttpUtils {

  constructor(public http: HttpClient, private withSyn: boolean) {
  }

  public post(urlP: string, jsonData: string): Promise<RestResp> {

    let headers = this.getHeaders();
    let options = {headers: headers};

    return new Promise<RestResp>(resolve => {
      this.http.post(urlP, jsonData, options).subscribe(data => {
        let restResp: RestResp = null;
        if (!AppUtils.isNullObj(data)) {
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if (restResp.code == 200) {
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      }, error => {
        resolve(null);
        this.preHandleError(error);
      });
    });
  }

  public put(urlP: string, jsonData: string): Promise<RestResp> {
    let headers = this.getHeaders();
    let options = {headers: headers};

    return new Promise<RestResp>(resolve => {

      this.http.put(urlP, jsonData, options).subscribe(data => {
        let restResp: RestResp = null;
        if (!AppUtils.isNullObj(data)) {
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if (restResp.code == 200) {
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      }, error => {
        resolve(null);
        this.preHandleError(error);
      });
    });
  }

  public delete(urlP: string): Promise<RestResp> {
    let headers = this.getHeaders();
    let options = {headers: headers};

    return new Promise<RestResp>(resolve => {
      this.http.delete(urlP, options).subscribe(data => {
        let restResp: RestResp = null;
        if (!AppUtils.isNullObj(data)) {
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if (restResp.code == 200) {
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      }, error => {
        resolve(null);
        this.preHandleError(error);
      });
    });
  }

  public get(urlP: string): Promise<RestResp> {
    let headers = this.getHeaders();
    let options = {headers: headers};

    return new Promise<RestResp>(resolve => {
      this.http.get(urlP, options).subscribe(data => {
        let restResp: RestResp = null;
        if (!AppUtils.isNullObj(data)) {
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if (restResp.code == 200) {
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      }, error => {
        resolve(null);
        this.preHandleError(error);
      });
    });
  }

  public postFile(urlP: string, formData: FormData): Promise<RestResp> {
    let headers = new HttpHeaders();
    headers.append(SessionUtil.HEADER_ACCESS_TOKEN_NAME, SessionUtil.getInstance().getAccessToken());
    let options = {headers: headers};

    return new Promise<RestResp>(resolve => {
      this.http.post(urlP, formData, options).subscribe(data => {
        let restResp: RestResp = null;
        if (!AppUtils.isNullObj(data)) {
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
        }
        resolve(restResp);
      }, error => {
        resolve(null);
        this.preHandleError(error);
      });
    });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    if (!AppUtils.isNullOrWhiteSpace(SessionUtil.getInstance().getAccessToken())) {
      headers = headers.set(SessionUtil.HEADER_ACCESS_TOKEN_NAME, SessionUtil.getInstance().getAccessToken());
    }
    let validateInfo = ValidateInfo.newInstance(SessionUtil.getInstance().getCurStoreId());
    headers = headers.set(SessionUtil.HEADER_ACCESS_VALIDATE_INFO, AppUtils.toJson(validateInfo));

    if (this.withSyn) {
      let verInfoTmp: string = DataSynCtrl.Instance.getSynHeader();
      headers = headers.set(DataSynCtrl.Instance.DATA_SYN_REQ, verInfoTmp);
    }
    return headers;
  };

  private preHandleResp(restResp: RestResp) {
    if (this.withSyn) {
      let respJson: string = restResp.dsResp;
      if (!AppUtils.isNullOrWhiteSpace(respJson)) {
        let dataSynResp: DataSynResp = AppUtils.fromJson(DataSynResp, respJson);
        DataSynCtrl.Instance.synData(dataSynResp);
      }
    }
  }

  private preHandleError(error) {
    if (error.status == 402) {
      AppUtils.showWarn("提示", "登录状态过期，请重新登录");
      AppRouter.getInstance().goLogin();
    } else {
      // AppUtils.showWarn("提示","请求失败");
    }
  }
}
