import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {PayQrcodeViewData} from "./payQrcodeViewData";

export class PayQrcodeViewDataMgr{

  private static Instance: PayQrcodeViewDataMgr = new PayQrcodeViewDataMgr();

  public static getInstance(): PayQrcodeViewDataMgr{

    return PayQrcodeViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<PayQrcodeViewData> = new ViewDataMgr<PayQrcodeViewData>();

  public setData(viewData:PayQrcodeViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:PayQrcodeViewData,func:(viewData:PayQrcodeViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
