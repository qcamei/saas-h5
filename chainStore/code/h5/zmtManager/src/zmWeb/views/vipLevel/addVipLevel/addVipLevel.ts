import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {ActivatedRoute, Router} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {VipLevelViewDataMgr} from "../VipLevelViewDataMgr";
import {AddVipLevelForm} from "../../../bsModule/vipLevel/apiData/AddVipLevelForm";
import {PageResp} from "../../../comModule/PageResp";
import {VipContent} from "../../../bsModule/vipLevel/data/VipContent";
import {StoreMenu} from "../../../bsModule/storeMenu/data/StoreMenu";
import {StoreMenuMgr} from "../../../bsModule/storeMenu/storeMenuMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {QueryVipLevelForm} from "../../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {AppCfg} from "../../../comModule/AppCfg";
import {QueryVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/QueryVipLevelTypeForm";
import {VipLevelTypeMgr} from "../../../bsModule/vipLevelType/VipLevelTypeMgr";
import {VipLevelType} from "../../../bsModule/vipLevelType/data/VipLevelType";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddTypeAndReturnComp} from "../../vipLevelType/comp/AddTypeAndReturnComp";

@Component({
  selector: 'add-vipLevel',
  templateUrl: 'addVipLevel.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddVipLevelPage implements OnInit,OnDestroy {
  private service: AddVipLevelService;
  public viewData: AddVipLevelViewData;
  private viewDataSub: any;

  constructor(private vipLevelMgr: VipLevelMgr,
              private vipLevelViewDataMgr: VipLevelViewDataMgr,
              private storeMenuMgr: StoreMenuMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router,
              private modalService: NgbModal,) {

    this.service = new AddVipLevelService(this.vipLevelMgr, this.vipLevelViewDataMgr, this.storeMenuMgr, this.vipLevelTypeMgr);
  }


  ngOnInit() {

    this.viewDataSub = this.vipLevelViewDataMgr.subscribeAddVipLevelVD((viewDataP: AddVipLevelViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  addVipLevelType() {
    const activeModal = this.modalService.open(AddTypeAndReturnComp, {backdrop: 'static'});
    activeModal.componentInstance.modalHeader = '新建分类';
    let tmp = this;
    activeModal.componentInstance.callback = (addTypeId:number) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };

  }

  private refreshTypeList(addTypeId:number) {
    let queryTypeForm: QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    this.vipLevelTypeMgr.getAllList(queryTypeForm).then((typePageResp)=>{
      if (typePageResp && typePageResp.list && typePageResp.list.length > 0) {
        this.viewData.typeList = typePageResp.list;
        this.viewData.addForm.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      }
    });
  }


  /**
   * 上传图片回调函数
   */
  showImg(img: string) {
    if (!AppUtils.isNullOrWhiteSpace(img)) {
      this.viewData.addForm.imgPaths = [];
      this.viewData.addForm.imgPaths.push(img);
      this.viewData.addForm.defualtImg = img;
    }
  }

  getPermSet(pemSet: Array<number>) {
    this.viewData.addForm.vipContent.permSet = pemSet;
  }

  public async addVipLevel() {
    let successForm = this.checkForm();
    if (successForm) {
      let addFormData = AddVipLevelForm.fromAddviewData(this.viewData.addForm);
      let success = await this.service.addVipLevel(addFormData);
      this.handleResult(success);
    }

  }

  private checkForm(): boolean {
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.addForm.number)
      || AppUtils.isNullOrWhiteSpace(this.viewData.addForm.name)
      || AppUtils.isNullObj(this.viewData.addForm.typeId)
      || AppUtils.isNullObj(this.viewData.addForm.openCharge)
      || AppUtils.isNullObj(this.viewData.addForm.renewCharge)
      || AppUtils.isNullObj(this.viewData.addForm.validPeriod)) {
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }
    return checkSuccess;
  }

  /**
   * 处理结果
   */
  private handleResult(success: boolean): void {
    if (success) {
      AppUtils.showSuccess("提示", "新建成功");
      AppRouter.goVipLevelList();
    } else {
      AppUtils.showError("提示", "新建失败");
    }
  }

}

export class AddVipLevelViewData {
  numberList: Array<string> = new Array<string>();
  typeList: Array<VipLevelType> = new Array<VipLevelType>();

  addForm: AddviewData = new AddviewData();
  storeMenu: StoreMenu = new StoreMenu();
  pageData: PageData = new PageData();

  loadingFinish: boolean = false;
}


class PageData {
  public requestUrl: string;//上传图片请求url
  public limitCount: number = 1;
  public maxCount: number = 1;
}

export class AddviewData {
  number: string;
  name: string;
  namePass: boolean;

  typeId: number = 1;
  validPeriod: number;
  validPeriodPass: boolean;
  validPeriodUnit: number;
  openCharge: number;
  renewCharge: number;
  state: boolean = true;
  vipContent: VipContent = new VipContent();
  vipContentPass: boolean;
  imgPaths: Array<string>;
  defualtImg: string;
}

class AddVipLevelService {

  constructor(private vipLevelMgr: VipLevelMgr,
              private vipLevelViewDataMgr: VipLevelViewDataMgr,
              private storeMenuMgr: StoreMenuMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,) {
  }

  public initViewData(): void {
    this.vipLevelViewDataMgr.setAddVipLevelViewData(new AddVipLevelViewData());
    this.buildViewData().then(
      (viewDataTmp: AddVipLevelViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddVipLevelViewData) {
    this.vipLevelViewDataMgr.setAddVipLevelViewData(viewDataP);
  }

  public async buildViewData(): Promise<AddVipLevelViewData> {
    let viewDataTmp: AddVipLevelViewData = new AddVipLevelViewData();
    let queryForm: QueryVipLevelForm = new QueryVipLevelForm();
    let pageResp: PageResp = await this.vipLevelMgr.getAllList(queryForm);
    if (pageResp.list && pageResp.list.length > 0) {
      for (let vipLevel of pageResp.list) {
        viewDataTmp.numberList.push(vipLevel.number);
      }
    }

    let queryTypeForm: QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    let typePageResp: PageResp = await this.vipLevelTypeMgr.getAllList(queryTypeForm);
    if (typePageResp && typePageResp.list && typePageResp.list.length > 0) {
      viewDataTmp.typeList = typePageResp.list;
    }

    viewDataTmp.storeMenu = await this.storeMenuMgr.getStoreMenu();
    let mark = Math.random() * 100000;
    viewDataTmp.pageData.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/vipLevel/" + mark;

    viewDataTmp.loadingFinish = true;

    return new Promise<AddVipLevelViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public addVipLevel(formData: AddVipLevelForm): Promise<boolean> {
    return this.vipLevelMgr.addVipLevel(formData);
  }

}


