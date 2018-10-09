import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {PayTypeSelectViewData} from "./payTypeSelectViewData";

export class PayTypeSelectViewDataMgr{

  private static Instance: PayTypeSelectViewDataMgr = new PayTypeSelectViewDataMgr();

  public static getInstance(): PayTypeSelectViewDataMgr{

    return PayTypeSelectViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<PayTypeSelectViewData> = new ViewDataMgr<PayTypeSelectViewData>();

  public setData(viewData:PayTypeSelectViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:PayTypeSelectViewData,func:(viewData:PayTypeSelectViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
