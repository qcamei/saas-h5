import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {StorePackageProjectMgr} from "../../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {PackageProjectType} from "../../../../bsModule/storePackageProject/data/PackageProjectType";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {ProductData} from "../../comp/packageContentComp/PackageContentCompViewData";
import {PackageItem} from "../../../../bsModule/packageProjectDetail/data/PackageItem";
import {PackageItemEnum} from "../../../../bsModule/packageProjectDetail/data/PackageItemEnum";
import {ActivatedRoute} from "@angular/router";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/packageProjectDetail/packageProjectDetailCacheDateHolder";
import {PackageProjectDetail} from "../../../../bsModule/packageProjectDetail/data/PackageProjectDetail";
import {StoreGoods} from "../../../../bsModule/storeGoods/data/StoreGoods";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {PackageProjectUpdateForm} from "../../../../bsModule/storePackageProject/apiData/PackageProjectUpdateForm";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {PriceData} from "../addPackage/addPackage";
import {PackageStateEnum} from "../../../../bsModule/storePackageProject/data/PackageStateEnum";
import {UseTypeEnum} from "../../pipe/UseTypeEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {Constants} from "../../../common/Util/Constants";
import {AppCfg} from "../../../../comModule/AppCfg";
import {AddPackageTypeWithReturnComp} from "../../addTypeWithReturn/addPackageTypeWithReturn";
import {PromotionFlagEnum} from "../../../../comModule/enum/PromotionFlagEnum";


@Component({
  selector: 'edit-package',
  templateUrl: 'editPackage.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPackageComp implements OnInit {

  private service: EditPackageService;
  public viewData: EditPackageViewData;
  private viewDataSub: any;
  public paramsSub: any;
  public requestUrl: string;

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog,
              public route: ActivatedRoute,) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditPackageService(
      this.storePackageProjectMgr,
      this.storePackageProjectSynDataHolder,
      this.storePackageProjectViewDataMgr,
      this.packageDetailCacheDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storePackageProjectViewDataMgr.subscribeEditPackageVD((viewDataP: EditPackageViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    this.paramsSub = this.route.params.subscribe(params => {
      let packageDetailId = params['id'];
      let serviceAddress = AppCfg.getInstance().getServiceAddress();
      this.requestUrl = serviceAddress + '/img/saveImgs/img/goods/' + packageDetailId;
      this.service.initViewData(packageDetailId);
    });

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    if (!AppUtils.isNullObj(this.paramsSub)) {
      this.paramsSub.unsubscribe();
    }
  }

  /**
   * 上传图片回调函数
   */
  showImg(imgArr: Array<string>) {
    if (imgArr.length != 0) {
      if (this.viewData.pageData.defaultImg == Constants.PACKAGE_DEFAULT_IMG) {
        AppUtils.removeFromArray(this.viewData.pageData.imgPathListTmp, this.viewData.pageData.defaultImg);
      }
      this.viewData.pageData.imgPathListTmp = this.viewData.pageData.imgPathListTmp.concat(imgArr);
      this.viewData.pageData.limitCount = Constants.MAX_UPLOAD_IMG - this.viewData.pageData.imgPathListTmp.length;
    }
  }


  addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId: string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddPackageTypeWithReturnComp,modalData,callBack);
  }

  private refreshTypeList(addTypeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storePackageProjectMgr.getStorePackageProject(storeId).then((storePackageProject) => {
      this.viewData.typeList = storePackageProject.getValidPackageTypeMap().values();
      this.viewData.packageDetail.typeId = addTypeId;
      this.service.handleViewData(this.viewData);
    });
  }


  //计算折后价
  autoSetDiscount() {
    if (this.viewData.packageContentList.length == 0) {
      return;
    }
    let priceData = new PriceData();
    priceData.price = this.viewData.packageDetail.sellPrice;
    this.viewData.packageContentList.forEach(item => {
      priceData.totalPrice += item.price * item.count;
      priceData.totalPrice = AppUtils.twoDecimal(priceData.totalPrice);
    });
    let rate: number = priceData.price / priceData.totalPrice;
    for (let item of this.viewData.packageContentList) {
      item.discountPrice = item.price * rate;
      item.discountPrice = AppUtils.twoDecimal(item.discountPrice);
      if (item.discountPrice > item.price) {
        item.discountPrice = item.price;
      }
    }
  }


  /**number唯一性*/
  checkNumber() {
    if (!AppUtils.isNullOrWhiteSpace(this.viewData.pageData.defaultNumber)) {
      let number = this.viewData.packageDetail.number;
      let numberList: Array<string> = this.viewData.packageNumberList;

      if (this.viewData.pageData.defaultNumber != number) {
        if (AppUtils.arrayContains(numberList, this.viewData.pageData.defaultNumber)) {
          this.viewData.pageData.isExitNumber = true;
        } else {
          this.viewData.pageData.isExitNumber = false;
        }
      }

      if (this.viewData.pageData.defaultNumber.match("^\\s*[\\w-]+\\s*$")) {
        this.viewData.pageData.notRightNumber = false;
      } else {
        this.viewData.pageData.notRightNumber = true;
      }
    }
  }


  /**
   * 编辑套餐点击事件
   */
  public editFormData = new PackageProjectUpdateForm();

  public async editPackage() {
    let successForm = this.checkForm();
    if (successForm) {
      this.buildEditForm();
      let success = await this.service.editPackage(this.editFormData);
      this.handleResult(success);
    }

  }

  private checkForm(): boolean {
    this.checkNumber();
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.packageDetail.number)
      || AppUtils.isNullObj(this.viewData.packageDetail.typeId)
      || AppUtils.isNullOrWhiteSpace(this.viewData.packageDetail.name)
      || AppUtils.isNullObj(this.viewData.packageDetail.sellPrice)) {
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }

    if (this.viewData.packageContentList.length == 0) {
      AppUtils.showWarn("提示", "请选择套餐内容");
      return;
    }

    if (this.viewData.packageDetail.sellPrice > this.viewData.pageData.totalPrice) {
      AppUtils.showWarn("提示", "套餐售价不能大于产品总价");
      return;
    }

    if(this.viewData.packageDetail.promotionPrice>this.viewData.packageDetail.sellPrice){
      AppUtils.showWarn("提示","促销价不能大于售价");
      return;
    }

    let isAutoSet = false;
    for (let item of this.viewData.packageContentList) {
      if (item.discountPrice == 0) {
        isAutoSet = true;
      }
    }
    if (isAutoSet) {
      this.autoSetDiscount();
    }

    return checkSuccess;
  }

  private buildEditForm() {
    AppUtils.copy(this.editFormData, this.viewData.packageDetail);
    (this.viewData.pageData.state == true) ? this.editFormData.state = PackageStateEnum.Open : this.editFormData.state = PackageStateEnum.Close;
    this.viewData.pageData.promotionFlag === true ? this.editFormData.promotionFlag = PromotionFlagEnum.Yes : this.editFormData.promotionFlag = PromotionFlagEnum.No;
    this.editFormData.imgPaths = this.viewData.pageData.imgPathListTmp;
    this.editFormData.defaultImg = this.viewData.pageData.imgPathListTmp[0];
    this.editFormData.packageItems = this.buildPackageItems();
  }

  private buildPackageItems() {
    let packageItems: Array<PackageItem> = new Array<PackageItem>();
    for (let item of this.viewData.packageContentList) {
      let packageItem = new PackageItem();
      packageItem.pgId = item.id;
      item.type == ItemTypeEnum.PRODUCT ? packageItem.itemType = PackageItemEnum.PRODUCT : packageItem.itemType = PackageItemEnum.GOODS;
      packageItem.itemType = item.type;
      packageItem.count = item.count;
      packageItem.discountPrice = item.discountPrice;
      packageItems.push(packageItem);
    }
    return packageItems;
  }


  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goPackageList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }

}

class EditPackageService {

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,) {
  }

  public initViewData(packageDetailId: string): void {
    this.storePackageProjectViewDataMgr.setEditPackageViewData(new EditPackageViewData());

    this.buildViewData(packageDetailId).then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditPackageViewData) {
    this.storePackageProjectViewDataMgr.setEditPackageViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId
   * @returns Promise<AddPackageViewData>
   */
  public async buildViewData(packageDetailId: string): Promise<EditPackageViewData> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp = new EditPackageViewData();

    let storeProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    if (storeProductInfo) {
      viewDataTmp.productInfoMap = storeProductInfo.getAllProductInfoMap();
    }
    if (storeGoods) {
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
    }

    viewDataTmp.packageDetail = await this.packageDetailCacheDataHolder.getData(packageDetailId);
    if (viewDataTmp.packageDetail) {
      viewDataTmp.pageData.defaultNumber = viewDataTmp.packageDetail.number;
      viewDataTmp.packageDetail.state == PackageStateEnum.Open ? viewDataTmp.pageData.state = true : viewDataTmp.pageData.state = false;
      viewDataTmp.packageDetail.promotionFlag == PromotionFlagEnum.Yes ? viewDataTmp.pageData.promotionFlag = true : viewDataTmp.pageData.promotionFlag = false;
      viewDataTmp.packageContentList = this.buildPackageContentList(viewDataTmp);
      viewDataTmp.packageContentList.forEach(item => {
        viewDataTmp.pageData.totalPrice += parseInt(item.price.toString()) * item.count;
      });
    }

    if (viewDataTmp.packageDetail.imgPaths) {
      viewDataTmp.pageData.imgPathListTmp = viewDataTmp.packageDetail.imgPaths;//临时图片
      viewDataTmp.pageData.limitCount -= viewDataTmp.packageDetail.imgPaths.length;
    } else {
      viewDataTmp.pageData.imgPathListTmp.push(viewDataTmp.pageData.defaultImg);
    }

    let StorePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    viewDataTmp.typeList = StorePackageProject.getValidPackageTypeMap().values();

    let packageList = StorePackageProject.getAllPackageProjectMap().values();
    for (let item of packageList) {
      viewDataTmp.packageNumberList.push(item.number);
    }

    return new Promise<EditPackageViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private buildPackageContentList(viewDataTmp: EditPackageViewData) {
    let packageContentListTmp: Array<ProductData> = new Array<ProductData>();
    let packageItems: Array<PackageItem> = new Array<PackageItem>();
    packageItems = AppUtils.cloneArray(viewDataTmp.packageDetail.packageItems);
    for (let item of packageItems) {
      let productData = new ProductData();
      productData.id = item.pgId;
      item.itemType == PackageItemEnum.PRODUCT ? productData.type = ItemTypeEnum.PRODUCT : productData.type = ItemTypeEnum.GOODS;
      item.count == 0 ? productData.userType = UseTypeEnum.UNLIMIT_NUMBER : productData.userType = UseTypeEnum.lIMIT_NUMBER;
      productData.count = item.count;
      productData.discountPrice = item.discountPrice;
      if (item.itemType == PackageItemEnum.PRODUCT) {
        if (viewDataTmp.productInfoMap) {
          let productInfo: ProductInfo = viewDataTmp.productInfoMap.get(item.pgId.toString());
          if (productInfo) {
            productData.name = productInfo.name;
            productData.price = productInfo.price;
          }
        }
      } else if (item.itemType == PackageItemEnum.GOODS) {
        if (viewDataTmp.goodsMap) {
          let goods: Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
          if (goods) {
            productData.name = goods.name;
            productData.price = goods.price;
          }
        }
      }
      packageContentListTmp.push(productData);
    }
    return packageContentListTmp;
  }


  /**
   *编辑套餐方法
   *@param storeId:string
   *@param formData:AddPackageData
   *@returns Promise<boolean>
   */
  public editPackage(formData: PackageProjectUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storePackageProjectMgr.updatePackageProject(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

}

export class EditPackageViewData {

  packageDetail: PackageProjectDetail = new PackageProjectDetail();
  typeList: Array<PackageProjectType> = new Array<PackageProjectType>();
  packageNumberList: Array<string> = new Array<string>();//项目编号list
  pageData: PageData = new PageData();
  packageContentList: Array<ProductData> = new Array<ProductData>();

  productInfoMap: ZmMap<ProductInfo>;
  goodsMap: ZmMap<Goods>;


  constructor() {
  }
}

export class PageData {
  isExitNumber: boolean = false;
  defaultNumber: string;
  defaultNumberPass: boolean;
  notRightNumber: boolean = false;

  totalPrice: number = 0;
  state: boolean;
  promotionFlag:boolean;

  imgPathListTmp: Array<string> = new Array<string>();
  defaultImg: string = Constants.PACKAGE_DEFAULT_IMG;
  limitCount: number = Constants.MAX_UPLOAD_IMG;
  maxCount: number = Constants.MAX_UPLOAD_IMG;

}
