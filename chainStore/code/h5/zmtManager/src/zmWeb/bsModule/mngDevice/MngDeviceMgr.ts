import {Injectable} from '@angular/core';
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ReqMap} from "../../comModule/AppUtils";
import {DeviceDetail} from "./data/buserDevice/DeviceDetail";
import {MClient} from "./data/mclient/MClient";
import {BUserDevice} from "./data/buserDevice/BUserDevice";
import {BUserBindInfo} from "./data/buserDevice/BUserBindInfo";
import {BUserCount} from "./data/buser/BUserCount";
import {MCtrlLockApiForm} from "./apiData/mctrl/MCtrlLockApiForm";
import {RestResp} from "../../comModule/RestResp";
import {BindDeviceForm} from "./apiData/buserDevice/BindDeviceForm";
import {MngDeviceQueryForm} from "./apiData/MngDeviceQueryForm";
import {BUserQueryApiForm} from "./apiData/buserDevice/BUserQueryApiForm";


@Injectable()
export class MngDeviceMgr {

  private deviceDetailDao: DeviceDetailDao;
  private mclientDao: MClientDao;
  private buserDeviceDao: BUserDeviceDao;
  private buserBindInfoDao: BUserBindInfoDao;
  private buserCountDao: BUserCountDao;

  constructor(restProxy: AsyncRestProxy) {
    this.deviceDetailDao = new DeviceDetailDao(restProxy);
    this.mclientDao = new MClientDao(restProxy);
    this.buserDeviceDao = new BUserDeviceDao(restProxy);
    this.buserBindInfoDao = new BUserBindInfoDao(restProxy);
    this.buserCountDao = new BUserCountDao(restProxy);
  }

  /**
   *  根据SN或商家账号查询仪器
   * @param {string} snCode
   * @param {string} bandingAccount
   * @returns {Promise<DeviceDetail>}
   */
  public findDeviceList(queryForm:MngDeviceQueryForm): Promise<Array<DeviceDetail>> {
    let findPath="findDeviceList";
    let reqMap = new ReqMap()
      .add("snCode",queryForm.snCode)
      .add("bandingAccount",queryForm.bandingAccount);
    return new Promise<Array<DeviceDetail>>(resolve => {
      this.deviceDetailDao.findListWithReqParam(findPath,reqMap,queryForm.pageItemCount,queryForm.pageNo).then(
        function (deviceDetailList) {
          resolve(deviceDetailList);
        }
      );
    });
  }

  /**
   *  锁定和解锁仪器
   * @param iotRecordId
   * @param {MCtrlLockApiForm} lockForm
   * @returns {Promise<RestResp>}
   */
  public lock(iotRecordId,lockForm:MCtrlLockApiForm): Promise<MClient>{
    let uriPath = "lock/"+iotRecordId;
    return new Promise<MClient>(resolve => {
      this.mclientDao.addFormByCond(lockForm,uriPath).then(
        function (mclient) {
          resolve(mclient);
      })
    });
  }

  /**
   * 绑定仪器
   * @param {BindDeviceForm} bindForm
   * @returns {Promise<BUserDevice>}
   */
  public binding(bindForm: BindDeviceForm): Promise<BUserDevice> {
    let findPath = "binding";
    return new Promise<BUserDevice>(resolve => {
      this.buserDeviceDao.addFormByCond(bindForm, findPath).then(
        function (buserDevice) {
          resolve(buserDevice);
        }
      );
    });
  }

  /**
   * 解绑仪器
   * @param {BindDeviceForm} bindForm
   * @returns {Promise<BUserDevice>}
   */
  public unbinding(bindForm: BindDeviceForm): Promise<BUserDevice> {
    let findPath = "unbinding";
    return new Promise<BUserDevice>(resolve => {
      this.buserDeviceDao.addFormByCond(bindForm, findPath).then(
        function (buserDevice) {
          resolve(buserDevice);
        }
      );
    });
  }

  /**
   * 绑定商户列表接口
   * @param {BUserQueryApiForm} queryForm
   * @returns {Promise<Array<BUserBindInfo>>}
   */
  public findBUserBindInfoList(queryForm:BUserQueryApiForm):Promise<Array<BUserBindInfo>>{
    let findPath = "findBUserBindInfoList";
    let reqMap = new ReqMap()
      .add("buserPhone",queryForm.buserPhone)
    return new Promise<Array<BUserBindInfo>>(resolve =>{
      this.buserBindInfoDao.findListWithReqParam(findPath,reqMap,queryForm.pageItemCount,queryForm.pageNo).then((buserBindInfoList) =>{
        resolve(buserBindInfoList);
      })
    })
  }

  /**
   * 绑定商户列表总记录数
   * @param {BUserQueryApiForm} queryForm
   * @returns {Promise<BUserCount>}
   */
  public getBUserBindInfoCount(queryForm:BUserQueryApiForm):Promise<BUserCount>{
    let findPath = "getBUserBindInfoCount";
    let reqMap = new ReqMap()
      .add("buserPhone",queryForm.buserPhone);
    return new Promise<BUserCount>(resolve =>{
      this.buserCountDao.findOneWithReqParam(findPath,reqMap).then((buserCount)=>{
        resolve(buserCount);
      })
    })
  }

  /**
   *  根据SN查询设备
   * @param {string} snCode
   * @returns {Promise<MClient>}
   */
  public findMClientList(snCode:string): Promise<Array<MClient>> {
    let findPath="findMClientList";
    let reqMap = new ReqMap()
      .add("snCode",snCode);
    return new Promise<Array<MClient>>(resolve => {
      this.mclientDao.findListWithReqParam(findPath,reqMap,-1,-1).then(
        function (list) {
          resolve(list);
        }
      );
    });
  }

}

/********************* DAO ***************************/
class DeviceDetailDao extends AsyncRestDao<DeviceDetail> {

  constructor(restProxy: AsyncRestProxy) {

    let table: string = "mngDevice";

    super(DeviceDetail, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }

}

class MClientDao extends AsyncRestDao<MClient> {

  constructor(restProxy: AsyncRestProxy) {

    let table: string = "mngDevice";

    super(MClient, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }

}

class BUserDeviceDao extends AsyncRestDao<BUserDevice> {

  constructor(restProxy: AsyncRestProxy) {

    let table: string = "mngDevice";

    super(BUserDevice, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }

}

class BUserBindInfoDao extends AsyncRestDao<BUserBindInfo> {

  constructor(restProxy: AsyncRestProxy) {

    let table: string = "mngDevice";

    super(BUserBindInfo, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }

}

class BUserCountDao extends AsyncRestDao<BUserCount> {

  constructor(restProxy: AsyncRestProxy) {

    let table: string = "mngDevice";

    super(BUserCount, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }

}


