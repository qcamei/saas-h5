import {MgrPool} from "../../comModule/MgrPool";
import {ReqMap} from "../../comModule/AppUtils";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Dynamic} from "./data/Dynamic";
import {AppCfg} from "../../comModule/AppCfg";
import {DynamicQueryForm} from "./apiData/DynamicQueryForm";
import {DynamicAddForm} from "./apiData/DynamicAddForm";
import {DynamicUpdateApiForm} from "./apiData/DynamicUpdateApiForm";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {DynamicUpdateInfoForm} from "./apiData/DynamicUpdateInfoForm";
import {DynamicUpdateType} from "./apiData/DynamicUpdateType";
import {DynamicUpdateStatusForm} from "./apiData/DynamicUpdateStatusForm";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
export class DynamicMgr {

  public static getInstance(): DynamicMgr {
    return MgrPool.getInstance().get("DynamicMgr", DynamicMgr);
  }

  private dynamicDao: DynamicDao;

  constructor() {
    this.dynamicDao = new DynamicDao();
  }

  public get(dynamicId:number): Promise<Dynamic> {
    return this.dynamicDao.get(dynamicId);
  };

  public addDynamic(addForm:DynamicAddForm): Promise<Dynamic> {
    return this.dynamicDao.add(addForm);
  };

  public findPage(queryForm: DynamicQueryForm): Promise<PageResp> {
    var findPath = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("buserId", queryForm.buserId)
      .add("status", queryForm.status.toString())
      .add("content", queryForm.content)
      .add("minTime", queryForm.minTime.toString())
      .add("maxTime", queryForm.maxTime.toString())
      .add("pageNo", queryForm.pageNo.toString())
      .add("pageItemCount", queryForm.pageItemCount.toString());
    return null;//todo 此处返回类型出错 暂时注释 by Bai
    // return this.dynamicDao.getPageRespByType(findPath, reqMap, Dynamic);
  };

  public updateDynamicInfo(dynamicId:number,updateInfoForm:DynamicUpdateInfoForm):Promise<RestResp>{
    let updateForm = new DynamicUpdateApiForm();
    updateForm.updateType = DynamicUpdateType.UpdateDynamicInfo;
    updateForm.updateInfoForm = updateInfoForm;
    return this.update(dynamicId,updateForm);
  };

  public updateDynamicStatus(dynamicId:number,updateStatusForm:DynamicUpdateStatusForm):Promise<RestResp>{
    let updateForm = new DynamicUpdateApiForm();
    updateForm.updateType = DynamicUpdateType.UpdateDynamicStatus;
    updateForm.updateStatusForm = updateStatusForm;
    return this.update(dynamicId,updateForm);
  };

  public update(dynamicId:number,updateForm:DynamicUpdateApiForm): Promise<RestResp> {
    return this.dynamicDao.update4Resp(dynamicId,updateForm);
  };
}

export class DynamicDao extends AsyncRestDao<Dynamic> {
  constructor() {
    var table = "dynamic";
    super(Dynamic, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
