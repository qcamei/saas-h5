import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {ChainPackageProjectMgr} from "../../../../bsModule/chainPackageProject/chainPackageProjectMgr";
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {ProductData} from "../../comp/packageContentComp/PackageContentCompViewData";
import {ActivatedRoute} from "@angular/router";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {ChainGoodsSynDataHolder} from "../../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {PackageProjectUpdateForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectUpdateForm";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {PriceData, StoreVD} from "../addPackage/addPackage";
import {PackageStateEnum} from "../../../../bsModule/chainPackageProject/data/PackageStateEnum";
import {UseTypeEnum} from "../../pipe/UseTypeEnum";
import {ChainPackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {PackageItem} from "../../../../bsModule/chainPackageProject/data/PackageItem";
import {PackageItemEnum} from "../../../../bsModule/chainPackageProject/data/PackageItemEnum";
import {PackageProjectDetail} from "../../../../bsModule/chainPackageProject/data/PackageProjectDetail";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectDetailCacheSynHolder";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {Product} from "../../../../bsModule/chainProduct/data/Product";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {Constants} from "../../../common/Util/Constants";
import {AddPackageTypeWithReturnComp} from "../../comp/addTypeWithReturn/addPackageTypeWithReturn";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {AppCfg} from "../../../../comModule/AppCfg";


@Component({
  selector: 'edit-package',
  templateUrl: 'editPackage.html',
})
export class EditPackageComp implements OnInit {

  private service: EditPackageService;
  public viewData: EditPackageViewData;
  private viewDataSub: any;
  public paramsSub: any;
  public requestUrl: string;

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditPackageService(
      this.chainPackageProjectMgr,
      this.chainPackageProjectSynDataHolder,
      this.chainPackageProjectViewDataMgr,
      this.packageDetailCacheDataHolder,
      this.chainProductSynDataHolder,
      this.chainGoodsSynDataHolder,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainPackageProjectViewDataMgr.subscribeEditPackageVD((viewDataP: EditPackageViewData) => {
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

  /**
   *新建分类
   */
  public addPackageType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId: string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddPackageTypeWithReturnComp, modalData, callBack);
  }

  private refreshTypeList(addTypeId: string) {
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainPackageProjectMgr.getChainPackageProject(chainId).then((chainPackageProject) => {
      this.viewData.typeList = chainPackageProject.getValidPackageTypeMap().values();
      this.viewData.packageDetail.typeId = Constants.PACKAGE_TYPE_PREFIX + chainId + "_" + addTypeId;
      this.service.handleViewData(this.viewData);
    });
  }

  /**
   *分配
   */
  public selectStore() {

    let modalData = {storeList: this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList: Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp, modalData, callBack);
  }

  private getSelectedStore(storeList: Array<StoreVD>) {
    this.viewData.selectStoreList = new Array();
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
    this.service.handleViewData(this.viewData);
  }

  removeStore() {
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
  }


  //计算折后价
  autoSetDiscount() {
    if (this.viewData.packageContentList.length == 0) {
      return ;
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

  private buildEditForm() {
    AppUtils.copy(this.editFormData, this.viewData.packageDetail);
    this.editFormData.applyStoreIds = this.viewData.selectStoreIds;
    (this.viewData.pageData.state === true) ? this.editFormData.state = PackageStateEnum.Open : this.editFormData.state = PackageStateEnum.Close;
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

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private packageDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(packageDetailId: string): void {
    this.chainPackageProjectViewDataMgr.setEditPackageViewData(new EditPackageViewData());

    this.buildViewData(packageDetailId).then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditPackageViewData) {
    this.chainPackageProjectViewDataMgr.setEditPackageViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId
   * @returns Promise<AddPackageViewData>
   */
  public async buildViewData(packageDetailId: string): Promise<EditPackageViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp = new EditPackageViewData();

    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    viewDataTmp.typeList = chainPackageProject.getValidPackageTypeMap().values();

    let packageList = chainPackageProject.getAllPackageProjectMap().values();
    for (let item of packageList) {
      viewDataTmp.packageNumberList.push(item.number);
    }

    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    let chainGoods: ChainGoods = await this.chainGoodsSynDataHolder.getData(chainId);
    if (chainProduct) {
      viewDataTmp.productInfoMap = chainProduct.getAllProductMap();
    }
    if (chainGoods) {
      viewDataTmp.goodsMap = chainGoods.getAllGoodsMap();
    }

    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if (pageResp) {
      viewDataTmp.storeList = pageResp.list.map((store) => {
        return StoreVD.fromStore(store);
      });
    }

    viewDataTmp.packageDetail = await this.packageDetailCacheDataHolder.getData(packageDetailId);
    if (viewDataTmp.packageDetail) {
      viewDataTmp.pageData.defaultNumber = viewDataTmp.packageDetail.number;
      viewDataTmp.packageDetail.state == PackageStateEnum.Open ? viewDataTmp.pageData.state = true : viewDataTmp.pageData.state = false;
      viewDataTmp.packageContentList = this.buildPackageContentList(viewDataTmp);
      viewDataTmp.packageContentList.forEach(item => {
        viewDataTmp.pageData.totalPrice += parseInt(item.price.toString()) * item.count;
      });

      if (viewDataTmp.packageDetail.imgPaths) {
        viewDataTmp.pageData.imgPathListTmp = viewDataTmp.packageDetail.imgPaths;//临时图片
        viewDataTmp.pageData.limitCount -= viewDataTmp.packageDetail.imgPaths.length;
      } else {
        viewDataTmp.pageData.imgPathListTmp.push(viewDataTmp.pageData.defaultImg);
      }

      viewDataTmp.selectStoreList = this.getSelectStoreList(viewDataTmp.storeList, viewDataTmp.packageDetail.applyStoreIds);
      viewDataTmp.selectStoreIds = viewDataTmp.selectStoreList.map((item) => {
        return item.id;
      });
    }

    return new Promise<EditPackageViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private getSelectStoreList(storeList: Array<StoreVD>, applyStoreIds: Array<string>) {
    let storeListTmp = new Array<StoreVD>();
    if (applyStoreIds) {
      for (let id of applyStoreIds) {
        storeList.forEach((item) => {
          if (item.id == id) {
            item.checked = true;
            storeListTmp.push(item);
          }
        });
      }
    }
    return storeListTmp;
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
          let product: Product = viewDataTmp.productInfoMap.get(item.pgId.toString());
          if (product) {
            productData.name = product.name;
            productData.price = product.sellPrice;
          }
        }
      } else if (item.itemType == PackageItemEnum.GOODS) {
        if (viewDataTmp.goodsMap) {
          let goods: Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
          if (goods) {
            productData.name = goods.name;
            productData.price = goods.sellPrice;
          }
        }
      }
      packageContentListTmp.push(productData);
    }
    return packageContentListTmp;
  }


  /**
   *编辑套餐方法
   *@param chainId:string
   *@param formData:AddPackageData
   *@returns Promise<boolean>
   */
  public editPackage(formData: PackageProjectUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainPackageProjectMgr.updatePackageProject(formData).then(
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

  productInfoMap: ZmMap<Product>;
  goodsMap: ZmMap<Goods>;

  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();


  constructor() {
  }
}

export class PageData {
  isExitNumber: boolean = false;
  defaultNumber: string;
  defaultNumberPass: boolean = false;
  notRightNumber: boolean = false;

  totalPrice: number = 0;
  state: boolean;

  imgPathListTmp: Array<string> = new Array<string>();
  defaultImg: string = Constants.PACKAGE_DEFAULT_IMG;
  limitCount: number = Constants.MAX_UPLOAD_IMG;
  maxCount: number = Constants.MAX_UPLOAD_IMG;
}
