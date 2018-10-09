import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {GetQrcodeViewData} from "./getQrcode/getQrcode";

@Injectable()
export class StoreQrcodeViewDataMgr{

  private getQrcodeVD:Subject<GetQrcodeViewData> = new BehaviorSubject<GetQrcodeViewData>(null);

  public subscribeGetQrcodeVD(fun:(viewData:GetQrcodeViewData)=>void){
    this.getQrcodeVD.subscribe(fun);
  }

  public setGetQrcodeVD(viewData:GetQrcodeViewData){
    this.getQrcodeVD.next(viewData);
  }

}
