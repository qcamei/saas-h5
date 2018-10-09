import { Injectable } from '@angular/core';
import {AppUtils} from '../AppUtils';
import {RestResp} from '../RestResp';
import {DataSynCtrl, DataSynResp} from "../dataSyn/DataSynCtrl";
import {AppCfg} from "../AppCfg";
import 'rxjs/add/operator/map';
import {SessionUtil} from "../session/SessionUtil";
import {AppRouter} from "../AppRouter";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ValidateInfo} from "../validate/ValidateInfo";

@Injectable()
export class AsyncRestProxy {
  private httpUtils: HttpUtils;

  constructor(http: HttpClient) {
    this.httpUtils = new HttpUtils(http, AppCfg.withSyn,);
  }

  public add(urlP: string, target: any): Promise<RestResp> {
      let jsonData = AppUtils.toJson(target);
      return new Promise<RestResp>(resolve => {
        this.httpUtils.post(urlP, jsonData).then(
          function (restResp) {
            resolve(restResp);
          }
        );
      });
  };

  public delete(urlP): Promise<RestResp> {
      return new Promise<RestResp>(resolve => {
        this.httpUtils.delete(urlP).then(
          function (restResp) {
            resolve(restResp);
          }
        );
      });
  };


  public update(urlP:string, target:any): Promise<RestResp> {
      let jsonData = AppUtils.toJson(target);
      return new Promise<RestResp>(resolve => {
        this.httpUtils.put(urlP, jsonData).then(
          function (restResp) {
            resolve(restResp);
          }
        );
      });
  };


  public get(urlP: string): Promise<RestResp> {
    return new Promise<RestResp>(resolve => {
      this.httpUtils.get(urlP).then(
        function (restResp) {
          resolve(restResp);
        }
      )
    })
  };


  public rawReq(urlP: string, postParam: any): Promise<RestResp> {
      let jsonData = AppUtils.toJson(postParam);
      return new Promise<RestResp>(resolve => {
        this.httpUtils.post(urlP, jsonData).then(
          function (restResp) {
            resolve(restResp);
          }
        );
      });
  };

  public list(urlP: string): Promise<RestResp> {
    return new Promise<RestResp>(resolve => {
      this.httpUtils.get(urlP).then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  };

  public uploadFile(urlP: string, formData: FormData): Promise<RestResp> {
    return new Promise<RestResp>(resolve => {
      this.httpUtils.postFile(urlP, formData).then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  };

}


class HttpUtils {

  constructor(public http: HttpClient, private withSyn:boolean) {
  }

  public post(urlP: string, jsonData: string):Promise<RestResp> {
    let headers = this.getHeaders();
    // let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.post(urlP, jsonData, {headers: headers}).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      },error =>{
        resolve(null);
        this.preHandleError(error);
      });
    });
  }

  public put( urlP: string, jsonData: string):Promise<RestResp> {
    let headers = this.getHeaders();
    // let options = new RequestOptions({headers: headers});
    return new Promise<RestResp>(resolve => {
      this.http.put(urlP, jsonData, {headers: headers}).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      },error =>{
        resolve(null);
        this.preHandleError(error);

      });
    });
  }

  public delete( urlP: string):Promise<RestResp> {
    let headers = this.getHeaders();
    // let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.delete(urlP, {headers: headers}).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      },error =>{
        resolve(null);
        this.preHandleError(error);
      });
    })
  }

  public get( urlP: string):Promise<RestResp> {
    let headers = this.getHeaders();
    // let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.get(encodeURI(urlP), {headers: headers}).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      },error =>{
        resolve(null);
        this.preHandleError(error);
      });
    })
  }

  public postFile(urlP: string, formData: FormData):Promise<RestResp> {
    let headers = new HttpHeaders().set(SessionUtil.HEADER_ACCESS_TOKEN_NAME,SessionUtil.getInstance().getAccessToken());
    // let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.post(urlP, formData, {headers: headers}).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      },error =>{
        resolve(null);
        this.preHandleError(error);
      });
    });
  }

  private getHeaders():HttpHeaders{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    if(!AppUtils.isNullOrWhiteSpace(SessionUtil.getInstance().getAccessToken())){
      headers = headers.set(SessionUtil.HEADER_ACCESS_TOKEN_NAME,SessionUtil.getInstance().getAccessToken());
    }
    if(!AppUtils.isNullObj(SessionUtil.getInstance().getBossId())){
      let validateInfo = ValidateInfo.newInstance(SessionUtil.getInstance().getBossId());
      headers = headers.set(SessionUtil.HEADER_BOSS_ID,AppUtils.toJson(validateInfo));
    }
    if(this.withSyn){
      let verInfoTmp:string = DataSynCtrl.Instance.getSynHeader();
      headers = headers.set(DataSynCtrl.Instance.DATA_SYN_REQ, verInfoTmp);
    }
    return headers;
  };

  private preHandleResp(restResp: RestResp) {
    if(this.withSyn){
      let respJson:string = restResp.dsResp;
      if(!AppUtils.isNullOrWhiteSpace(respJson)){
        let dataSynResp:DataSynResp = AppUtils.fromJson(DataSynResp,respJson);
        DataSynCtrl.Instance.synData(dataSynResp);
      }
    }
  }

  private preHandleError(error) {
    if(error.status == 402){
      // AppUtils.showWarn("提示","登录状态过期，请重新登录");
      AppRouter.goLogin();
    }else{
      // AppUtils.showWarn("提示","请求失败");
    }
  }
}
