import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppUtils} from "../../../comModule/AppUtils";
import {DeviceDetail} from "../../../bsModule/mngDevice/data/buserDevice/DeviceDetail";
import {MngDeviceMgr} from "../../../bsModule/mngDevice/MngDeviceMgr";
import {MngDeviceViewDataMgr} from "../MngDeviceViewDataMgr";
import {BindDeviceForm} from "../../../bsModule/mngDevice/apiData/buserDevice/BindDeviceForm";
import {ActivatedRoute, Router} from "@angular/router";
import {MCtrlLockApiForm} from "../../../bsModule/mngDevice/apiData/mctrl/MCtrlLockApiForm";
import {MngDeviceQueryForm} from "../../../bsModule/mngDevice/apiData/MngDeviceQueryForm";



@Component({
  selector:'devSurvey',
  templateUrl:'./deviceDetailList.html',
  styleUrls:['./deviceDetailList.scss'],

})
export class DeviceDetailListPage implements OnInit,OnDestroy {

  private service: DeviceDetailListService;
  public  viewData: DeviceDetailListViewData;
  private paramsSub: any;
  private viewDataSub: any;
  public buerPhone:string;

  constructor(private mngDeviceMgr: MngDeviceMgr,
    private mngDeviceViewDataMgr: MngDeviceViewDataMgr,
    private cdRef: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal) {
    this.service = new DeviceDetailListService(this.mngDeviceMgr, this.mngDeviceViewDataMgr);
  }


  ngOnInit() {

    this.viewDataSub = this.mngDeviceViewDataMgr.subscribeDeviceDetailListVD((viewDataP: DeviceDetailListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    this.route.params.subscribe((params) => {
      this.buerPhone = params['buserPhone'];
      this.service.initViewData(this.buerPhone);

    });

  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.paramsSub)){
      this.paramsSub.unsubscribe();  //取消订阅 防止内存泄露
    }
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }

  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    let data = this.viewData.deviceDetailListTmp;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.deviceDetailListShow = pageData;
  }

  handleResult(viewDataP:DeviceDetailListViewData){
    if(!AppUtils.isNullObj(viewDataP)){
      this.viewData.deviceDetailListTmp = viewDataP.deviceDetailListTmp;
      this.viewData.deviceDetailListShow = viewDataP.deviceDetailListShow;
      this.viewData.recordCount = viewDataP.recordCount;
      this.viewData.currentPage = viewDataP.currentPage;
      this.viewData.loadingFinish = viewDataP.loadingFinish;
    }
    this.mngDeviceViewDataMgr.setDeviceDetailListViewData(this.viewData);

  }

  /**
   * 搜索框回车键按下事件
   * @param event
   */
  // onKeyPress(event){
  //   let keyCode=event.keyCode;
  //   if(keyCode === 13) this.getListByReq();
  // }

  /**
   * 查询
   */
  getListByReq() {
    if(AppUtils.isNullOrWhiteSpace(this.viewData.snCode) && AppUtils.isNullOrWhiteSpace(this.viewData.bandingAccount)){
      AppUtils.showInfo("提示","请输入查询条件");
    }else{
      this.service.getListByReq(this.buerPhone,(deviceDetailListTmp)=>{
        this.handleResult(deviceDetailListTmp);
        //this.viewData.currentPage = 1;
      });
    }

  }

  //锁定
  lockDevice(item:DeviceDetail){
    if (parseInt(item.status+"") == 0) {
      (<any>window).Popup.open("提示", "设备不在线，锁定失败", (callback) => {
      });
    }else {
      (<any>window).Popup.open("提示", "是否锁定仪器", (callback) => {
        let lockForm = new MCtrlLockApiForm();
        lockForm.isLock = true;
        lockForm.isSupplier = true;
        this.service.lock(item.iotRecordId,lockForm).then(
          (successP)=>{
            if(successP){
              AppUtils.showSuccess("提示","已发送锁定指令");
              this.service.getListByReq(this.buerPhone,(deviceDetailListTmp)=>{
                this.handleResult(deviceDetailListTmp);
              });

            }else{
              AppUtils.showWarn("提示","锁定失败");
            }
          }
        );
      });
    }

  }

  //解锁
  unlockDevice(item:DeviceDetail) {
    if (parseInt(item.status+"") == 0) {
      (<any>window).Popup.open("提示", "设备不在线，解锁失败", (callback) => {
      });
    }else {
      (<any>window).Popup.open("提示", "是否解锁该仪器", (callback) => {
        let lockForm = new MCtrlLockApiForm();
        lockForm.isLock = false;
        lockForm.isSupplier = true;
        this.service.lock(item.iotRecordId, lockForm).then(
          (successP) => {
            if(successP){
              AppUtils.showSuccess("提示","已发送解锁指令");
              this.service.getListByReq(this.buerPhone,(deviceDetailListTmp)=>{
                this.handleResult(deviceDetailListTmp);
              });
            }else{
              AppUtils.showWarn("提示","解锁失败");
            }
          }
        );
      });
    }
  }

  /**
   * 重置按钮点击事件
   */
  // reset(){
  //   this.viewData.clientId = null;
  //   this.viewData.snCode = null;
  //   this.viewData.bandingAccount = null;
  //   this.viewData.status = -1;
  //   this.viewData.bandingSystem = -1;
  //   this.viewData.sortField = SortFieldEnum.LastUpdateTime;
  //   //this.getListByReq();
  // }


  //解绑点击事件
  unbinding(item:DeviceDetail) {
    let formData = new BindDeviceForm();
    formData.snCode = item.snCode;
    formData.buserId = item.buserId;
    let tmp = this;
    let title = "提示";
    let content = "解绑";
    (<any>window).Popup.open(title, "确定" + content + "吗？", (callback) => {
      tmp.service.unbinding(formData).then(
        (successP) => {
          if(successP){
            AppUtils.showSuccess("提示","解绑成功");
            this.service.getListByReq(this.buerPhone,(deviceDetailListTmp)=>{
              this.handleResult(deviceDetailListTmp);
            });
          }else{
            AppUtils.showWarn("提示","解绑失败");
          }
        }
      );
    });

  }


}

export class DeviceDetailListViewData {
  deviceDetailList: Array<DeviceDetail> = new Array<DeviceDetail>(); //原始数据
  deviceDetailListTmp: Array<DeviceDetail> = new Array<DeviceDetail>(); //临时数据
  deviceDetailListShow: Array<DeviceDetail> = new Array<DeviceDetail>(); //展示数据

  deviceDetail: DeviceDetail = new DeviceDetail();
  //查询参数
  snCode:string;
  bandingAccount:string;

  recordCount:number;//总记录数
  currentPage:number; //当前页号
  loadingFinish:boolean = false;
}


class DeviceDetailListService {

  constructor(private mngDeviceMgr: MngDeviceMgr,
              private mngDeviceViewDataMgr: MngDeviceViewDataMgr) {
  }

  public initViewData(buserPhone:string) :void{
    this.mngDeviceViewDataMgr.setDeviceDetailListViewData(new DeviceDetailListViewData());
    this.buildViewData(buserPhone,(viewDataP:DeviceDetailListViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  public handleViewData(viewDataP: DeviceDetailListViewData) {
    this.mngDeviceViewDataMgr.setDeviceDetailListViewData(viewDataP);
  }

  /**
   * 组装ViewData
   *
   */
  public async buildViewData(buserPhone:string,callback:(viewDataP:DeviceDetailListViewData) => void){
    let viewDataTmp: DeviceDetailListViewData = new DeviceDetailListViewData();
    let queryParam: MngDeviceQueryForm = new MngDeviceQueryForm();
    queryParam.pageItemCount = 1000;
    queryParam.pageNo = 1;
    if(!AppUtils.isNullOrWhiteSpace(buserPhone)) {
      queryParam.bandingAccount = AppUtils.trimBlank(buserPhone);
    }
    let deviceDetailListTmp = await this.mngDeviceMgr.findDeviceList(queryParam);
    viewDataTmp.deviceDetailList = deviceDetailListTmp;
    viewDataTmp.recordCount = deviceDetailListTmp.length;
    viewDataTmp.deviceDetailListTmp = deviceDetailListTmp;
    viewDataTmp.deviceDetailListShow = AppUtils.getPageData(1, deviceDetailListTmp);
    viewDataTmp.currentPage = 1;
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }


  /**
   * 根据条件查询
   *
   */
  public async getListByReq(buserPhone:string,handleCallBack:(viewDataTmp:DeviceDetailListViewData)=>void){
    let viewDataTmp: DeviceDetailListViewData = new DeviceDetailListViewData();
    let queryParam: MngDeviceQueryForm = new MngDeviceQueryForm();
    queryParam.pageItemCount = 1000;
    queryParam.pageNo = 1;
    if(!AppUtils.isNullOrWhiteSpace(buserPhone)) {
      queryParam.bandingAccount = AppUtils.trimBlank(buserPhone);
    }
    let deviceDetailListTmp = await this.mngDeviceMgr.findDeviceList(queryParam);
    viewDataTmp.deviceDetailList = deviceDetailListTmp;
    viewDataTmp.recordCount = deviceDetailListTmp.length;
    viewDataTmp.deviceDetailListTmp = deviceDetailListTmp;
    viewDataTmp.deviceDetailListShow = AppUtils.getPageData(1, deviceDetailListTmp);
    viewDataTmp.currentPage = 1;
    viewDataTmp.loadingFinish = true;
    handleCallBack(viewDataTmp);

  };


  /**
   * 锁定和解锁
   * @param iotRecordId
   * @param {MCtrlLockApiForm} lockForm
   * @returns {Promise<boolean>}
   */
  public async lock(iotRecordId,lockForm:MCtrlLockApiForm):Promise<boolean>{
    let success = false;
    return new Promise<boolean>(resolve => {
      this.mngDeviceMgr.lock(iotRecordId,lockForm).then(
        (mclient)=>{
          if(!AppUtils.isNullObj(mclient)){
            success = true;
          }
          resolve(success);
        }
      );
    });
  }

  /**
   * 解绑
   */
  public async unbinding(formData:BindDeviceForm):Promise<boolean>{
    let success = false;
    return new Promise<boolean>(resolve => {
      this.mngDeviceMgr.unbinding(formData).then(
        (target)=>{
          if(!AppUtils.isNullObj(target)){
            success = true;
          }
          resolve(success);
        }
      );
    });
  }
}
