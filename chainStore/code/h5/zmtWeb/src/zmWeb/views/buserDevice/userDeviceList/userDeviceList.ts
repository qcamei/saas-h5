import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef}from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {BUserDeviceViewDataMgr} from "../BUserDeviceViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUserDeviceMgr} from "../../../bsModule/buserDevice/BUserDeviceMgr";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";

import { DevInfoComponent} from "../Comp/devInfoShopModel";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreFindTypeEnum} from "../../../bsModule/store/apiData/StoreFindTypeEnum";
import {DeviceDetail} from "../../../bsModule/buserDevice/data/DeviceDetail";
import {DeviceDetailListMgr} from "../../../bsModule/buserDevice/DeviceDetailListMgr";
import {MCtrlLockApiForm} from "../../../bsModule/buserDevice/apiData/MCtrlLockApiForm";
import {MClientStatusEnum} from "../../../bsModule/buserDevice/data/MClientStatusEnum";
import {MClientLockStateEnum} from "../../../bsModule/buserDevice/data/MClientLockStateEnum";
import {Popup} from "../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**用户仪器列表**/


@Component({
  selector: '',
  templateUrl: 'userDeviceList.html',
  changeDetection: ChangeDetectionStrategy.OnPush


})

export class UserDeviceListPage implements OnInit,OnDestroy {
  public viewData:  UserDeviceListViewData;
  private viewDataSub: any;
  private service:  UserDeviceListSevcie;
  public curPage:number = 1;

  private timer;

  constructor(private buserDeviceViewDataMgr: BUserDeviceViewDataMgr,
              private buserDeviceMgr: BUserDeviceMgr,
              private deviceDetailMgr:DeviceDetailListMgr,
              private storeMgr: StoreMgr,
              private storeSynDataHolder: StoreSynDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog:MatDialog){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new UserDeviceListSevcie(
      this.buserDeviceViewDataMgr,
      this.buserDeviceMgr,
      this.deviceDetailMgr,
      this.storeMgr,
      this.storeSynDataHolder,
    );

    this.timer = setInterval(
      ()=>{
        this.service.getChangeData(this.viewData);
      },5000);
  }

  ngOnInit() {
    this.viewDataSub = this.buserDeviceViewDataMgr.subscribeUserDeviceListVD((viewDataP: UserDeviceListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }

    //清除定时器
    if(this.timer) {
      clearInterval(this.timer);
    }

  }

  public async lockDevice(item:DeviceViewData){
    if(item.status == MClientStatusEnum.Online ){
      Popup.getInstance().open("提示", "是否锁定仪器", () => {
        let lockForm = new MCtrlLockApiForm();
        lockForm.isLock = true;
        lockForm.isSupplier = false;
        this.service.lock(item.iotRecordId,lockForm).then(
          (success)=>{
            this.handleResult(success);
          }
        );
      });
    }else{
      Popup.getInstance().open("提示", "设备不在线，锁定失败", () => {});
    }

  }

  public async unlockDevice(item:DeviceViewData) {
    if (item.status == MClientStatusEnum.Offline) {
      Popup.getInstance().open("提示", "设备不在线，解锁失败", () => {});
    }else {
      if (item.lockState == MClientLockStateEnum.LockedBySupplier) {//   改动
        Popup.getInstance().open("提示", "已被厂家锁定，请联系会员代表", () => {});
      } else {
        Popup.getInstance().open("提示", "是否解锁该仪器", () => {
          let lockForm = new MCtrlLockApiForm();
          lockForm.isLock = false;
          lockForm.isSupplier = false;
          this.service.lock(item.iotRecordId, lockForm).then(
            (success) => {
              this.dealResult(success);
            }
          );
        });
      }
    }
  }

  private handleResult(successP:boolean){
    if(successP){
      AppUtils.showSuccess("提示","已发送锁定指令");
      this.service.initViewData();
      // this.service.refreshViewData(this.viewData,this.curPage);
    }else{
      AppUtils.showSuccess("提示","锁定失败");
    }
  }

  private dealResult(successP:boolean){
    if(successP){
      AppUtils.showSuccess("提示","已发送解锁指令");
      this.service.initViewData();
      // this.service.refreshViewData(this.viewData,this.curPage);
    }else{
      AppUtils.showSuccess("提示","解锁失败");
    }
  }

  //分配到店
  devInfoShopModal(item:DeviceViewData) {
    if(item.storeId!="0"){
      Popup.getInstance().open("提示", "确定重新分配店铺吗？", () => {
        const activeModal = ZmModalMgr.getInstance().newModal(DevInfoComponent);
        activeModal.componentInstance.storeList = this.viewData.storeList;
        activeModal.componentInstance.id = item.id;
        activeModal.componentInstance.selectStoreId = item.storeId;
        activeModal.componentInstance.callBack = this.selectStore.bind(this);
      });
    }else{
      const activeModal = ZmModalMgr.getInstance().newModal(DevInfoComponent);
      activeModal.componentInstance.storeList = this.viewData.storeList;
      activeModal.componentInstance.id = item.id;
      activeModal.componentInstance.callBack = this.selectStore.bind(this);
    }

  }

  //分配到店回调
  selectStore(success){
    if(success){
      this.service.initViewData();
      // this.service.refreshViewData(this.viewData,this.curPage);
    }
  }

  //分页回调
  getPageData(curPage){
    this.curPage = curPage;
    let data = this.viewData.deviceListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.deviceListShow = pageData;
  }

  queryBySN(){
    let snCode = AppUtils.trimBlank(this.viewData.snCode);
    this.service.getBySN(this.viewData,snCode,(viewDataTmp) => {
      this.curPage = 1;
      this.service.handleViewData(viewDataTmp);
   });
  }

}

export class  UserDeviceListViewData {

  store: Store;
  storeList:Array<Store>;
  deviceList: Array<DeviceDetail>;

  deviceListTmp:Array<DeviceViewData>;
  deviceListShow: Array<DeviceViewData>;


  loadingFinish: boolean = false;
  isBoss: boolean = false;
  recordCount:number;

  snCode:string;

}

export class  UserDeviceListSevcie {
  constructor(private buserDeviceViewDataMgr: BUserDeviceViewDataMgr,
              private buserDeviceMgr: BUserDeviceMgr,
              private deviceDetailMgr:DeviceDetailListMgr,
              private storeMgr: StoreMgr,
              private storeSynDataHolder: StoreSynDataHolder,) {

  }

  public initViewData() {
    this.buserDeviceViewDataMgr.setUserDeviceListViewData(new UserDeviceListViewData());

    this.buildViewData().then(
      (viewDataTmp: UserDeviceListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: UserDeviceListViewData) {
    this.buserDeviceViewDataMgr.setUserDeviceListViewData(viewDataP);
  }

  /**
   * 组装productListViewData
   * @param storeId
   * @param status
   * @returns Promise<StorePrdInfoListViewData>
   */

  public async buildViewData(): Promise<UserDeviceListViewData> {

    let viewDataTmp: UserDeviceListViewData = new UserDeviceListViewData();
    let buserId = SessionUtil.getInstance().getUserId();
    let storeId = SessionUtil.getInstance().getStoreId();
    let store: Store = await this.storeSynDataHolder.getData(storeId);

    if (buserId == store.bossId) {
      viewDataTmp.isBoss = true;
    }
    viewDataTmp.storeList = await this.getStoreList(buserId);
    let deviceList:Array<DeviceDetail> = await this.deviceDetailMgr.getDeviceList(buserId);
    viewDataTmp.deviceList = deviceList;//保存原有的

    viewDataTmp.deviceListTmp = await this.buildDeviceViewDataList(deviceList);
    viewDataTmp.recordCount = viewDataTmp.deviceListTmp.length;

    viewDataTmp.deviceListShow = this.sortListObject(viewDataTmp.deviceListTmp);
    viewDataTmp.deviceListShow = AppUtils.getPageData(1, viewDataTmp.deviceListShow);//显示数据
    viewDataTmp.loadingFinish = true;

    return new Promise<UserDeviceListViewData>(resolve => {
      resolve(viewDataTmp);

    });

  }

  /**刷新viewData*/
  public async getChangeData(viewDataTmp){
    let buserId = SessionUtil.getInstance().getUserId();

    let deviceList:Array<DeviceDetail> = await this.deviceDetailMgr.getDeviceList(buserId);
    viewDataTmp.deviceList = deviceList;//保存原有的

    viewDataTmp.deviceListTmp = await this.buildDeviceViewDataList(deviceList);
    viewDataTmp.recordCount = viewDataTmp.deviceListTmp.length;
    viewDataTmp.deviceListShow = this.sortListObject(viewDataTmp.deviceListTmp);
    viewDataTmp.deviceListShow = AppUtils.getPageData(1, viewDataTmp.deviceListShow);//显示数据
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  /**
   *刷新当前页的数据
   */
  public async refreshViewData(viewDataTmp,curPage){
    let viewData: UserDeviceListViewData = new UserDeviceListViewData();
    AppUtils.copy(viewData,viewDataTmp);

    let buserId = SessionUtil.getInstance().getUserId();

    let deviceList:Array<DeviceDetail> = await this.deviceDetailMgr.getDeviceList(buserId);
    viewData.deviceList = deviceList;//保存原有的

    viewData.deviceListTmp = await this.buildDeviceViewDataList(deviceList);
    viewData.recordCount = viewData.deviceListTmp.length;
    viewData.deviceListShow = this.sortListObject(viewData.deviceListTmp);
    viewData.deviceListShow = AppUtils.getPageData(curPage, viewData.deviceListShow);//显示数据

    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  public  sortListObject(listTmp) {
    listTmp = listTmp.sort(function (a, b){
      return b.bandingTime - a.bandingTime;
      });
    return listTmp;
  }

  private async getStoreList(buserId){
    let pageItemCount = 1000;
    let pageNo = 1;
    let findType = StoreFindTypeEnum.All;
    let storeList = await this.storeMgr.getByUser(buserId, pageItemCount, pageNo, findType.toString());
    return storeList;
  }

  private async buildDeviceViewDataList(deviceList:Array<DeviceDetail>){

    let deviceViewDataListTmp: Array<DeviceViewData> = new Array<DeviceViewData>();
    for(let item of deviceList){
      let deviceViewData = new DeviceViewData();
      deviceViewData.id = item.id;
      deviceViewData.iotRecordId = item.iotRecordId;
      deviceViewData.clientId = item.clientId;
      deviceViewData.snCode = item.snCode;
      deviceViewData.mseriesName = item.mseriesName;
      deviceViewData.mtypeName = item.mtypeName;
      deviceViewData.status = item.status;
      deviceViewData.ctrlState = item.ctrlState;
      deviceViewData.lockState = item.lockState;
      deviceViewData.bandingTime = item.bandingTime;
      deviceViewData.storeId = item.storeId;

      let store: Store = await this.storeSynDataHolder.getData(item.storeId);
      if(!AppUtils.isNullObj(store)){
        deviceViewData.storeName = store.name;
      }
      deviceViewDataListTmp.push(deviceViewData);
    }

    return deviceViewDataListTmp;
  }

  public async getBySN(viewData: UserDeviceListViewData, snCode: string, handleCallBack: (viewDataTmp: UserDeviceListViewData) => void) {
    let viewDataTmp: UserDeviceListViewData = new UserDeviceListViewData();
    AppUtils.copy(viewDataTmp,viewData);
    let listTmp: Array<DeviceViewData> = viewData.deviceListTmp;
    if (snCode != "") {
      listTmp = this.filterListBySN(listTmp,snCode);
    }
    viewDataTmp.deviceListShow = listTmp;
    viewDataTmp.recordCount =  listTmp.length;
    handleCallBack(viewDataTmp);
  };


  private filterListBySN(deviceListTmp:Array<DeviceViewData>,snCode:string){
    deviceListTmp = deviceListTmp.filter(itemTmp => {
      if (snCode == itemTmp.snCode) {
        return true;
      } else {
        return false;
      }
    });
    return deviceListTmp;
  }

  public async lock(iotRecordId,lockForm:MCtrlLockApiForm):Promise<boolean>{
    let success = false;
    return new Promise<boolean>(resolve => {
      this.buserDeviceMgr.lock(iotRecordId,lockForm).then(
        (mclient)=>{
          if(!AppUtils.isNullObj(mclient)){
            success = true;
          }
          resolve(success);
        }
      );
    });
  }


}

export class DeviceViewData {

  id: number;
  iotRecordId:number;
  storeId:string;
  storeName: string;
  clientId: string;
  snCode: string;
  mseriesName: string;
  mtypeName: string;
  lockState:number;
  ctrlState:number;
  status:number;
  bandingTime:number;

}
