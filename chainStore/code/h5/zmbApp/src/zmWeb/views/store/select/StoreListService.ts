import {StoreListViewData} from "./StoreListViewData";
import {StoreListViewDataMgr} from "./StoreListViewDataMgr";
import {MainViewData} from "../../main/MainViewData";


export class StoreListService{

  constructor(){}

  public async buildViewData(){

    let viewDataTmp:StoreListViewData = new StoreListViewData();
    viewDataTmp.storeList = MainViewData.getInstance().storeList;
    viewDataTmp.loadFinish = true;
    StoreListViewDataMgr.getInstance().setData(viewDataTmp);
  }

}
