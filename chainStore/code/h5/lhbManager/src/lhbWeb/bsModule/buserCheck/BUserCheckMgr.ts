import {Injectable} from '@angular/core';
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUserCheckUpdateApiForm} from "./apiData/BUserCheckUpdateApiForm";
import {BUserCheckUpdateType} from "./apiData/BUserCheckUpdateType";
import {BUserCheck} from "./apiData/BUserCheck";
import {BUserCheckUpdateStatusData} from "./apiData/BUserCheckUpdateStatusData";
import {BUserCheckAddApiForm} from "./apiData/BUserCheckAddApiForm";


@Injectable()
export class BUserCheckMgr {

  private buserCheckDao: BUserCheckDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserCheckDao = new BUserCheckDao(restProxy);
  }

  public add(buserCheckAddForm: BUserCheckAddApiForm): Promise<BUserCheck> {

    return new Promise<BUserCheck>(resolve => {
      this.buserCheckDao.add(buserCheckAddForm).then(
        function (buserCheck) {
          resolve(buserCheck);
        }
      );
    });
  }

  public get(id: String): Promise<BUserCheck> {

    return new Promise<BUserCheck>(resolve => {
      this.buserCheckDao.get(id).then(
        function (buserCheck) {
          resolve(buserCheck);
        }
      );
    });
  }

  public getList(): Promise<Array<BUserCheck>> {
    let findPath = "/list";
    let pageItemCount = -1;
    let pageNo = 1;

    return new Promise<Array<BUserCheck>>(resolve => {
      this.buserCheckDao.findList(findPath,pageItemCount,pageNo).then(
        function (buserCheckList) {
          resolve(buserCheckList);
        }
      );
    });
  }


  public updateStatus(buserCheckId, updateStatusData:BUserCheckUpdateStatusData):Promise<boolean> {
    var buserCheckUpdateApiForm = new BUserCheckUpdateApiForm();
    buserCheckUpdateApiForm.updateType = BUserCheckUpdateType.updateStatus;
    buserCheckUpdateApiForm.updateStatusData = updateStatusData;
    return new Promise<boolean>(resolve => {
      this.buserCheckDao.updateWithId(buserCheckId, buserCheckUpdateApiForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }
}

class BUserCheckDao extends AsyncRestDao<BUserCheck> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "buserCheck";
    super(BUserCheck, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}


