
import {QrcodeViewData} from "./qrcode.page";
import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";

export class QrcodeViewDataMgr {

  private static Instance: QrcodeViewDataMgr = new QrcodeViewDataMgr();

  public static getInstance(): QrcodeViewDataMgr{
    return QrcodeViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<QrcodeViewData> = new ViewDataMgr<QrcodeViewData>();

  public setData(vieData: QrcodeViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:QrcodeViewData, func: (viewData: QrcodeViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
