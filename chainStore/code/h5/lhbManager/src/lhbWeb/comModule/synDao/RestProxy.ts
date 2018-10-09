import { Injectable } from '@angular/core';
import { Http,RequestOptions, Headers } from '@angular/http';

import {AppUtils} from '../AppUtils';
import {RestResp} from '../RestResp';
import {DataSynCtrl, DataSynResp} from "../dataSyn/DataSynCtrl";
import {AppCfg} from "../AppCfg";
// import * as $ from 'jquery';


@Injectable()
export class RestProxy {
  constructor() {
  }

  public add (urlP:string, target:any):RestResp{
    return this.send(urlP,"POST",target);
    // let jsonData = AppUtils.toJson(target);
    // return this.httpUtils.post(urlP,jsonData);
  };

  public delete (urlP ):RestResp{
    return this.send(urlP,"DELETE",null);
    // return this.httpUtils.delete(urlP);
  };


  public update (urlP, target):RestResp {
    return this.send(urlP,"PUT",target);

    // let jsonData = AppUtils.toJson(target);
    // return this.httpUtils.post(urlP,jsonData);
  };

  public get (urlP:string):RestResp {
    return  this.send(urlP,"GET",null);
    // return this.httpUtils.get(urlP);
  };

  public rawReq (urlP:string, postParam:any ):RestResp {
    return this.send(urlP,"POST",postParam);

    // let headers = new Headers({ 'Content-Type': 'application/json' });
    //
    // let options = new RequestOptions({ headers: headers });
    //
    // let jsonData = AppUtils.toJson(postParam);
    //
    // return this.httpUtils.post(urlP,jsonData);
  };


  private send(urlP:string,method:string,paramObj:any):RestResp{
    let postData:string = null;
    if(paramObj){
      postData = AppUtils.toJson(paramObj);
    }
    let restResp:RestResp = new RestResp();
    var proxyTmp = this;

    // $.ajax({
    //   type : method,      //提交方式
    //   contentType: "application/json;charset=utf-8",
    //   url : urlP,         //路径
    //   async:false,
    //   beforeSend: function(req){
    //     proxyTmp.preHandleReq(req);
    //   },//这里设置header
    //   data : postData,    //数据，这里使用的是Json格式进行传输
    //   success : function(resp) {//返回数据根据结果进行相应的处理
    //     AppUtils.copy(restResp,resp);
    //     proxyTmp.preHandleResp(restResp);
    //     restResp.success = true;
    //   },
    //   error: function(XMLHttpRequest, textStatus, errorThrown) {
    //     // AppUtils.Alert.error("请重新尝试","网络请求失败");
    //     console.log(XMLHttpRequest.status);
    //     console.log(XMLHttpRequest.readyState);
    //     console.log(textStatus);
    //     restResp.success = false;
    //   },
    //   complete: function(XMLHttpRequest, textStatus) {
    //     this; // 调用本次AJAX请求时传递的options参数
    //     console.log(this);
    //   }
    // });
    return restResp;
  };

  private preHandleReq(req:any):void{
    console.log("preHandleSynReq");
    if(AppCfg.withSyn){
      let verInfoTmp = DataSynCtrl.Instance.getSynHeader();
      req.setRequestHeader.set(DataSynCtrl.Instance.DATA_SYN_REQ, verInfoTmp);
    }
  };


  private preHandleResp(restResp:RestResp){
    console.log("preHandleResp");
    if(AppCfg.withSyn){
      let respJson:string = restResp.dsResp;
      let dataSynResp:DataSynResp = AppUtils.fromJson(DataSynResp,respJson);
      DataSynCtrl.Instance.synData(dataSynResp);
    }
  }
}


