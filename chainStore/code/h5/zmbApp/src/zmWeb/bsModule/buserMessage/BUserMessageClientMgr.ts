import {MsgUnReadCount} from "./data/MsgUnReadCount";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {AppUtils, ReqMap} from "../../comModule/AppUtils";
import {MessageQueryForm} from "./apiData/MessageQueryForm";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {BUserMessage} from "./data/BUserMessage";
import {BUserMessageUpdateForm} from "./apiData/BUserMessageUpdateForm";
import {BUserMessageUpdateStatusForm} from "./apiData/BUserMessageUpdateStatusForm";
import {BUserMessageUpdateType} from "./apiData/BUserMessageUpdateType";
import {BUserMessageBatchUpdateStatusForm} from "./apiData/BUserMessageBatchUpdateStatusForm";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";

export class BUserMessageClientMgr {

  public static getInstance():BUserMessageClientMgr{
    return MgrPool.getInstance().get("BUserMessageClientMgr",BUserMessageClientMgr);
  }

  private bUserMessageClientDao: BUserMessageClientDao;

  constructor() {
    this.bUserMessageClientDao = new BUserMessageClientDao();
  }

  /**
   * 查询是否有未读信息
   * @param buserId
   * @returns {Promise<MsgUnReadCount>}
   */
  public findUnreadMessageCount(buserId:string): Promise<MsgUnReadCount> {
    let reqMap = new ReqMap().add("buserId",buserId);
    let findPath = "findUnReadCount";

    return new Promise<MsgUnReadCount>(resolve=>{
      this.bUserMessageClientDao.getWithReqParam(findPath,reqMap).then((restResp:RestResp)=>{
        let targetTmp:MsgUnReadCount = null;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          targetTmp = new MsgUnReadCount();
          AppUtils.copyJson(targetTmp,restResp.tJson);
        }
        resolve(targetTmp);
      })
    })
  }


  /**
   * 查询消息分页
   * @param queryForm
   * @returns {Promise<Array<BUserMessage>>}
   */
  public findMessagePageInfo(queryForm: MessageQueryForm): Promise<PageResp> {
    let reqMap = new ReqMap().add("buserId", queryForm.buserId)
      .add("messageType", queryForm.messageType.join(','))
      .add("maxTime", queryForm.maxTime)
      .add("minTime", queryForm.minTime)
      .add("pageItemCount", queryForm.pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    let findPath = "findMessagePage";
    return this.bUserMessageClientDao.getPageRespByType(findPath, reqMap, BUserMessage);
  }

  public updateMessage(messageId:number,updateForm:BUserMessageUpdateForm):Promise<boolean>{
    return this.bUserMessageClientDao.updateWithId(messageId,updateForm);
  }

  public updateMessageStatue(messageId:number,updateStatueForm:BUserMessageUpdateStatusForm):Promise<boolean>{
    let updateFrom = new BUserMessageUpdateForm();
    updateFrom.updateType = BUserMessageUpdateType.UpdateState;
    updateFrom.updateStatusData = updateStatueForm
    return this.updateMessage(messageId,updateFrom);
  }

  public updateBatchMessageStatue(messageId:number,updateBatchStatueForm:BUserMessageBatchUpdateStatusForm):Promise<boolean>{
    let updateFrom = new BUserMessageUpdateForm();
    updateFrom.updateType = BUserMessageUpdateType.BatchUpdateState;
    updateFrom.batchUpdateStatusForm = updateBatchStatueForm
    return this.updateMessage(messageId,updateFrom);
  }
}


export class BUserMessageClientDao extends AsyncRestDao<BUserMessage> {
  constructor() {
    var table = "buserMessage";
    super(BUserMessage, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
