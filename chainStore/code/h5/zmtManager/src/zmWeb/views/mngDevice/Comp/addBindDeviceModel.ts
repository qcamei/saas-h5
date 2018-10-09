
import {Component, OnInit, OnDestroy, ChangeDetectorRef, Input, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MClient} from "../../../bsModule/mngDevice/data/mclient/MClient";
import {MngDeviceMgr} from "../../../bsModule/mngDevice/MngDeviceMgr";
import {MngDeviceViewDataMgr} from "../MngDeviceViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {BindDeviceForm} from "../../../bsModule/mngDevice/apiData/buserDevice/BindDeviceForm";
import {ActivatedRoute, Router} from "@angular/router";
import {BUserBindInfo} from "../../../bsModule/mngDevice/data/buserDevice/BUserBindInfo";



@Component({
  selector: 'devInfo-modal',
  template: `
    <div class="modal-header">
      <span class="font-bold">添加绑定仪器</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" >
      <div class="">
        <div class="mg-b-15 disFlex " style="width: 100%">
          <div class="c-devinfo disFlex align-center">
            <input class=" c-devinfo-input mg-r-20" type="text " placeholder="输入SN" [(ngModel)]="viewData.snCode" />
            <button class="c-devinfo-btn" (click)="getListByReq()">查询</button>
          </div>
        </div>

        <div  style="width: 100%">
          <table class="table table-bordered text-center mg-b-0">
            <thead>
              <th>设备SN码</th>
              <th>设备系列</th>
              <th>设备型号</th>
              <th>设备ID</th>
              <th>绑定状态</th>
            </thead>
            <tbody>
            <tr class="c-tr"  *ngFor="let item of viewData.mclientListShow" >
              <td>{{item.snCode}}</td>
              <td>{{item.mseriesName}}</td>
              <td>{{item.mtypeName}}</td>
              <td>{{item.clientId}}</td>
              <td>{{item.isActivated | mclientBindStatePipe}}</td>
            </tr>
            </tbody>
          </table>
        </div>
            <div class="mg-t-30" style="width: 60%;">
                <div class="input-group c-input-group form-group mg-b-30">
                  <label class="c-label">客户代表姓名</label>
                  <input type="text"  placeholder="请输入客户代表姓名"  required   
                         class="form-control pd-r-40" [(ngModel)]="viewData.salesman" />
                </div>
              <div class="input-group c-input-group form-group">
                <label class="c-label">客户代表手机号</label>
                <input type="text"  placeholder="请输入客户代表手机号"  required   
                       class="form-control pd-r-40"[(ngModel)]="viewData.salesmanPhone" />
              </div>
            </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn c-md-btn-modal c-close-btn-modal" style="margin-right: 20px;"  (click)="closeModal()">取消</button>
      <button class="btn c-md-btn-modal c-btn-blue" (click)="confirmBind()" >确认</button>
     
    </div>
  `,
  styles:[`
  

  .c-devinfo-input {
    border-radius: 6px;
    background: #F4F6FA;
    height: 30px;
    border: 1px solid #ECEFF3;
    padding: 0 10px;
    outline: none;
    font-size: 14px;
  }
  .c-devinfo-btn {
    color: #fff;
    background: #4678fa;
    border: none;
    border-radius: 6px;
    height: 30px;
    width: 80px;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    padding: 0 !important;
  }
 .c-label{
   width: 120px;
   text-align: left;
   margin-right: 20px;
   margin-bottom: 0;
 }
`],
})
export class addBindDeviceModel{

  private service: AddBindDeviceService;
  public  viewData: AddBindDeviceViewData;
  private paramsSub: any;
  private viewDataSub: any;
  @Input() data:BUserBindInfo;
  @Output() action:any;

  constructor(private mngDeviceMgr: MngDeviceMgr,
              private mngDeviceViewDataMgr: MngDeviceViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router,
              private activeModal: NgbActiveModal,
              private modalService: NgbModal) {
    this.service = new AddBindDeviceService(this.mngDeviceMgr, this.mngDeviceViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.mngDeviceViewDataMgr.subscribeAddBindDeviceVD((viewDataP: AddBindDeviceViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();

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
   * 查询
   */
  getListByReq() {
    if(AppUtils.isNullOrWhiteSpace(this.viewData.snCode)){
      AppUtils.showInfo("提示","请输入查询条件");
    }else{
      this.service.getListByReq(this.viewData,(viewDataP)=>{
        this.handleResult(viewDataP);
        //this.viewData.currentPage = 1;
      });
    }

  }

  handleResult(viewDataP:AddBindDeviceViewData){
    if(!AppUtils.isNullObj(viewDataP)){
      this.viewData.mclientListShow = viewDataP.mclientListShow;
      this.viewData.recordCount = viewDataP.recordCount;
      this.viewData.currentPage = viewDataP.currentPage;
      this.viewData.loadingFinish = viewDataP.loadingFinish;
    }
    this.mngDeviceViewDataMgr.setAddBindDeviceViewData(this.viewData);

  }
  closeModal() {
    this.activeModal.close();
  }

  confirmBind() {
    if(this.viewData.mclientListShow == null ||
      this.viewData.mclientListShow[0] == null ||
      AppUtils.isNullOrWhiteSpace(this.viewData.mclientListShow[0].snCode)){
      AppUtils.showInfo("提示","仪器不能为空");
      return;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.salesman)){
      AppUtils.showInfo("提示","客户代表姓名不能为空");
      return;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.salesmanPhone)){
      AppUtils.showInfo("提示","客户代表手机号不能为空");
      return;
    }
    if (parseInt(this.viewData.mclientListShow[0].isActivated+"") == 1) {
      (<any>window).Popup.open("提示", "该仪器已绑定", (callback) => {
      });
    }else {
      let bindForm = new BindDeviceForm();
      bindForm.buserId = this.data.buserId;
      bindForm.snCode= this.viewData.mclientListShow[0].snCode;
      bindForm.salesman = this.viewData.salesman;
      bindForm.salesmanPhone = this.viewData.salesmanPhone;
      this.service.binding(bindForm).then(
        (successP)=>{
          this.closeModal();
          this.action(successP);
        }
      );
    }
  }
}

export class AddBindDeviceViewData {
  mclientListShow: Array<MClient> = new Array<MClient>(); //展示数据

  buserId:number;
  salesman:string; //客户代表
  salesmanPhone:string;//客户代表手机号
  //查询参数
  snCode:string;

  recordCount:number;//总记录数
  currentPage:number; //当前页号
  loadingFinish:boolean = false;
}

class AddBindDeviceService {

  constructor(private mngDeviceMgr: MngDeviceMgr,
              private mngDeviceViewDataMgr: MngDeviceViewDataMgr) {
  }

  public initViewData() :void{
    this.mngDeviceViewDataMgr.setAddBindDeviceViewData(new AddBindDeviceViewData());
  }

  public handleViewData(viewDataP: AddBindDeviceViewData) {
    this.mngDeviceViewDataMgr.setAddBindDeviceViewData(viewDataP);
  }



  /**
   * 根据条件查询
   *
   */
  public async getListByReq(viewData:AddBindDeviceViewData,handleCallBack:(viewDataTmp:AddBindDeviceViewData)=>void){
    let viewDataTmp: AddBindDeviceViewData = new AddBindDeviceViewData();
    if(!AppUtils.isNullOrWhiteSpace(viewData.snCode)){
      viewData.snCode  = AppUtils.trimBlank(viewData.snCode);
    }
    let listTmp = await this.mngDeviceMgr.findMClientList(viewData.snCode);
    viewDataTmp.recordCount = listTmp.length;
    viewDataTmp.mclientListShow = listTmp;
    viewDataTmp.currentPage = 1;
    viewDataTmp.loadingFinish = true;
    handleCallBack(viewDataTmp);

  };


  /**
   * 绑定
   */
  public async binding(formData:BindDeviceForm):Promise<boolean>{
    let success = false;
    return new Promise<boolean>(resolve => {
      this.mngDeviceMgr.binding(formData).then(
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
