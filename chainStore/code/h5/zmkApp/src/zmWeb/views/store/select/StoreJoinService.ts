import {JoinStoreForm} from "../../../bsModule/store/apiData/JoinStoreForm";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {RestResp} from "../../../comModule/asynDao/apiData/RestResp";
import {SessionUtil} from "../../../comModule/session/SessionUtil";


export class StoreJoinService{

  constructor(){}

  public async joinStore(storeId:string) :Promise<RestResp> {
    let joinStoreForm = new JoinStoreForm();
    joinStoreForm.storeId = storeId;
    joinStoreForm.cuserId = SessionUtil.getInstance().getLoginCUserId();
    return await StoreMgr.getInstance().joinStore(joinStoreForm);
  }
}
