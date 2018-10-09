import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ReqMap} from "../../comModule/AppUtils";
import {ChainUpdateType} from "./apiData/ChainUpdateType";
import {AppCfg} from "../../comModule/AppCfg";
import {Chain} from "./data/Chain";
import {ChainAddForm} from "./apiData/ChainAddForm";
import {ChainUpdateForm} from "./apiData/ChainUpdateForm";
import {ChainUpdateInfoForm} from "./apiData/ChainUpdateInfoForm";
import {ApplyChainDoForm} from "./apiData/ApplyChainDoForm";
import {ApplyChainBatchDoForm} from "./apiData/ApplyChainBatchDoForm";
import {RelieveStoreForm} from "./apiData/RelieveStoreForm";


@Injectable()
export class ChainMgr {
  private chainDao: ChainDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainDao = new ChainDao(restProxy);
  }

  public getChain(chainId:string): Promise<Chain> {
    return this.chainDao.get(chainId);
  };


  public findByUser(userId): Promise<Chain> {
    var findPath = "findByBuser";
    let reqMap = new ReqMap();
    reqMap.add("userId", userId);
    return this.chainDao.findOneWithReqParam(findPath, reqMap);
  }

  public addChain(chainForm:ChainAddForm): Promise<Chain> {
    return this.chainDao.add(chainForm);
  }

  public updateChainInfo(updateData:ChainUpdateInfoForm): Promise<boolean> {
    let chainUpdateForm:ChainUpdateForm = new ChainUpdateForm();
    chainUpdateForm.updateType = ChainUpdateType.UpdateChainInfo;
    chainUpdateForm.chainUpdateInfoForm = updateData;
    return this.chainDao.updateWithId(updateData.chainId,chainUpdateForm);
  }

  public handleApplyChain(applyForm:ApplyChainDoForm): Promise<boolean> {
    let chainUpdateForm:ChainUpdateForm = new ChainUpdateForm();
    chainUpdateForm.updateType = ChainUpdateType.HandleApplyChain;
    chainUpdateForm.applyChainDoForm = applyForm;
    return this.chainDao.updateWithId(applyForm.chainId,chainUpdateForm);
  }

  public relieveStore(relieveStoreForm:RelieveStoreForm): Promise<boolean> {
    let chainUpdateForm:ChainUpdateForm = new ChainUpdateForm();
    chainUpdateForm.updateType = ChainUpdateType.RelieveStore;
    chainUpdateForm.relieveStoreForm = relieveStoreForm;
    return this.chainDao.updateWithId(relieveStoreForm.chainId,chainUpdateForm);
  }

  public batchHandleApplyChain(batchApplyForm:ApplyChainBatchDoForm): Promise<boolean> {
    let chainUpdateForm:ChainUpdateForm = new ChainUpdateForm();
    chainUpdateForm.updateType = ChainUpdateType.BatchHandleApplyChain;
    chainUpdateForm.applyChainBatchDoForm = batchApplyForm;
    return this.chainDao.updateWithId(batchApplyForm.chainId,chainUpdateForm);
  }

}

export class ChainDao extends AsyncRestDao<Chain> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chain";
    super(Chain, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
