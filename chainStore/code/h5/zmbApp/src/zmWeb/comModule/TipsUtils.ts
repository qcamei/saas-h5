import {RestResp} from "./asynDao/apiData/RestResp";
import {AppUtils} from "./AppUtils";
import {MgrPool} from "./MgrPool";

export class TipsUtils{

  public static getInstance():TipsUtils{
    return MgrPool.getInstance().get("TipsUtils",TipsUtils);
  }

  constructor() {
  }

  private lastTips:string;

  public update(restResp:RestResp){
    if(restResp && restResp.tips){
      this.lastTips = restResp.tips;
    }
  }

  public showTips(){
    if(this.lastTips){
      AppUtils.showError("错误",this.lastTips);
    }
  }

  public clear(){
    this.lastTips = null;
  }



}
