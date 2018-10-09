import { Injectable } from '@angular/core';
import { Http,RequestOptions, Headers } from '@angular/http';
import {AppUtils} from '../AppUtils';
import {RestResp} from '../RestResp';
import {DataSynCtrl, DataSynResp} from "../dataSyn/DataSynCtrl";
import {AppCfg} from "../AppCfg";
import 'rxjs/add/operator/map';
import {SessionUtil} from "../SessionUtil";
import {Constants} from "../../views/common/Util/Constants";

@Injectable()
export class AsyncRestProxy {
  private httpUtils: HttpUtils;

  constructor(http: Http) {
    this.httpUtils = new HttpUtils(http, AppCfg.withSyn);
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
          // console.log("restResp" + restResp);
          resolve(restResp);
        }
      );
    });
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

  constructor(public http: Http, private withSyn:boolean) {
  }

  public post(urlP: string, jsonData: string):Promise<RestResp> {

    let headers = this.getHeaders();
    let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.post(urlP, jsonData, options).map(res => res.json()).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      });
    });
  }

  public put( urlP: string, jsonData: string):Promise<RestResp> {
    let headers = this.getHeaders();
    let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {

      this.http.put(urlP, jsonData, options).map(res => res.json()).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      });
    });
  }

  public delete( urlP: string):Promise<RestResp> {
    let headers = this.getHeaders();
    let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.delete(urlP, options).map(res => res.json()).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      });
    });
  }

  public get( urlP: string):Promise<RestResp> {
    let headers = this.getHeaders();
    let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.get(urlP, options).map(res => res.json()).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
          if(restResp.code == 200){
            this.preHandleResp(restResp);
          }
        }
        resolve(restResp);
      });
    });
  }

  public postFile(urlP: string, formData: FormData):Promise<RestResp> {
    let headers = new Headers();
    headers.append(SessionUtil.getInstance().HEADER_ACCESS_TOKEN_NAME,SessionUtil.getInstance().getAccessToken());
    let options = new RequestOptions({headers: headers});

    return new Promise<RestResp>(resolve => {
      this.http.post(urlP, formData, options).map(res => res.json()).subscribe(data => {
        let restResp:RestResp = null;
        if(!AppUtils.isNullObj(data)){
          restResp = new RestResp();
          AppUtils.copy(restResp, data);
        }
        resolve(restResp);
      });
    });
  }

  private getHeaders():Headers{
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append(SessionUtil.getInstance().HEADER_ACCESS_TOKEN_NAME,SessionUtil.getInstance().getAccessToken());
    return headers;
  };

  private preHandleResp(restResp:RestResp){
    if(this.withSyn){
      let respJson:string = restResp.dsResp;
      if(!AppUtils.isNullOrWhiteSpace(respJson)){
        let dataSynResp:DataSynResp = AppUtils.fromJson(DataSynResp,respJson);
        DataSynCtrl.Instance.synData(dataSynResp);
      }
    }
  }
}
