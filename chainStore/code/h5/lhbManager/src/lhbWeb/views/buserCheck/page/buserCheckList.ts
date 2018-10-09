import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BUserCheckViewDataMgr} from "../BUserCheckViewDataMgr";
import {BUserCheck} from "../../../bsModule/buserCheck/apiData/BUserCheck";
import {BUserCheckMgr} from "../../../bsModule/buserCheck/BUserCheckMgr";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUserAddApiForm} from "../../../bsModule/buser/apiData/BUserAddApiForm";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserCheckUpdateStatusData} from "../../../bsModule/buserCheck/apiData/BUserCheckUpdateStatusData";
import {BUserCheckStatusEnum} from "../../../bsModule/buserCheck/apiData/BUserCheckStatusEnum";


@Component({
  templateUrl: 'buserCheckList.html',
  styleUrls: ['buserCheckList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class BUserCheckListPage implements OnInit,OnDestroy {

  private viewDataChangeSub: any;
  private service: BUserCheckListService;
  public viewData: BUserCheckListViewData = new BUserCheckListViewData();
  public viewDataSub:any;
  public curPage:number = 1;

  constructor(
    private buserCheckViewDataMgr:BUserCheckViewDataMgr,
    private buserCheckMgr:BUserCheckMgr,
    private buserMgr:BUserMgr,
    private cdRef: ChangeDetectorRef){
    this.service = new BUserCheckListService(this.buserCheckViewDataMgr,this.buserCheckMgr,this.buserMgr);
  }

  ngOnInit(): void {

    this.viewDataSub = this.buserCheckViewDataMgr.subscribeBUserCheckViewDataVD((viewDataP:BUserCheckListViewData) => {
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


  //分页回调
  getPageData(curPage) {
    this.curPage = curPage;
    let data = this.viewData.buserCheckListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.buserCheckListShow = pageData;
  }

  public async agreen(buserCheck){
      let buserAddForm: BUserAddApiForm = this.buildAddForm(buserCheck);
      let addSuccess = await this.service.addBUser(buserAddForm);
      if(addSuccess){
        AppUtils.showSuccess("提示","已同意加入");
        await this.service.updateStatus(buserCheck.id,BUserCheckStatusEnum.PASSCHECK);
        this.curPage = 1;
        this.service.initViewData();
      }else{
        AppUtils.showError("提示","同意失败");
      }

  }

  private buildAddForm(buserCheck:BUserCheck){
    let buserAddForm: BUserAddApiForm = new BUserAddApiForm();
    buserAddForm.name = buserCheck.buserName;
    buserAddForm.nickName = buserCheck.nickName;
    buserAddForm.openId = buserCheck.openId;
    buserAddForm.headImg = buserCheck.headImg;
    return buserAddForm;
  }

  public async disAgreen(buserCheck){
    let success = await this.service.updateStatus(buserCheck.id,BUserCheckStatusEnum.NOTPASSCHECK);
    if(success){
      AppUtils.showSuccess("提示","操作成功");
      this.curPage = 1;
      this.service.initViewData();
    }else{
      AppUtils.showError("提示","操作失败");
    }
  }

}

export class BUserCheckListViewData {
  buserCheckList:Array<BUserCheck>;
  buserCheckListTmp:Array<BUserCheck>;
  buserCheckListShow:Array<BUserCheck>;

  loadingFinish: boolean = false;
  recordCount:number;

  name:string;

}

export class BUserCheckListService {
  constructor(private buserCheckViewDataMgr:BUserCheckViewDataMgr,
              private buserCheckMgr:BUserCheckMgr,
              private buserMgr:BUserMgr,) {
  }

  public initViewData() {
    this.buserCheckViewDataMgr.setBUserCheckViewData(new BUserCheckListViewData());

    this.buildViewData().then(
      (viewDataTmp: BUserCheckListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: BUserCheckListViewData) {
    this.buserCheckViewDataMgr.setBUserCheckViewData(viewDataP);
  }

  /**
   * 组装productListViewData
   * @param storeId
   * @param status
   * @returns Promise<StorePrdInfoListViewData>
   */

  public async buildViewData(): Promise<BUserCheckListViewData> {

    let viewDataTmp: BUserCheckListViewData = new BUserCheckListViewData();

    let buserCheckList:Array<BUserCheck> = await this.buserCheckMgr.getList();
    viewDataTmp.recordCount = buserCheckList.length;
    viewDataTmp.buserCheckListTmp = buserCheckList;
    viewDataTmp.buserCheckListShow = AppUtils.getPageData(1, viewDataTmp.buserCheckListTmp);//显示数据
    viewDataTmp.loadingFinish = true;

    return new Promise<BUserCheckListViewData>(resolve => {
      resolve(viewDataTmp);

    });

  }

  public getByName(viewData: BUserCheckListViewData, name: string, handleCallBack: (viewDataTmp: BUserCheckListViewData) => void) {
    let viewDataTmp: BUserCheckListViewData = new BUserCheckListViewData();
    AppUtils.copy(viewDataTmp, viewData);
    let listTmp: Array<BUserCheck> = viewData.buserCheckListTmp;
    if (name != "") {
      listTmp = this.filterListByName(listTmp, name);
    }
    viewDataTmp.buserCheckListShow = listTmp;
    viewDataTmp.recordCount = listTmp.length;
    handleCallBack(viewDataTmp);
  };


  private filterListByName(buserListTmp: Array<BUserCheck>, name: string) {
    buserListTmp = buserListTmp.filter(itemTmp => {
      if ((itemTmp.buserName && itemTmp.buserName.indexOf(name) > -1) || itemTmp.buserName == name) {
        return true;
      } else {
        return false;
      }
    });
    return buserListTmp;
  }


  public addBUser(addForm) {
    let success = true;
    return new Promise<BUser>(resolve => {
      this.buserMgr.addBUser(addForm).then(
        function (buser) {
          if(AppUtils.isNullObj(buser)){
            success = false;
          }else{
            success = false;
          }
          resolve(buser);
        }
      );
    });

  }

  public updateStatus(buserCheckId: number, state: number): Promise<boolean> {
    let updateStatusData = new BUserCheckUpdateStatusData();
    updateStatusData.status = state;
    updateStatusData.id = buserCheckId;
    return new Promise(resolve => {
      this.buserCheckMgr.updateStatus(buserCheckId,updateStatusData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

}

