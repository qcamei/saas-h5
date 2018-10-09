import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BUserViewDataMgr} from "../BUserViewDataMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {ModalComponent} from "../comp/editIntegralModalComp";
import {BUserUpdateIntegralData} from "../../../bsModule/buser/apiData/BUserUpdateIntegralData";

/**
 * 首页
 */
@Component({
  templateUrl: 'buserList.html',
  styleUrls: ['buserList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class BUserListPage implements OnInit,OnDestroy {

  private viewDataChangeSub: any;
  private service: BUserListService;
  public viewData: BUserListViewData = new BUserListViewData();
  private viewDataSub:any;
  public curPage:1;


  constructor(
    private buserViewDataMgr:BUserViewDataMgr,
    private buserMgr:BUserMgr,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal){
    this.service = new BUserListService(this.buserViewDataMgr,this.buserMgr);
  }

  ngOnInit(): void {

    this.viewDataSub = this.buserViewDataMgr.subscribeBUserListViewDataVD((viewDataP:BUserListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataChangeSub)) {
      this.viewDataChangeSub.unsubscribe();
    }
  }

  //分页回调
  getPageData(curPage) {
    this.curPage = curPage;
    let data = this.viewData.buserListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.buserListShow = pageData;
  }

  queryByName() {
    let name = this.getName();
    this.service.getByName(this.viewData, name, (viewDataTmp) => {
      this.curPage = 1;
      this.service.handleViewData(viewDataTmp);
    });
  }

  private getName() {
    let name = "";
    if (this.viewData.name != null) {
      name = AppUtils.trimBlank(this.viewData.name);
    }
    return name;
  }


  //模态框
  openModal(buser) {
    const activeModal = this.modalService.open(ModalComponent,{backdrop:'static'});
    activeModal.componentInstance.buser = buser;
    activeModal.componentInstance.getIntegral = this.editIntegral.bind(this);
  }

  public async editIntegral(updateIntegralData:BUserUpdateIntegralData){
    let success = await this.buserMgr.updateIntegral(updateIntegralData.openId,updateIntegralData);
    this.dealResult(success);
  }

  public removeBuser(buser){
    (<any>window).Popup.open("提示", "确定删除员工吗？", (callback) => {

      this.buserMgr.deleteBUser(buser.id).then(
        (success)=>{
          if(success){
            AppUtils.showSuccess("提示","删除员工成功");
            this.curPage = 1;
            this.service.initViewData();
          }else{
            AppUtils.showError("提示","删除员工失败");
          }
        }
      );
    });

  }

  private dealResult(successP:boolean){
    if(successP){
      AppUtils.showSuccess("提示","修改积分成功");
      this.curPage = 1;
      this.service.initViewData();
    }else{
      AppUtils.showError("提示","修改积分失败");
    }
  }


}

export class BUserListViewData {

  buserList:Array<BUser>;
  buserListTmp:Array<BUser>;
  buserListShow:Array<BUser>;

  loadingFinish: boolean = false;
  recordCount:number;

  name:string;

}

export class BUserListService {
  constructor(private buserViewDataMgr:BUserViewDataMgr,
              private buserMgr:BUserMgr) {
  }


  public initViewData() {
    this.buserViewDataMgr.setBUserListViewData(new BUserListViewData());

    this.buildViewData().then(
      (viewDataTmp: BUserListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: BUserListViewData) {
    this.buserViewDataMgr.setBUserListViewData(viewDataP);
  }

  /**
   * 组装productListViewData
   * @param storeId
   * @param status
   * @returns Promise<StorePrdInfoListViewData>
   */

  public async buildViewData(): Promise<BUserListViewData> {

    let viewDataTmp: BUserListViewData = new BUserListViewData();

    let buserList:Array<BUser> = await this.buserMgr.getBUserList();
    viewDataTmp.recordCount = buserList.length;
    viewDataTmp.buserListTmp = buserList;
    viewDataTmp.buserListShow = AppUtils.getPageData(1, viewDataTmp.buserListTmp);//显示数据
    viewDataTmp.loadingFinish = true;

    return new Promise<BUserListViewData>(resolve => {
      resolve(viewDataTmp);

    });

  }

  /**
   *刷新当前页的数据
   */
  public async refreshViewData(viewDataTmp,curPage){
    let viewData:BUserListViewData = new BUserListViewData();

    let buserList:Array<BUser> = await this.buserMgr.getBUserList();
    viewData.recordCount = buserList.length;
    viewData.buserListTmp = buserList;
    viewData.buserListShow = AppUtils.getPageData(curPage, viewDataTmp.buserListTmp);//显示数据
    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  public getByName(viewData: BUserListViewData, name: string, handleCallBack: (viewDataTmp: BUserListViewData) => void) {
    let viewDataTmp: BUserListViewData = new BUserListViewData();
    AppUtils.copy(viewDataTmp, viewData);
    let listTmp: Array<BUser> = viewData.buserListTmp;
    if (name != "") {
      listTmp = this.filterListByName(listTmp, name);
    }
    viewDataTmp.buserListShow = listTmp;
    viewDataTmp.recordCount = listTmp.length;
    handleCallBack(viewDataTmp);
  };


  private filterListByName(buserListTmp: Array<BUser>, name: string) {
    buserListTmp = buserListTmp.filter(itemTmp => {
      if ((itemTmp.nickName && itemTmp.nickName.indexOf(name) > -1) || itemTmp.nickName == name) {
        return true;
      } else {
        return false;
      }
    });
    return buserListTmp;
  }


}

