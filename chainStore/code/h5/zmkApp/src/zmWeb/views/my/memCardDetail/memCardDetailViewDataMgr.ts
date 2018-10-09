import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MemCardDetailViewData} from "./memCardDetailViewData";

export class MemCardDetailViewDataMgr{

  private static Instance: MemCardDetailViewDataMgr = new MemCardDetailViewDataMgr();

  public static getInstance(): MemCardDetailViewDataMgr{

    return MemCardDetailViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MemCardDetailViewData> = new ViewDataMgr<MemCardDetailViewData>();

  public setData(viewData:MemCardDetailViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MemCardDetailViewData,func:(viewData:MemCardDetailViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
