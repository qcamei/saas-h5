import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {VipLevelViewDataMgr} from "../VipLevelViewDataMgr";
import {PageResp} from "../../../comModule/PageResp";
import {VipContent} from "../../../bsModule/vipLevel/data/VipContent";
import {StoreMenu} from "../../../bsModule/storeMenu/data/StoreMenu";
import {StoreMenuMgr} from "../../../bsModule/storeMenu/storeMenuMgr";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {AppRouter} from "../../../comModule/AppRouter";
import {UpdateVipLevelForm} from "../../../bsModule/vipLevel/apiData/UpdateVipLevelForm";
import {VipLevelStateEnum} from "../../../bsModule/vipLevel/data/VipLevelStateEnum";
import {QueryVipLevelForm} from "../../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {AppCfg} from "../../../comModule/AppCfg";
import {QueryVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/QueryVipLevelTypeForm";
import {VipLevelTypeMgr} from "../../../bsModule/vipLevelType/VipLevelTypeMgr";
import {VipLevelType} from "../../../bsModule/vipLevelType/data/VipLevelType";
import {AddTypeAndReturnComp} from "../../vipLevelType/comp/AddTypeAndReturnComp";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'edit-vipLevel',
  templateUrl: 'editVipLevel.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditVipLevelPage implements OnInit,OnDestroy {
  private service: EditVipLevelService;
  public  viewData: EditVipLevelViewData;
  private viewDataSub: any;
  private paramsSub: any;

  constructor(private vipLevelMgr: VipLevelMgr,
              private vipLevelViewDataMgr: VipLevelViewDataMgr,
              private storeMenuMgr:StoreMenuMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private modalService: NgbModal,) {

    this.service = new EditVipLevelService(this.vipLevelMgr, this.vipLevelViewDataMgr,this.storeMenuMgr,this.vipLevelTypeMgr);
  }


  ngOnInit() {

    this.viewDataSub = this.vipLevelViewDataMgr.subscribeEditVipLevelVD((viewDataP: EditVipLevelViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let vipLevelId = params['id'];
      this.service.initViewData(vipLevelId);
    });
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    if(!AppUtils.isNullObj(this.paramsSub)){
      this.paramsSub.unsubscribe();
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
        this.viewData.editForm.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      }
    });
  }

  /**
   * 上传图片回调函数
   */
  showImg(img:string) {
    if(!AppUtils.isNullOrWhiteSpace(img)){
      this.viewData.pageData.imgArr = [];
      this.viewData.pageData.imgArr.push(img);
    }
  }

  getPermSet(pemSet:Array<number>){
    this.viewData.editForm.vipContent.permSet = pemSet;
  }

  public async editVipLevel(vipLevelId:number) {
    let successForm = this.checkForm();
    if(successForm){
      let editFormData = UpdateVipLevelForm.fromEditviewData(this.viewData.editForm);
      if(this.viewData.pageData.imgArr && this.viewData.pageData.imgArr.length>0){
        editFormData.imgPaths = this.viewData.pageData.imgArr;
        editFormData.defualtImg = this.viewData.pageData.imgArr[0];
      }
      let success = await this.service.editVipLevel(vipLevelId,editFormData);
      this.handleResult(success);
    }

  }

  private checkForm():boolean{
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.editForm.number)
      || AppUtils.isNullOrWhiteSpace(this.viewData.editForm.name)
      || AppUtils.isNullObj(this.viewData.editForm.typeId)
      || AppUtils.isNullObj(this.viewData.editForm.openCharge)
      || AppUtils.isNullObj(this.viewData.editForm.renewCharge)
      || AppUtils.isNullObj(this.viewData.editForm.validPeriod)){
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
      AppUtils.showSuccess("提示", "编辑成功");
      AppRouter.goVipLevelList();
    }else{
      AppUtils.showError("提示", "编辑失败");
    }
  }

}

export class EditVipLevelViewData {
  numberList:Array<string> = new Array<string>();
  typeList:Array<VipLevelType> = new Array<VipLevelType>();

  editForm:EditviewData = new EditviewData();
  storeMenu:StoreMenu = new StoreMenu();
  pageData:PageData = new PageData();

  loadingFinish:boolean = false;
}


class PageData{
  public requestUrl: string;//上传图片请求url
  public limitCount:number = 1;
  public imgArr = new Array<string>();
}

export class EditviewData{
  id:number;
  number: string;
  name: string;
  namePass:boolean;
  typeId: number;
  validPeriod: number;
  validPeriodPass:boolean;
  validPeriodUnit: number;
  openCharge: number;
  renewCharge: number;
  state:boolean;
  vipContent: VipContent = new VipContent();
  imgPaths: Array<string> = new Array<string>();
  defualtImg:string;
  constructor(){}

  public static fromVipLevel(vipLevel:VipLevel){
    let target = new EditviewData();
    target.id = vipLevel.id;
    target.number = vipLevel.number;
    target.name = vipLevel.name;
    target.typeId = vipLevel.typeId;
    target.validPeriod = vipLevel.validPeriod;
    target.validPeriodUnit = vipLevel.validPeriodUnit;
    target.openCharge = AppUtils.moneyF2Y(vipLevel.openCharge);
    target.renewCharge = AppUtils.moneyF2Y(vipLevel.renewCharge);
    target.vipContent = vipLevel.vipContent;
    target.imgPaths = vipLevel.imgPaths;
    target.defualtImg = vipLevel.defualtImg;
    vipLevel.state == VipLevelStateEnum.OPEN?target.state = true:target.state = false;
    return target;
  }
}

class EditVipLevelService {

  constructor(private vipLevelMgr: VipLevelMgr,
              private vipLevelViewDataMgr: VipLevelViewDataMgr,
              private storeMenuMgr:StoreMenuMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,
  ) {
  }

  public initViewData(vipLevelId:number) :void{
    this.vipLevelViewDataMgr.setEditVipLevelViewData(new EditVipLevelViewData());
    this.buildViewData(vipLevelId).then(
      (viewDataTmp: EditVipLevelViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditVipLevelViewData) {
    this.vipLevelViewDataMgr.setEditVipLevelViewData(viewDataP);
  }

  public async buildViewData(vipLevelId:number): Promise<EditVipLevelViewData>{
    let viewDataTmp: EditVipLevelViewData = new EditVipLevelViewData();
    let queryForm:QueryVipLevelForm = new QueryVipLevelForm();
    let pageResp:PageResp = await this.vipLevelMgr.getAllList(queryForm);
    if(pageResp.list && pageResp.list.length>0){
      for (let vipLevel of pageResp.list) {
        viewDataTmp.numberList.push(vipLevel.number);
      }
    }

    let queryTypeForm: QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    let typePageResp: PageResp = await this.vipLevelTypeMgr.getAllList(queryTypeForm);
    if (typePageResp && typePageResp.list && typePageResp.list.length > 0) {
      viewDataTmp.typeList = typePageResp.list;
    }

    let vipLevel:VipLevel = await this.vipLevelMgr.getVipLevel(vipLevelId);
    viewDataTmp.editForm = EditviewData.fromVipLevel(vipLevel);

    viewDataTmp.storeMenu = await this.storeMenuMgr.getStoreMenu();

    if(viewDataTmp.editForm.defualtImg){
      viewDataTmp.pageData.imgArr.push(viewDataTmp.editForm.defualtImg);
    }

    viewDataTmp.pageData.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/vipLevel/"+vipLevelId;
    viewDataTmp.loadingFinish = true;

    return new Promise<EditVipLevelViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public editVipLevel(vipLevelId,formData: UpdateVipLevelForm): Promise<boolean> {
    return this.vipLevelMgr.updateVipLevel(vipLevelId,formData);
  }

}


