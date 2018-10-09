import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy}from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {addBindDeviceModel} from "../Comp/addBindDeviceModel";
import {AppUtils} from "../../../comModule/AppUtils";
import {MngDeviceMgr} from "../../../bsModule/mngDevice/MngDeviceMgr";
import {MngDeviceViewDataMgr} from "../MngDeviceViewDataMgr";
import {ActivatedRoute, Router} from "@angular/router";
import {BUserQueryApiForm} from "../../../bsModule/mngDevice/apiData/buserDevice/BUserQueryApiForm";
import {BUserBindInfo} from "../../../bsModule/mngDevice/data/buserDevice/BUserBindInfo";

/**用户仪器列表**/


@Component({
  selector: '',
  templateUrl: 'buserBindDeviceList.html',
  styleUrls: ['buserBindDeviceList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush


})

export class BUserBindDeviceListPage implements OnInit,OnDestroy {

  private service: BUserBindDeviceListService;
  public  viewData: BUserBindDeviceListViewData;
  private paramsSub: any;
  private viewDataSub: any;

  constructor(private mngDeviceMgr: MngDeviceMgr,
              private mngDeviceViewDataMgr: MngDeviceViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router,
              private modalService: NgbModal) {
    this.service = new BUserBindDeviceListService(this.mngDeviceMgr, this.mngDeviceViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.mngDeviceViewDataMgr.subscribeBUserBindDeviceListVD((viewDataP: BUserBindDeviceListViewData) => {
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

  //添加绑定仪器
  addBindDeviceModel(item: BUserBindInfo) {
    const activeModal = this.modalService.open(addBindDeviceModel,{size:'lg'});
    activeModal.componentInstance.data = item;
    activeModal.componentInstance.action = this.addBindDeviceModelCallback.bind(this);
  }

  addBindDeviceModelCallback(successP:boolean){
    if(successP){
      AppUtils.showSuccess("提示","绑定成功");
      this.getListByReq();
    }else{
      AppUtils.showWarn("提示","绑定失败");
    }

  }

  /**
   * 搜索框回车键按下事件
   * @param event
   */
  onKeyPress(event){
    let keyCode=event.keyCode;
    if(keyCode === 13) this.getListByReq();
  }

  getListByReq(){
    this.service.getPageData(1,this.viewData);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

}

class BUserBindDeviceListService {

  constructor(private mngDeviceMgr: MngDeviceMgr,
              private mngDeviceViewDataMgr: MngDeviceViewDataMgr) {
  }


  public initViewData() :void{
    this.mngDeviceViewDataMgr.setBUserBindDeviceListViewData(new BUserBindDeviceListViewData());
    this.buildViewData((viewDataP:BUserBindDeviceListViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  public handleViewData(viewDataP: BUserBindDeviceListViewData) {
    this.mngDeviceViewDataMgr.setBUserBindDeviceListViewData(viewDataP);
  }

  /**
   * 组装BUserBindDeviceListViewData
   *
   */
  public async buildViewData(callback:(viewDataP:BUserBindDeviceListViewData) => void){
    let viewDataTmp: BUserBindDeviceListViewData = new BUserBindDeviceListViewData();
    let queryParam: BUserQueryApiForm = new BUserQueryApiForm();
    let listCount = await this.mngDeviceMgr.getBUserBindInfoCount(queryParam);
    console.log("count:"+ listCount.count);
    //queryParam.pageItemCount = listCount != null ? listCount.count : 1000000;
    queryParam.pageItemCount = 10;
    queryParam.pageNo = 1;
    let buserBindDeviceListTmp = await this.mngDeviceMgr.findBUserBindInfoList(queryParam);
    //buserBindDeviceListTmp = BusinessUtil.sortListObject(buserBindDeviceListTmp);
    //viewDataTmp.buserBindDeviceList = buserBindDeviceListTmp;
    //viewDataTmp.buserBindDeviceListTmp = buserBindDeviceListTmp;
    viewDataTmp.buserBindDeviceListShow = buserBindDeviceListTmp;
    viewDataTmp.recordCount = listCount.count;
    viewDataTmp.currentPage = 1;
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   *  获取分页数据
   */
  public async getPageData(curPage,viewDataP:BUserBindDeviceListViewData){
    let queryParam: BUserQueryApiForm = new BUserQueryApiForm();
    queryParam.buserPhone = viewDataP.buserPhone;
    let listCount = await this.mngDeviceMgr.getBUserBindInfoCount(queryParam);
    console.log("count:"+ listCount.count);
    queryParam.pageItemCount = 10;
    queryParam.pageNo = curPage;
    let buserBindDeviceListTmp = await this.mngDeviceMgr.findBUserBindInfoList(queryParam);
    //buserBindDeviceListTmp = BusinessUtil.sortListObject(buserBindDeviceListTmp);
    //viewDataP.buserBindDeviceList = buserBindDeviceListTmp;
    //viewDataP.buserBindDeviceListTmp = buserBindDeviceListTmp;
    viewDataP.buserBindDeviceListShow = buserBindDeviceListTmp;
    viewDataP.recordCount = listCount.count;
    viewDataP.currentPage = curPage;
    viewDataP.loadingFinish = true;
    this.handleViewData(viewDataP);
  }

}

export class BUserBindDeviceListViewData{
  buserBindDeviceList: Array<BUserBindInfo> = new Array<BUserBindInfo>(); //原始数据
  buserBindDeviceListTmp: Array<BUserBindInfo> = new Array<BUserBindInfo>(); //临时数据
  buserBindDeviceListShow: Array<BUserBindInfo> = new Array<BUserBindInfo>(); //展示数据

  //查询参数
  buserPhone:string;
  recordCount:number;//总记录数
  currentPage:number; //当前页号
  loadingFinish:boolean = false;
}
