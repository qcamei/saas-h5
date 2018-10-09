
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {ShareViewData} from "./share.page";

export class ShareViewDataMgr{

  private static Instance: ShareViewDataMgr = new ShareViewDataMgr();

  public static getInstance(): ShareViewDataMgr{

    return ShareViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<ShareViewData> = new ViewDataMgr<ShareViewData>();

  public setData(viewData:ShareViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:ShareViewData,func:(viewData:ShareViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
