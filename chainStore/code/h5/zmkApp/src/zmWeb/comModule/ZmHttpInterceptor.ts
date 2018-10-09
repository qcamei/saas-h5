import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptorService } from 'ng-http-interceptor';
import {RespCode} from "./asynDao/apiData/RespCode";

@Injectable()
export class ZmHttpInterceptor {

  constructor(public httpInterceptor: HttpInterceptorService) {
    httpInterceptor.request().addInterceptor(this.requestPreHandle);
    httpInterceptor.response().addInterceptor(this.responsePreHandle);
  }

  private requestPreHandle(data, method, option) {
    return data;
  }

  private responsePreHandle(response){
    return response.map(result => {
      if(result != null){
        let restRespJson = result.json();
        if (restRespJson != null && restRespJson.code == RespCode.SESSION_EXPIRED) {
          //session过期
          console.log(restRespJson.tips);
        }else{
          return result;
        }
      }
    }).catch(error => {
      if (typeof error === 'string') {

      }else if (error != response) {
        response.subscribe(p => {
        })
      }else {
        console.log(error);
      }
      return Observable.throw(error)
    });
  }

}
