import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {Message} from "./data/Message";
import {ReqMap} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";

export class MessageMgr {

  public static getInstance():MessageMgr{
    return MgrPool.getInstance().get("MessageMgr",MessageMgr);
  }

  private messageDao: MessageDao;

  constructor() {
    this.messageDao = new MessageDao();
  }

  public findMessageList(storeId:string, beauticianId:string):Promise<Array<Message>>{
    let reqMap =new ReqMap().add("storeId", storeId)
                            .add("beauticianId", beauticianId);
    var findPath = "findMessageList";
    return this.messageDao.findListWithReqParam(findPath, reqMap,-1,-1);
  };
}

export class MessageDao extends AsyncRestDao<Message> {
  constructor() {
    var table = "message";
    super(Message, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
