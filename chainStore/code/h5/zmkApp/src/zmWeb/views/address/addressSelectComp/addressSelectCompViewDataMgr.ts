import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";

export class AddressSelectCompViewDataMgr{

  private static Instance: AddressSelectCompViewDataMgr = new AddressSelectCompViewDataMgr();

  public static getInstance(): AddressSelectCompViewDataMgr{

    return AddressSelectCompViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<ReceiverAddress> = new ViewDataMgr<ReceiverAddress>();

  public setData(viewData:ReceiverAddress):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:ReceiverAddress,func:(viewData:ReceiverAddress) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
